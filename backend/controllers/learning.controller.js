const Language = require("../models/language.model");
const Level = require("../models/level.model");
const Question = require("../models/question.model");
const User = require("../models/user.models");
const Settings = require("../models/settings.model");
const Submission = require("../models/submission.model");
const axios = require("axios");

const getPistonConfig = (languageName, userCode) => {
    const lang = languageName.toLowerCase();
    switch(lang) {
        case 'python':
            return {
                language: 'python',
                version: '*',
                content: `import sys\nimport json\n\n${userCode}\n\nif __name__ == '__main__':\n    input_data = sys.stdin.read().strip()\n    try:\n        parsed = json.loads(input_data)\n        print(solve(parsed))\n    except:\n        print(solve(input_data))\n`
            };
        case 'go':
            return {
                language: 'go',
                version: '*',
                content: `package main\nimport (\n\t"fmt"\n\t"io/ioutil"\n\t"os"\n)\n\n${userCode}\n\nfunc main() {\n\tbytes, _ := ioutil.ReadAll(os.Stdin)\n\tfmt.Print(solve(string(bytes)))\n}\n`
            };
        case 'c++':
        case 'cpp':
            return {
                language: 'c++',
                version: '*',
                content: `#include <iostream>\n#include <string>\nusing namespace std;\n\n${userCode}\n\nint main() {\n    string input;\n    getline(cin, input);\n    cout << solve(input);\n    return 0;\n}\n`
            };
        case 'java':
            return {
                language: 'java',
                version: '*',
                content: `import java.util.Scanner;\n\npublic class Main {\n\n${userCode}\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if(scanner.hasNextLine()) {\n            System.out.print(solve(scanner.nextLine()));\n        }\n    }\n}\n`
            };
        case 'javascript':
        case 'js':
        default:
            return {
                language: 'javascript',
                version: '*',
                content: `const fs = require('fs');\n\n${userCode}\n\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\ntry {\n    const parsed = JSON.parse(input);\n    console.log(solve(parsed));\n} catch (e) {\n    console.log(solve(input));\n}\n`
            };
    }
};

const executeWithPiston = async (languageName, code, input) => {
    const config = getPistonConfig(languageName, code);
    const payload = {
        language: config.language,
        version: config.version,
        files: [{ content: config.content }],
        stdin: String(input)
    };
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", payload);
        if (response.data.compile && response.data.compile.code !== 0) {
            throw new Error(response.data.compile.output);
        }
        if (response.data.run.code !== 0) {
            throw new Error(response.data.run.output);
        }
        return response.data.run.output;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.find().sort({ order: 1 });
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.selectLanguage = async (req, res) => {
  try {
    const { languageId } = req.body;
    const user = await User.findById(req.user._id);

    const exists = user.selectedLanguages.find(sl => sl.language.toString() === languageId);
    if (exists) {
      return res.status(400).json({ message: "Language already selected" });
    }

    user.selectedLanguages.push({
      language: languageId,
      currentLevel: 1,
      completedLevels: [],
      startDate: new Date(),
      progress: 0
    });

    await user.save();
    res.status(200).json({ message: "Language selected successfully", selectedLanguages: user.selectedLanguages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLevels = async (req, res) => {
  try {
    const { languageId } = req.params;
    const levels = await Level.find({ language: languageId }).sort({ levelNumber: 1 });
    
    const user = await User.findById(req.user._id);
    const selectedLang = user.selectedLanguages.find(sl => sl.language.toString() === languageId);

    if (!selectedLang) {
      return res.status(403).json({ message: "Language not selected by user" });
    }

    // Mark levels as locked/unlocked based on previous level completion
    const processedLevels = levels.map((level, index) => {
      // Level 1 is always unlocked
      if (level.levelNumber === 1) {
        return {
          ...level._doc,
          isUnlocked: true,
          isCompleted: selectedLang.completedLevels.includes(level._id)
        };
      }
      
      // Other levels are unlocked only if the previous level is completed
      const prevLevel = levels[index - 1];
      const isUnlocked = selectedLang.completedLevels.includes(prevLevel._id);

      return {
        ...level._doc,
        isUnlocked,
        isCompleted: selectedLang.completedLevels.includes(level._id)
      };
    });

    res.status(200).json(processedLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLevelContent = async (req, res) => {
  try {
    const { levelId } = req.params;
    const level = await Level.findById(levelId).populate('language');
    if (!level) return res.status(404).json({ message: "Level not found" });

    // Security Check: Ensure user has selected this language and unlocked this level
    const user = await User.findById(req.user._id);
    const selectedLang = user.selectedLanguages.find(sl => sl.language.toString() === level.language._id.toString());
    
    if (!selectedLang) return res.status(403).json({ message: "Language not selected" });
    
    if (level.levelNumber > 1) {
        const prevLevel = await Level.findOne({ language: level.language._id, levelNumber: level.levelNumber - 1 });
        if (!selectedLang.completedLevels.includes(prevLevel._id)) {
            return res.status(403).json({ message: "Complete previous level first" });
        }
    }

    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { levelId } = req.params;
    const questions = await Question.find({ level: levelId }).populate({
        path: 'level',
        populate: { path: 'language' }
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { questionId, code, timeTaken } = req.body;
    const question = await Question.findById(questionId).populate({
        path: 'level',
        populate: { path: 'language' }
    });
    if (!question) return res.status(404).json({ message: "Question not found" });

    const languageName = question.level.language.name;

    let isCorrect = false;
    let errorMessage = "";
    let passedTests = 0;
    const totalTests = question.testCases.length;

    if (totalTests === 0) {
        return res.status(400).json({ message: "Configuration Error: No test cases available for this question." });
    }

    try {
        for (const testCase of question.testCases) {
            const output = await executeWithPiston(languageName, code, testCase.input);
            if (String(output).trim() === String(testCase.expectedOutput).trim()) {
                passedTests++;
            } else {
                errorMessage = `Test case failed! Input: ${testCase.input} | Expected: ${testCase.expectedOutput} | Output: ${String(output).trim()}`;
                break;
            }
        }
        
        if (passedTests === totalTests) isCorrect = true;
    } catch (err) {
        isCorrect = false;
        errorMessage = `Execution Error: ${err.message}`;
    }

    const submission = await Submission.create({
      user: req.user._id,
      question: questionId,
      language: question.level.language,
      code,
      timeTaken,
      status: isCorrect ? "Accepted" : "Wrong Answer",
      pointsAwarded: isCorrect ? question.points : 0
    });

    if (isCorrect) {
      const user = await User.findById(req.user._id);
      user.points += question.points;

      // Update progress
      const langId = question.level.language.toString();
      const selectedLang = user.selectedLanguages.find(sl => sl.language.toString() === langId);

      if (selectedLang) {
        if (!selectedLang.completedLevels.includes(question.level._id)) {
            // Check if all questions for this level are solved (simplification: one question per level for now)
            selectedLang.completedLevels.push(question.level._id);
            
            // Increment level if this was the current level
            if (question.level.levelNumber === selectedLang.currentLevel) {
                selectedLang.currentLevel += 1;
            }

            // Calculate progress %
            const totalLevels = await Level.countDocuments({ language: langId });
            selectedLang.progress = Math.round((selectedLang.completedLevels.length / totalLevels) * 100);

            if (selectedLang.progress === 100 && !selectedLang.completionDate) {
                selectedLang.completionDate = new Date();
            }
        }
      }

      // Check for profile level upgrade (40 points per level)
      const newProfileLevel = Math.floor(user.points / 40) + 1;
      if (newProfileLevel > user.profileLevel) {
        user.profileLevel = newProfileLevel;
      }

      await user.save();
      return res.status(200).json({ 
        message: "Correct solution!", 
        pointsAwarded: question.points,
        userPoints: user.points,
        profileLevel: user.profileLevel,
        nextLevelUnlocked: true
      });
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.runCode = async (req, res) => {
  try {
    const { questionId, code } = req.body;
    const question = await Question.findById(questionId).populate({
        path: 'level',
        populate: { path: 'language' }
    });
    if (!question) return res.status(404).json({ message: "Question not found" });

    const languageName = question.level.language.name;

    let isCorrect = false;
    let errorMessage = "";
    let passedTests = 0;
    const totalTests = question.testCases.length;

    if (totalTests === 0) {
        return res.status(400).json({ message: "Configuration Error: No test cases available for this question." });
    }

    try {
        for (const testCase of question.testCases) {
            const output = await executeWithPiston(languageName, code, testCase.input);
            if (String(output).trim() === String(testCase.expectedOutput).trim()) {
                passedTests++;
            } else {
                errorMessage = `Test case failed! Input: ${testCase.input} | Expected: ${testCase.expectedOutput} | Output: ${String(output).trim()}`;
                break;
            }
        }
        
        if (passedTests === totalTests) isCorrect = true;
    } catch (err) {
        isCorrect = false;
        errorMessage = `Execution Error: ${err.message}`;
    }

    if (isCorrect) {
      return res.status(200).json({ message: "All test cases passed locally! Ready to submit." });
    } else {
      return res.status(400).json({ message: errorMessage });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({
        levelRanges: [
          { minLevel: 1, maxLevel: 10, tickColor: "#FFFFFF" },
          { minLevel: 11, maxLevel: 20, tickColor: "#3B82F6" },
          { minLevel: 21, maxLevel: 50, tickColor: "#10B981" }
        ]
      });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
