const Project = require("../models/project.model");

exports.createProject = async (req, res) => {
  try {
    const { title, description, liveLink, githubLink } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required." });
    }
    
    if (req.files.length > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 images allowed." });
    }
    
    if (!githubLink) {
        return res.status(400).json({ success: false, message: "GitHub link is required." });
    }
    
    const images = req.files.map(file => file.path.replace(/\\/g, '/')); // Normalize path for windows

    const newProject = new Project({
      user: req.user._id,
      title,
      description,
      liveLink,
      githubLink,
      images,
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get user projects error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!project) {
        return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
    }
    
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
