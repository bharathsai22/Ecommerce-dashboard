const Category = require('../models/Category');

const getAllCategories = (req, res) => {
  Category.getAll((err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching categories' });
    }
    res.status(200).json(categories);
  });
};

const getCategoryById = (req, res) => {
  Category.getById(req.params.id, (err, category) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching category' });
    }
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  });
};

const createCategory = (req, res) => {
  const { name, itemCount, imageUrl } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  Category.create(name, itemCount, imageUrl, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating category' });
    }
    res.status(201).json({ message: 'Category created successfully' });
  });
};

const updateCategory = (req, res) => {
  const { name, itemCount, imageUrl } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  Category.update(req.params.id, name, itemCount, imageUrl, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating category' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  });
};

const deleteCategory = (req, res) => {
  Category.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting category' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};