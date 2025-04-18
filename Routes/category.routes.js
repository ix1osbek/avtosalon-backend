const {Router} = require("express")

const validateCategory = require("../Middleware/categoryMiddleware.js")
const { createCategory, getCategories, getCategoryById, deleteCategory , updateCategory} = require("../controller/category.controller.js")
const { protect, authorize } = require("../Middleware/authMiddleware.js")
const categoryRouter = Router()

categoryRouter.post("/add_category",protect, authorize("admin", "superadmin"), validateCategory, createCategory)
categoryRouter.get("/categories", protect, getCategories)
categoryRouter.get("/one_category/:id", protect, getCategoryById)
categoryRouter.delete("/delete_category/:id", protect, authorize("admin", "superadmin"),deleteCategory)
categoryRouter.put("/update_category/:id",protect, authorize("admin", "superadmin"), validateCategory, updateCategory)

module.exports = categoryRouter