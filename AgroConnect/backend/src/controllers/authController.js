const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

const generateToken = (userId, userType) => {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: "30d" });
};

const authController = {
  registerFarmer: async (req, res) => {
    try {
      const { first_name, last_name, email, password, phone, wilaya, address } =
        req.body;

      // Validation
      if (!first_name || !last_name || !email || !password || !wilaya) {
        return res
          .status(400)
          .json({ error: "All required fields must be provided" });
      }

      // Check if user exists
      const existingFarmer = await prisma.farmer.findUnique({
        where: { email },
      });
      const existingInvestor = await prisma.investor.findUnique({
        where: { email },
      });
      const existingJobSeeker = await prisma.jobSeeker.findUnique({
        where: { email },
      });

      if (existingFarmer || existingInvestor || existingJobSeeker) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create farmer
      const farmer = await prisma.farmer.create({
        data: {
          first_name,
          last_name,
          email,
          password_hash,
          phone: phone || null,
          wilaya,
          address: address || null,
        },
      });

      const token = generateToken(farmer.farmer_id, "farmer");

      // Response format matching frontend expectations
      res.status(201).json({
        id: farmer.farmer_id,
        email: farmer.email,
        first_name: farmer.first_name,
        last_name: farmer.last_name,
        phone: farmer.phone,
        wilaya: farmer.wilaya,
        token: token,
        type: "farmer",
      });
    } catch (error) {
      console.error("Register farmer error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  registerInvestor: async (req, res) => {
    try {
      const { first_name, last_name, email, password, phone, investor_type } =
        req.body;

      // Validation
      if (!first_name || !last_name || !email || !password || !investor_type) {
        return res
          .status(400)
          .json({ error: "All required fields must be provided" });
      }

      if (!["INDIVIDUAL", "COMPANY"].includes(investor_type)) {
        return res.status(400).json({ error: "Invalid investor type" });
      }

      // Check if user exists
      const existingFarmer = await prisma.farmer.findUnique({
        where: { email },
      });
      const existingInvestor = await prisma.investor.findUnique({
        where: { email },
      });
      const existingJobSeeker = await prisma.jobSeeker.findUnique({
        where: { email },
      });

      if (existingFarmer || existingInvestor || existingJobSeeker) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create investor
      const investor = await prisma.investor.create({
        data: {
          first_name,
          last_name,
          email,
          password_hash,
          phone: phone || null,
          investor_type,
        },
      });

      const token = generateToken(investor.investor_id, "investor");

      // Response format matching frontend expectations
      res.status(201).json({
        id: investor.investor_id,
        email: investor.email,
        first_name: investor.first_name,
        last_name: investor.last_name,
        phone: investor.phone,
        investor_type: investor.investor_type,
        token: token,
        type: "investor",
      });
    } catch (error) {
      console.error("Register investor error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  registerJobSeeker: async (req, res) => {
    try {
      const { first_name, last_name, email, password, phone, wilaya } =
        req.body;

      // Validation
      if (!first_name || !last_name || !email || !password || !wilaya) {
        return res
          .status(400)
          .json({ error: "All required fields must be provided" });
      }

      // Check if user exists
      const existingFarmer = await prisma.farmer.findUnique({
        where: { email },
      });
      const existingInvestor = await prisma.investor.findUnique({
        where: { email },
      });
      const existingJobSeeker = await prisma.jobSeeker.findUnique({
        where: { email },
      });

      if (existingFarmer || existingInvestor || existingJobSeeker) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create job seeker
      const jobSeeker = await prisma.jobSeeker.create({
        data: {
          first_name,
          last_name,
          email,
          password_hash,
          phone: phone || null,
          wilaya,
        },
      });

      // Changed from 'job_seeker' to 'jobseeker' to match frontend
      const token = generateToken(jobSeeker.job_seeker_id, "jobseeker");

      // Response format matching frontend expectations
      res.status(201).json({
        id: jobSeeker.job_seeker_id,
        email: jobSeeker.email,
        first_name: jobSeeker.first_name,
        last_name: jobSeeker.last_name,
        phone: jobSeeker.phone,
        wilaya: jobSeeker.wilaya,
        token: token,
        type: "jobseeker",
      });
    } catch (error) {
      console.error("Register job seeker error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Check in all user tables
      let user = await prisma.farmer.findUnique({ where: { email } });
      let userType = "farmer";

      if (!user) {
        user = await prisma.investor.findUnique({ where: { email } });
        userType = "investor";
      }

      if (!user) {
        user = await prisma.jobSeeker.findUnique({ where: { email } });
        // Changed from 'job_seeker' to 'jobseeker' to match frontend
        userType = "jobseeker";
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate token
      const userId =
        userType === "farmer"
          ? user.farmer_id
          : userType === "investor"
          ? user.investor_id
          : user.job_seeker_id;

      const token = generateToken(userId, userType);

      // Response format matching frontend expectations
      res.json({
        id: userId,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        wilaya: user.wilaya,
        investor_type: user.investor_type, // Will be undefined for non-investors
        token: token,
        type: userType,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = authController;
