const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;