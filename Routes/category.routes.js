const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, deleteCategory } = require('../controller/category.controller');
const { protect, authorize } = require('../Middleware/authMiddleware');
const categoryValidator = require('../Middleware/categoryMiddleware.js');

router.post('/add_category', protect, authorize('admin', 'superadmin'), categoryValidator, createCategory);
router.get('/categories', protect, getCategories);
router.get('/category/:id', protect, getCategoryById);
router.delete('/delete_category/:id', protect, authorize('admin', 'superadmin'), deleteCategory);

module.exports = router;