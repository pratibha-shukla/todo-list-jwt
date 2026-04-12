const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, _res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/list", require("./routes/list")); 

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;


