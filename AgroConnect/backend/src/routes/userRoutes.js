const express = require("express");
const prisma = require("../config/prisma");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get farmer's projects
router.get("/farmers/:id/projects", async (req, res) => {
  try {
    const projects = await prisma.projectPost.findMany({
      where: { farmer_id: parseInt(req.params.id) },
      include: {
        farmer: true,
        applications: {
          include: {
            investor: true,
          },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get farmer's jobs
router.get("/farmers/:id/jobs", async (req, res) => {
  try {
    const jobs = await prisma.employmentPost.findMany({
      where: { farmer_id: parseInt(req.params.id) },
      include: {
        farmer: true,
        applications: {
          include: {
            job_seeker: true,
          },
        },
      },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get investor's applications
router.get("/investors/:id/applications", async (req, res) => {
  try {
    const applications = await prisma.applicationForProjects.findMany({
      where: { investor_id: parseInt(req.params.id) },
      include: {
        project: {
          include: {
            farmer: true,
          },
        },
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get investor's investments
router.get("/investors/:id/investments", async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { investor_id: parseInt(req.params.id) },
      include: {
        project: {
          include: {
            farmer: true,
          },
        },
      },
    });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get job seeker's applications
router.get("/jobseekers/:id/applications", async (req, res) => {
  try {
    const applications = await prisma.applicationForEmployment.findMany({
      where: { job_seeker_id: parseInt(req.params.id) },
      include: {
        job: {
          include: {
            farmer: true,
          },
        },
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
