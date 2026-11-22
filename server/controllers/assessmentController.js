const crypto = require("crypto");
const { Op } = require("sequelize");
const Assessment = require("../models/Assessment");
const Course = require("../models/Course");
const Category = require("../models/Category");
const {
  QUESTIONS,
  AGE_RANGES,
  validateAnswers,
  describeAnswers,
} = require("../config/assessmentQuestions");
const { generateReport } = require("../services/assessmentAI");

const FOLLOW_UP = ["new", "contacted", "registered", "not_interested"];
const MAX_PER_DAY = Number(process.env.MAX_ASSESSMENTS_PER_DAY) || 1000;
const MAX_CONCURRENT = Number(process.env.ASSESSMENT_CONCURRENCY) || 3;
const STALE_MS = 4 * 60 * 1000;

// ---------------------------------------------------------------------------
// Report generation queue (keeps bursts at a job fair under API rate limits)
// ---------------------------------------------------------------------------
const inFlight = new Set();
const waiting = [];
let running = 0;

function queueGeneration(id) {
  if (inFlight.has(id)) return;
  inFlight.add(id);
  waiting.push(id);
  pump();
}

function pump() {
  while (running < MAX_CONCURRENT && waiting.length) {
    const id = waiting.shift();
    running += 1;
    runGeneration(id)
      .catch((err) => console.error(`[assessment ${id}] unexpected error`, err))
      .finally(() => {
        running -= 1;
        inFlight.delete(id);
        pump();
      });
  }
}

async function runGeneration(id) {
  const assessment = await Assessment.findByPk(id);
  if (!assessment) return;

  const started = Date.now();
  try {
    const { result, model, usage } = await generateReport(assessment);
    await assessment.update({
      result,
      status: "completed",
      errorMessage: null,
      recommendedPath: result.recommendedPath ? String(result.recommendedPath.title).slice(0, 160) : null,
      leadScore: result.adminInsights ? result.adminInsights.leadScore : null,
      aiModel: model,
      inputTokens:
        (usage.input_tokens || 0) +
        (usage.cache_read_input_tokens || 0) +
        (usage.cache_creation_input_tokens || 0),
      outputTokens: usage.output_tokens || null,
      generatedAt: new Date(),
    });
    console.log(`[assessment ${id}] report ready in ${Math.round((Date.now() - started) / 1000)}s`);
  } catch (err) {
    console.error(`[assessment ${id}] report failed:`, err.message);
    await assessment.update({
      status: "failed",
      errorMessage: String(err.message || err).slice(0, 1000),
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function cleanText(value, max) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

async function enrichCourses(result) {
  const recs = (result && result.recommendedCourses) || [];
  if (!recs.length) return [];
  const courses = await Course.findAll({
    where: { id: recs.map((r) => r.courseId) },
    include: [{ model: Category, attributes: ["name"] }],
  });
  const byId = new Map(courses.map((c) => [c.id, c]));
  return recs
    .filter((r) => byId.has(r.courseId))
    .map((r) => {
      const c = byId.get(r.courseId);
      return {
        id: c.id,
        title: String(c.title || "").trim(),
        image: c.image || null,
        // Some live courses have 0 or -1 hours; don't show those.
        durationHours: c.duration > 0 ? c.duration : null,
        category: c.Category ? c.Category.name.trim() : null,
        reason: r.reason,
      };
    });
}

function publicResult(result) {
  if (!result) return null;
  const { adminInsights, ...visible } = result;
  return visible;
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

// GET /api/assessments/form
exports.getForm = (req, res) => {
  res.json({ success: true, data: { questions: QUESTIONS, ageRanges: AGE_RANGES } });
};

// POST /api/assessments
exports.createAssessment = async (req, res) => {
  try {
    // Note: an older version had a hidden "website" honeypot field. Mobile autofill filled it for real
    // visitors, who then got a fake report link. Any "website" value is now ignored; abuse is limited by
    // the per-IP rate limit and the daily cap instead.
    const body = req.body || {};

    const fullName = cleanText(body.fullName, 120);
    const phone = cleanText(body.phone, 40);
    const email = cleanText(body.email, 160).toLowerCase();
    const language = body.language === "en" ? "en" : "ar";
    const ageRange = AGE_RANGES.some((a) => a.value === body.ageRange) ? body.ageRange : null;
    const source = cleanText(body.source, 60).toLowerCase().replace(/[^a-z0-9_-]/g, "") || null;

    const fieldErrors = [];
    if (fullName.length < 2) fieldErrors.push("fullName");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]+$/.test(phone)) fieldErrors.push("phone");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.push("email");
    if (body.consent !== true) fieldErrors.push("consent");

    const { answers, errors } = validateAnswers(body.answers);
    if (fieldErrors.length || errors.length) {
      return res.status(400).json({
        success: false,
        message: "Some answers are missing or invalid",
        fields: [...fieldErrors, ...errors],
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = await Assessment.count({ where: { createdAt: { [Op.gte]: startOfDay } } });
    if (today >= MAX_PER_DAY) {
      return res.status(429).json({
        success: false,
        message: "We have reached today's limit. Please try again tomorrow.",
      });
    }

    const assessment = await Assessment.create({
      publicId: crypto.randomBytes(16).toString("hex"),
      fullName,
      phone,
      email: email || null,
      ageRange,
      language,
      source,
      consent: true,
      answers,
      status: "pending",
    });

    queueGeneration(assessment.id);

    res.status(201).json({ success: true, publicId: assessment.publicId });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(500).json({ success: false, message: "Could not save your answers" });
  }
};

// GET /api/assessments/result/:publicId
exports.getPublicResult = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ where: { publicId: req.params.publicId } });
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Recover reports that were interrupted (for example by a server restart).
    if (
      assessment.status === "pending" &&
      !inFlight.has(assessment.id) &&
      Date.now() - new Date(assessment.updatedAt).getTime() > STALE_MS
    ) {
      queueGeneration(assessment.id);
    }

    const data = {
      status: assessment.status,
      fullName: assessment.fullName,
      language: assessment.language,
      createdAt: assessment.createdAt,
    };
    if (assessment.status === "completed") {
      data.result = publicResult(assessment.result);
      data.courses = await enrichCourses(assessment.result);
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching assessment result:", error);
    res.status(500).json({ success: false, message: "Could not load the report" });
  }
};

// ---------------------------------------------------------------------------
// Admin endpoints
// ---------------------------------------------------------------------------

// GET /api/assessments
exports.listAssessments = async (req, res) => {
  try {
    const rows = await Assessment.findAll({ order: [["createdAt", "DESC"]], limit: 2000 });

    const statusQuestion = QUESTIONS.find((q) => q.id === "currentStatus");
    const data = rows.map((a) => {
      const r = a.result || {};
      const statusValue = a.answers ? a.answers.currentStatus : null;
      const statusOption = statusQuestion && statusQuestion.options.find((x) => x.value === statusValue);
      return {
        visitorType: statusValue,
        visitorTypeLabel: statusOption ? statusOption.en : null,
        id: a.id,
        publicId: a.publicId,
        fullName: a.fullName,
        phone: a.phone,
        email: a.email,
        ageRange: a.ageRange,
        language: a.language,
        source: a.source,
        status: a.status,
        followUpStatus: a.followUpStatus,
        leadScore: a.leadScore,
        recommendedPath: a.recommendedPath,
        matchScore: r.recommendedPath ? r.recommendedPath.matchScore : null,
        topCourse: r.recommendedCourses && r.recommendedCourses[0] ? r.recommendedCourses[0].title : null,
        insight: r.adminInsights ? r.adminInsights.summary : null,
        hasNotes: Boolean(a.adminNotes),
        aiModel: a.aiModel,
        inputTokens: a.inputTokens,
        outputTokens: a.outputTokens,
        createdAt: a.createdAt,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error listing assessments:", error);
    res.status(500).json({ success: false, message: "Could not load assessments" });
  }
};

// GET /api/assessments/:id
exports.getAssessment = async (req, res) => {
  try {
    const a = await Assessment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      data: {
        ...a.toJSON(),
        answersReadable: describeAnswers(a.answers || {}, "en"),
        courses: a.status === "completed" ? await enrichCourses(a.result) : [],
      },
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({ success: false, message: "Could not load the assessment" });
  }
};

// PATCH /api/assessments/:id   { followUpStatus?, adminNotes? }
exports.updateAssessment = async (req, res) => {
  try {
    const a = await Assessment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: "Not found" });

    const updates = {};
    if (req.body.followUpStatus !== undefined) {
      if (!FOLLOW_UP.includes(req.body.followUpStatus)) {
        return res.status(400).json({ success: false, message: "Unknown follow-up status" });
      }
      updates.followUpStatus = req.body.followUpStatus;
    }
    if (req.body.adminNotes !== undefined) {
      updates.adminNotes = String(req.body.adminNotes || "").slice(0, 5000);
    }

    await a.update(updates);
    res.json({ success: true, data: { followUpStatus: a.followUpStatus, adminNotes: a.adminNotes } });
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(500).json({ success: false, message: "Could not update the assessment" });
  }
};

// POST /api/assessments/:id/regenerate
exports.regenerate = async (req, res) => {
  try {
    const a = await Assessment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: "Not found" });
    if (inFlight.has(a.id)) {
      return res.json({ success: true, message: "Already generating" });
    }
    await a.update({ status: "pending", errorMessage: null });
    queueGeneration(a.id);
    res.json({ success: true, message: "Generating a new report" });
  } catch (error) {
    console.error("Error regenerating assessment:", error);
    res.status(500).json({ success: false, message: "Could not start generation" });
  }
};

// DELETE /api/assessments/:id
exports.deleteAssessment = async (req, res) => {
  try {
    const a = await Assessment.findByPk(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: "Not found" });
    await a.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ success: false, message: "Could not delete the assessment" });
  }
};
