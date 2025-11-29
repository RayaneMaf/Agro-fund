// const express = require('express');
// const authRoutes = require('./authRoutes');
// const projectRoutes = require('./projectRoutes');
// const applicationRoutes = require('./applicationRoutes');
// const jobRoutes = require('./jobRoutes');

// const router = express.Router();

// router.use('/auth', authRoutes);
// router.use('/projects', projectRoutes);
// router.use('/applications', applicationRoutes);
// router.use('/jobs', jobRoutes);

// module.exports = router;

const express = require("express");
const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const applicationRoutes = require("./applicationRoutes");
const jobRoutes = require("./jobRoutes");
const userRoutes = require("./userRoutes"); // 🆕 NEW

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/applications", applicationRoutes);
router.use("/jobs", jobRoutes);
router.use("/", userRoutes); // 🆕 NEW - For /farmers/:id, /investors/:id, etc.

module.exports = router;
