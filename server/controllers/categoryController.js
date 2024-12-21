const Category = require("../models/Category");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send({ success: true, data: categories });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching categories", details: error.message });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send({ success: false, message: "Category not found" });

    res.status(200).send({ success: true, data: category });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching category", details: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error creating category", details: error.message });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send({ success: false, message: "Category not found" });

    const updatedCategory = await category.update(req.body);
    res.status(200).send({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating category", details: error.message });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send({ success: false, message: "Category not found" });

    await category.destroy();
    res.status(200).send({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error deleting category", details: error.message });
  }
};
