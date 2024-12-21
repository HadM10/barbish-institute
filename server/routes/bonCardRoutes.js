const express = require("express");
const bonCardController = require("../controllers/bonCardController");

const router = express.Router();

// GET /api/boncards - Get all BonCards
router.get("/", bonCardController.getAllBonCards);

// GET /api/boncards/:id - Get a BonCard by ID
router.get("/:id", bonCardController.getBonCardById);

// POST /api/boncards - Create a new BonCard
router.post("/", bonCardController.createBonCard);

// PUT /api/boncards/:id - Update a BonCard
router.put("/:id", bonCardController.updateBonCard);

// DELETE /api/boncards/:id - Delete a BonCard
router.delete("/:id", bonCardController.deleteBonCard);

module.exports = router;