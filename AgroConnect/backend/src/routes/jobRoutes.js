const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes (order matters: specific routes BEFORE parameterized ones)
router.get('/', jobController.getAllJobs);
router.get('/filters', jobController.getJobFilters);

// Farmer only routes (specific routes first)
router.get('/my/jobs', authenticateToken, requireRole(['farmer']), jobController.getMyJobs);
router.post('/', authenticateToken, requireRole(['farmer']), jobController.createJob);

// Parameterized route MUST come last
router.get('/:id', jobController.getJobById);

module.exports = router;