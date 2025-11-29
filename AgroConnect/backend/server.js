// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;
// require("dotenv").config();

// const routes = require("./src/routes");

// // Middleware
// app.use(express.json());
// app.use(require("cors")());

// // API Routes
// app.use("/api", routes);

// // Health check
// app.get("/health", (req, res) => {
//   res.json({
//     message: "AgroConnect API is running!",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log(`📍 Health check: http://localhost:${port}/health`);
//   console.log(`📍 API Base: http://localhost:${port}/api`);
// });
const express = require("express");
const app = express();
const port = process.env.PORT || 5000; // Changed to 5000
require("dotenv").config();

const routes = require("./src/routes");

// Middleware
app.use(express.json());

// CORS Configuration - Allow frontend on port 3000
app.use(
  require("cors")({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// API Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    message: "AgroConnect API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`📍 API Base: http://localhost:${port}/api`);
});
