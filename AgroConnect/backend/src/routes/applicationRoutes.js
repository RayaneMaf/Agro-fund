// // const express = require("express");
// // const applicationController = require("../controllers/applicationController");
// // const {
// //   authenticateToken,
// //   requireRole,
// // } = require("../middlewares/authMiddleware");

// // const router = express.Router();

// // // Investor routes for projects
// // router.post(
// //   "/project/:project_id/apply",
// //   authenticateToken,
// //   requireRole(["investor"]),
// //   applicationController.applyToProject
// // );
// // router.get(
// //   "/my/applications",
// //   authenticateToken,
// //   requireRole(["investor"]),
// //   applicationController.getMyApplications
// // );

// // // Farmer routes for projects
// // router.get(
// //   "/project/:project_id",
// //   authenticateToken,
// //   requireRole(["farmer"]),
// //   applicationController.getProjectApplications
// // );
// // router.patch(
// //   "/project/:application_id/accept",
// //   authenticateToken,
// //   requireRole(["farmer"]),
// //   applicationController.acceptApplication
// // );

// // // Job Seeker routes for jobs
// // router.post(
// //   "/job/:job_id/apply",
// //   authenticateToken,
// //   requireRole(["job_seeker"]),
// //   applicationController.applyToJob
// // );
// // router.get(
// //   "/my/job-applications",
// //   authenticateToken,
// //   requireRole(["job_seeker"]),
// //   applicationController.getMyJobApplications
// // );

// // // Farmer routes for jobs
// // router.get(
// //   "/job/:job_id",
// //   authenticateToken,
// //   requireRole(["farmer"]),
// //   applicationController.getJobApplications
// // );
// // router.patch(
// //   "/job/:application_id/accept",
// //   authenticateToken,
// //   requireRole(["farmer"]),
// //   applicationController.acceptJobApplication
// // );

// // module.exports = router;

// const express = require("express");
// const applicationController = require("../controllers/applicationController");
// const {
//   authenticateToken,
//   requireRole,
// } = require("../middlewares/authMiddleware");

// const router = express.Router();

// // 🆕 NEW ROUTES - Match Replit frontend expectations
// router.post(
//   "/project",
//   authenticateToken,
//   applicationController.createProjectApplication
// );
// router.post(
//   "/project/:id/accept",
//   authenticateToken,
//   applicationController.acceptProjectApplication
// );
// router.post(
//   "/project/:id/reject",
//   authenticateToken,
//   applicationController.rejectProjectApplication
// );

// router.post(
//   "/job",
//   authenticateToken,
//   applicationController.createJobApplication
// );
// router.post(
//   "/job/:id/accept",
//   authenticateToken,
//   applicationController.acceptJobApplication
// );
// router.post(
//   "/job/:id/reject",
//   authenticateToken,
//   applicationController.rejectJobApplication
// );

// // Existing routes
// router.post(
//   "/project/:project_id/apply",
//   authenticateToken,
//   requireRole(["investor"]),
//   applicationController.applyToProject
// );
// router.get(
//   "/my/applications",
//   authenticateToken,
//   requireRole(["investor"]),
//   applicationController.getMyApplications
// );
// router.get(
//   "/project/:project_id",
//   authenticateToken,
//   requireRole(["farmer"]),
//   applicationController.getProjectApplications
// );
// router.patch(
//   "/project/:application_id/accept",
//   authenticateToken,
//   requireRole(["farmer"]),
//   applicationController.acceptApplication
// );
// router.post(
//   "/job/:job_id/apply",
//   authenticateToken,
//   requireRole(["jobseeker"]),
//   applicationController.applyToJob
// );
// router.get(
//   "/my/job-applications",
//   authenticateToken,
//   requireRole(["jobseeker"]),
//   applicationController.getMyJobApplications
// );
// router.get(
//   "/job/:job_id",
//   authenticateToken,
//   requireRole(["farmer"]),
//   applicationController.getJobApplications
// );
// router.patch(
//   "/job/:application_id/accept",
//   authenticateToken,
//   requireRole(["farmer"]),
//   applicationController.acceptJobApplication
// );

// module.exports = router;
const express = require("express");
const applicationController = require("../controllers/applicationController");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// ============================================
// PROJECT APPLICATION ROUTES
// ============================================

// Get my project applications (Investor only)
// Added this route that your frontend needs
router.get(
  "/my/projects",
  authenticateToken,
  requireRole(["investor"]),
  applicationController.getMyApplications
);

// Alternative route (keeping for compatibility)
router.get(
  "/my/applications",
  authenticateToken,
  requireRole(["investor"]),
  applicationController.getMyApplications
);

// Apply to a project (Investor only)
router.post(
  "/project",
  authenticateToken,
  requireRole(["investor"]),
  applicationController.createProjectApplication
);

// Apply to project (alternative route)
router.post(
  "/project/:project_id/apply",
  authenticateToken,
  requireRole(["investor"]),
  applicationController.applyToProject
);

// Get applications for a specific project (Farmer only)
router.get(
  "/project/:project_id",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.getProjectApplications
);

// Accept project application (Farmer only)
router.post(
  "/project/:id/accept",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.acceptProjectApplication
);

router.patch(
  "/project/:application_id/accept",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.acceptApplication
);

// Reject project application (Farmer only)
router.post(
  "/project/:id/reject",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.rejectProjectApplication
);

// ============================================
// JOB APPLICATION ROUTES
// ============================================

// Get my job applications (Job Seeker only)
router.get(
  "/my/jobs",
  authenticateToken,
  requireRole(["jobseeker"]),
  applicationController.getMyJobApplications
);

// Alternative route (keeping for compatibility)
router.get(
  "/my/job-applications",
  authenticateToken,
  requireRole(["jobseeker"]),
  applicationController.getMyJobApplications
);

// Apply to a job (Job Seeker only)
router.post(
  "/job",
  authenticateToken,
  requireRole(["jobseeker"]),
  applicationController.createJobApplication
);

// Apply to job (alternative route)
router.post(
  "/job/:job_id/apply",
  authenticateToken,
  requireRole(["jobseeker"]),
  applicationController.applyToJob
);

// Get applications for a specific job (Farmer only)
router.get(
  "/job/:job_id",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.getJobApplications
);

// Accept job application (Farmer only)
router.post(
  "/job/:id/accept",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.acceptJobApplication
);

router.patch(
  "/job/:application_id/accept",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.acceptJobApplication
);

// Reject job application (Farmer only)
router.post(
  "/job/:id/reject",
  authenticateToken,
  requireRole(["farmer"]),
  applicationController.rejectJobApplication
);

module.exports = router;
