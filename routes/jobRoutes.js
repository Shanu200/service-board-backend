const express = require("express");

const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJobStatus,
  closeJob,
  deleteJob,
  bookJob,
  markJobDone,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getJobs)
  .post(protect, createJob);

router.get(
  "/my-jobs",
  protect,
  getMyJobs
);

router
  .route("/:id")
  .get(getJobById)
  .patch(protect, updateJobStatus)
  .delete(protect, deleteJob);

router.patch(
  "/:id/book",
  protect,
  bookJob
);

router.patch(
  "/:id/done",
  protect,
  markJobDone
);

router.patch(
  "/:id/close",
   protect, 
   closeJob);

module.exports = router;