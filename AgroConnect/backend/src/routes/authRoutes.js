const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register/farmer', authController.registerFarmer);
router.post('/register/investor', authController.registerInvestor);
router.post('/register/jobseeker', authController.registerJobSeeker);
router.post('/login', authController.login);

module.exports = router;