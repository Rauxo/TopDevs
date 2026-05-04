const Language = require("../models/language.model");
const Level = require("../models/level.model");
const Question = require("../models/question.model");
const Settings = require("../models/settings.model");

// --- LANGUAGE MANAGEMENT ---
exports.createLanguage = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    let icon = req.body.icon; // Can be a URL
    if (req.file) {
      icon = req.file.path.replace(/\\/g, "/"); // Or uploaded file
    }

    if (!name || !icon) {
      return res.status(400).json({ message: "Name and icon are required" });
    }

    const language = await Language.create({ name, description, order: order || 0, icon });
    res.status(201).json({ message: "Language created", language });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLanguage = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    const updateData = { name, description, order };
    if (req.file) {
      updateData.icon = req.file.path.replace(/\\/g, "/");
    } else if (req.body.icon) {
      updateData.icon = req.body.icon;
    }

    const language = await Language.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Language updated", language });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLanguage = async (req, res) => {
  try {
    await Language.findByIdAndDelete(req.params.id);
    await Level.deleteMany({ language: req.params.id });
    // Also delete questions related to those levels
    // (Complex cascading delete could be done, simplifying for now)
    res.status(200).json({ message: "Language deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LEVEL MANAGEMENT ---
exports.getLevels = async (req, res) => {
  try {
    const levels = await Level.find({ language: req.params.languageId }).sort({ levelNumber: 1 });
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLevel = async (req, res) => {
  try {
    const { languageId, levelNumber, heading, content } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.path.replace(/\\/g, "/");
    }

    const level = await Level.create({ language: languageId, levelNumber, heading, content, image });
    res.status(201).json({ message: "Level created", level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLevel = async (req, res) => {
  try {
    const { levelNumber, heading, content } = req.body;
    const updateData = { levelNumber, heading, content };
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const level = await Level.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Level updated", level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLevel = async (req, res) => {
  try {
    await Level.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ level: req.params.id });
    res.status(200).json({ message: "Level deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- QUESTION MANAGEMENT ---
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ level: req.params.levelId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { levelId, title, description, boilerplateCode, points } = req.body;
    let testCases = req.body.testCases;
    if (typeof testCases === 'string') {
        try { testCases = JSON.parse(testCases); } catch(e){}
    }

    const question = await Question.create({
      level: levelId, title, description, boilerplateCode, testCases, points
    });
    res.status(201).json({ message: "Question created", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { title, description, boilerplateCode, points } = req.body;
    let testCases = req.body.testCases;
    if (typeof testCases === 'string') {
        try { testCases = JSON.parse(testCases); } catch(e){}
    }

    const updateData = { title, description, boilerplateCode, points };
    if (testCases) updateData.testCases = testCases;

    const question = await Question.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Question updated", question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- SETTINGS MANAGEMENT ---
exports.updateSettings = async (req, res) => {
  try {
    const { levelRanges } = req.body; // Array of { minLevel, maxLevel, tickColor }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ levelRanges });
    } else {
      settings.levelRanges = levelRanges;
      await settings.save();
    }
    res.status(200).json({ message: "Settings updated", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
