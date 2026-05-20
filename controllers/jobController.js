const Job = require("../models/job");


exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { keyword, category, status } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.status = req.body.status;

    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};