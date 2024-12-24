const BonCard = require("../models/BonCard");

// Create a new BonCard
exports.createBonCard = async (req, res) => {
  try {
    const { title, description, image, price, link, expiredDate } = req.body;
    const newBonCard = await BonCard.create({
      title,
      description,
      image,
      price,
      link,
      expiredDate,
    });
    res.status(201).send({
      success: true,
      message: "BonCard created successfully.",
      data: newBonCard,
    });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to create BonCard.",
        error: error.message,
      });
  }
};

// Get all BonCards
exports.getAllBonCards = async (req, res) => {
  try {
    const bonCards = await BonCard.findAll();
    res.status(200).send({ success: true, data: bonCards });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch BonCards.",
        error: error.message,
      });
  }
};

// Get a single BonCard by ID
exports.getBonCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const bonCard = await BonCard.findByPk(id);
    if (!bonCard)
      return res
        .status(404)
        .send({ success: false, message: "BonCard not found." });
    res.status(200).send({ success: true, data: bonCard });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch BonCard.",
        error: error.message,
      });
  }
};

// Update a BonCard
exports.updateBonCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, price, link, expiredDate } = req.body;
    const bonCard = await BonCard.findByPk(id);
    if (!bonCard)
      return res
        .status(404)
        .send({ success: false, message: "BonCard not found." });

    await bonCard.update({
      title,
      description,
      image,
      price,
      link,
      expiredDate,
    });
    res.status(200).send({
      success: true,
      message: "BonCard updated successfully.",
      data: bonCard,
    });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to update BonCard.",
        error: error.message,
      });
  }
};

// Delete a BonCard
exports.deleteBonCard = async (req, res) => {
  try {
    const { id } = req.params;
    const bonCard = await BonCard.findByPk(id);
    if (!bonCard)
      return res
        .status(404)
        .send({ success: false, message: "BonCard not found." });

    await bonCard.destroy();
    res
      .status(200)
      .send({ success: true, message: "BonCard deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to delete BonCard.",
        error: error.message,
      });
  }
};
