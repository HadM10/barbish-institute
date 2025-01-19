const express = require("express");
const bonCardController = require("../controllers/bonCardController");

const router = express.Router();

// GET /api/boncards - Get all BonCards
router.get("/", bonCardController.getAllBonCards);

// POST /api/boncards - Create a new BonCard
router.post(
  "/",
  bonCardController.uploadFields,
  bonCardController.createBonCard
);

// PUT /api/boncards/:id - Update a BonCard
router.put(
  "/:id",
  bonCardController.uploadFields,
  bonCardController.updateBonCard
);

// DELETE /api/boncards/:id - Delete a BonCard
router.delete("/:id", bonCardController.deleteBonCard);

module.exports = router;
