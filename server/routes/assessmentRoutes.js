const express = require("express");
const rateLimit = require("express-rate-limit");
const adminAuth = require("../middleware/adminAuth");
const c = require("../controllers/assessmentController");

const router = express.Router();

// Heroku puts the visitor's IP first in X-Forwarded-For.
const clientIp = (req) =>
  (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip;

// Generous enough for a whole job fair sharing one Wi-Fi network,
// strict enough to stop someone scripting thousands of reports.
const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: clientIp,
  validate: false,
  message: { success: false, message: "Too many submissions. Please wait a few minutes." },
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: clientIp,
  validate: false,
});

// Public
router.get("/form", c.getForm);
router.post("/", submitLimiter, c.createAssessment);
router.get("/result/:publicId", readLimiter, c.getPublicResult);

// Admin only
router.get("/", adminAuth, c.listAssessments);
router.get("/:id", adminAuth, c.getAssessment);
router.patch("/:id", adminAuth, c.updateAssessment);
router.post("/:id/regenerate", adminAuth, c.regenerate);
router.delete("/:id", adminAuth, c.deleteAssessment);

module.exports = router;
