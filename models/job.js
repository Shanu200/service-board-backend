const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: String
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);