const BonCard = require("../models/BonCard");
const { uploadImage } = require("../utils/azureStorage");
const upload = require("../middleware/uploadMiddleware");

exports.uploadFields = upload.fields([{ name: "image", maxCount: 1 }]);

// Create a new BonCard
exports.createBonCard = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.files && req.files.image) {
      imageUrl = await uploadImage(req.files.image[0]);
    }

    const newBonCard = await BonCard.create({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl || req.body.image,
      price: req.body.price,
      link: req.body.link,
      expiredDate: req.body.expiredDate,
    });

    res.status(201).send({
      success: true,
      message: "BonCard created successfully.",
      data: newBonCard,
    });
  } catch (error) {
    res.status(500).send({
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
    res.status(500).send({
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
    res.status(500).send({
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
    const bonCard = await BonCard.findByPk(id);
    if (!bonCard) {
      return res.status(404).send({
        success: false,
        message: "BonCard not found.",
      });
    }

    let imageUrl = bonCard.image;
    if (req.files && req.files.image) {
      imageUrl = await uploadImage(req.files.image[0]);
    }

    await bonCard.update({
      title: req.body.title,
      description: req.body.description,
      image: imageUrl || req.body.image,
      price: req.body.price,
      link: req.body.link,
      expiredDate: req.body.expiredDate,
    });

    res.status(200).send({
      success: true,
      message: "BonCard updated successfully.",
      data: bonCard,
    });
  } catch (error) {
    res.status(500).send({
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
    res.status(500).send({
      success: false,
      message: "Failed to delete BonCard.",
      error: error.message,
    });
  }
};
