// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware (PHẢI ĐẶT TRƯỚC ROUTES)
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

// Routes - mount contact routes (PHẢI SAU MIDDLEWARE, TRƯỚC module.exports)
const contactRoutes = require("./app/routes/contact.route");
app.use("/api/contacts", contactRoutes);

// Export app (PHẢI Ở CUỐI)
module.exports = app;
