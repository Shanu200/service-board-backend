const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    location: {
      type: String,
    },

    contactName: {
      type: String,
    },

    contactEmail: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);