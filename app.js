const express = require("express");
const cors = require("cors");
const config = require("./app/config");
const contactRouter = require("./app/routes/contact.route");
const ApiError = require("./app/routes/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/contacts", contactRouter);

// Test route để kiểm tra
app.get("/test", (req, res) => {
  res.json({ message: "Server is working", routes: "GET /api/contacts should work" });
});

// 404 handler
app.use((req, res, next) => next(new ApiError(404, "Resource not found")));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
