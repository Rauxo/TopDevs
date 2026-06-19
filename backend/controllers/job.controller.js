const jobModel = require("../models/job.model");
const jobApplicationModel = require("../models/jobApplication.model");

exports.createJob = async (req, res) => {
  try {
    const { jobTitle, description, requirements, expiredDate, location, salary, jobType } = req.body;

    if (!jobTitle || !description || !requirements || !expiredDate || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newJob = await jobModel.create({
      jobTitle,
      description,
      requirements,
      expiredDate,
      location,
      salary,
      jobType,
      company: req.company._id,
    });

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create job" });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find().populate("company", "name email companyIcon");
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id).populate("company", "name email companyIcon phone address");
    if (!job) return res.status(404).json({ message: "Job not found" });

    let alreadyApplied = false;
    if (req.cookies.token) {
      try {
        const decoded = require("jsonwebtoken").verify(req.cookies.token, process.env.JWT_SECRET);
        const application = await jobApplicationModel.findOne({ job: job._id, user: decoded.id });
        if (application) alreadyApplied = true;
      } catch (err) {
        // Token invalid or expired, just ignore
      }
    }

    res.status(200).json({ job, alreadyApplied });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { name, phone, email, address, education, jobId } = req.body;
    const resume = req.file ? req.file.path.replace(/\\/g, "/") : "";

    if (!name || !phone || !email || !address || !education || !jobId || !resume) {
      return res.status(400).json({ message: "All fields are required including resume" });
    }

    const application = await jobApplicationModel.create({
      name,
      phone,
      resume,
      email,
      address,
      education,
      job: jobId,
      user: req.user._id,
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({ company: req.company._id }).sort({ createdAt: -1 });
    
    // Fetch application counts for each job
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const count = await jobApplicationModel.countDocuments({ job: job._id });
      return { ...job.toObject(), applicationCount: count };
    }));

    res.status(200).json({ jobs: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company jobs" });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const applications = await jobApplicationModel.find({ job: req.params.jobId }).populate("user", "username email profileImg");
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await jobApplicationModel
      .find({ user: req.user._id })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name email companyIcon",
        },
      });
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Applied", "Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await jobApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Status updated successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.deleteCompanyJob = async (req, res) => {
  try {
    const job = await jobModel.findOneAndDelete({ _id: req.params.id, company: req.company._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized to delete" });
    }
    
    // Optionally delete all related applications
    await jobApplicationModel.deleteMany({ job: req.params.id });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
