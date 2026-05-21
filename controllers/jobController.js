const Job = require("../models/job");


exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {

    console.log("QUERY:", req.query);

    const {
      keyword,
      category,
      status,
    } = req.query;

    let query = {};

    // SEARCH
    if (
      keyword &&
      keyword.trim() !== ""
    ) {

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

    // CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    // STATUS FILTER
    if (status) {
      query.status = status;
    }

    console.log(
      "MONGO QUERY:",
      query
    );

    const jobs = await Job.find(query)
      .sort({
        createdAt: -1,
      });

    console.log(
      "FOUND JOBS:",
      jobs.length
    );

    res.json(jobs);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
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

exports.getMyJobs = async (req, res) => {
  try {

    const jobs = await Job.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(jobs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
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

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
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


    if (job.user.toString() !== req.user._id.toString()) {
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
exports.bookJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.status !== "OPEN") {
      return res.status(400).json({
        message: "Job already booked",
      });
    }

    if (job.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot book your own job",
      });
    }

    job.status = "IN_PROGRESS";
    job.bookedBy = req.user._id;

    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.markJobDone = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (
      !job.bookedBy ||
      String(job.bookedBy) !== String(req.user._id)
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    job.status = "DONE";

    await job.save();

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.closeJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (
      job.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (job.status !== "DONE") {
      return res.status(400).json({
        message: "Job must be DONE first",
      });
    }

    job.status = "CLOSED";

    await job.save();

    res.json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};