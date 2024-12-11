const express = require("express");
const router = express.Router();
const bonCardController = require("../controllers/bonCardController");

// Create a new BonCard
router.post("/boncards", bonCardController.createBonCard);

// Get all BonCards
router.get("/boncards", bonCardController.getAllBonCards);

// Get a single BonCard by ID
router.get("/boncards/:id", bonCardController.getBonCardById);

// Update a BonCard
router.put("/boncards/:id", bonCardController.updateBonCard);

// Delete a BonCard
router.delete("/boncards/:id", bonCardController.deleteBonCard);

module.exports = router;