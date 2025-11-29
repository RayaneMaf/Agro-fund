const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ error: "Access token required" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Verify user still exists in database
//     let user;
//     switch (decoded.userType) {
//       case "farmer":
//         user = await prisma.farmer.findUnique({
//           where: { farmer_id: decoded.userId },
//         });
//         break;
//       case "investor":
//         user = await prisma.investor.findUnique({
//           where: { investor_id: decoded.userId },
//         });
//         break;
//       case "job_seeker":
//         user = await prisma.jobSeeker.findUnique({
//           where: { job_seeker_id: decoded.userId },
//         });
//         break;
//       default:
//         return res.status(403).json({ error: "Invalid user type" });
//     }

//     if (!user) {
//       return res.status(403).json({ error: "User no longer exists" });
//     }

//     req.user = {
//       userId: decoded.userId,
//       userType: decoded.userType,
//       email: user.email,
//     };

//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.status(403).json({ error: "Invalid or expired token" });
//   }
// };

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists in database
    let user;
    switch (decoded.userType) {
      case "farmer":
        user = await prisma.farmer.findUnique({
          where: { farmer_id: decoded.userId },
        });
        break;
      case "investor":
        user = await prisma.investor.findUnique({
          where: { investor_id: decoded.userId },
        });
        break;
      case "jobseeker": // Changed from 'job_seeker'
        user = await prisma.jobSeeker.findUnique({
          where: { job_seeker_id: decoded.userId },
        });
        break;
      default:
        return res.status(403).json({ error: "Invalid user type" });
    }

    if (!user) {
      return res.status(403).json({ error: "User no longer exists" });
    }

    req.user = {
      userId: decoded.userId,
      userType: decoded.userType,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({
        error: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole };
