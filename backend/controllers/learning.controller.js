const Language = require("../models/language.model");
const Level = require("../models/level.model");
const Question = require("../models/question.model");
const User = require("../models/user.models");
const Settings = require("../models/settings.model");
const Submission = require("../models/submission.model");

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
    const questions = await Question.find({ level: levelId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { questionId, code, timeTaken } = req.body;
    const question = await Question.findById(questionId).populate('level');
    if (!question) return res.status(404).json({ message: "Question not found" });

    let isCorrect = false;
    let errorMessage = "";
    let passedTests = 0;
    const totalTests = question.testCases.length;

    if (totalTests === 0) {
        return res.status(400).json({ message: "Configuration Error: No test cases available for this question." });
    }

    try {
        if (code.includes('process') || code.includes('require') || code.includes('import')) {
            throw new Error("Malicious code detected: usage of process/require/import is forbidden.");
        }

        const runner = new Function('input', `
            ${code}
            if (typeof solve !== 'function') {
                throw new Error("Your code must define a function named 'solve' (e.g. function solve(input) { ... })");
            }
            return solve(input);
        `);

        for (const testCase of question.testCases) {
            let inputData;
            try {
                inputData = JSON.parse(testCase.input);
            } catch {
                inputData = testCase.input;
            }

            const output = runner(inputData);
            if (String(output).trim() === String(testCase.expectedOutput).trim()) {
                passedTests++;
            } else {
                errorMessage = `Test case failed! Input: ${testCase.input} | Expected: ${testCase.expectedOutput} | Output: ${output}`;
                break;
            }
        }
        
        if (passedTests === totalTests) isCorrect = true;
    } catch (err) {
        isCorrect = false;
        errorMessage = `Runtime Error: ${err.message}`;
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
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    let isCorrect = false;
    let errorMessage = "";
    let passedTests = 0;
    const totalTests = question.testCases.length;

    if (totalTests === 0) {
        return res.status(400).json({ message: "Configuration Error: No test cases available for this question." });
    }

    try {
        if (code.includes('process') || code.includes('require') || code.includes('import')) {
            throw new Error("Malicious code detected: usage of process/require/import is forbidden.");
        }

        const runner = new Function('input', `
            ${code}
            if (typeof solve !== 'function') {
                throw new Error("Your code must define a function named 'solve' (e.g. function solve(input) { ... })");
            }
            return solve(input);
        `);

        for (const testCase of question.testCases) {
            let inputData;
            try {
                inputData = JSON.parse(testCase.input);
            } catch {
                inputData = testCase.input;
            }

            const output = runner(inputData);
            if (String(output).trim() === String(testCase.expectedOutput).trim()) {
                passedTests++;
            } else {
                errorMessage = `Test case failed! Input: ${testCase.input} | Expected: ${testCase.expectedOutput} | Output: ${output}`;
                break;
            }
        }
        
        if (passedTests === totalTests) isCorrect = true;
    } catch (err) {
        isCorrect = false;
        errorMessage = `Runtime Error: ${err.message}`;
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
