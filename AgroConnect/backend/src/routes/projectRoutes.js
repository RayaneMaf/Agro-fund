const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/filters', projectController.getProjectFilters); // NEW ROUTE
router.get('/:id', projectController.getProjectById);

// Farmer only routes
router.post('/', authenticateToken, requireRole(['farmer']), projectController.createProject);
router.get('/my/projects', authenticateToken, requireRole(['farmer']), projectController.getMyProjects);

module.exports = router;