const {Router} = require("express")

const validateCategory = require("../Middleware/categoryMiddleware.js")
const { createCategory, getCategories, getCategoryById, deleteCategory , updateCategory} = require("../controller/category.controller.js")
const categoryRouter = Router()

categoryRouter.post("/add_category", validateCategory, createCategory)
categoryRouter.get("/categories", getCategories)
categoryRouter.get("/one_category/:id", getCategoryById)
categoryRouter.delete("/delete_category/:id", deleteCategory)
categoryRouter.put("/update_category/:id", validateCategory, updateCategory)

module.exports = categoryRouter