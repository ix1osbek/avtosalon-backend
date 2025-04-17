const BaseError = require("../Utils/Base.error")
const CategoryModel = require("../schema/category.schema.js")

/// POST CATEGORY
const createCategory = async (req, res) => {
    try {
        const isUnique = await CategoryModel.findOne({ markasi: req.body.markasi })
        if (isUnique) {
            return res.status(400).json({
                message: "Bu moshina markasi bazada mavjud!",
            })
        }

        await CategoryModel.create(req.body)
        res.status(201).json({
            message: "Category added successfully",
        })
    } catch (error) {
        throw BaseError.BadRequest(400, "Error adding a category", error)
    }
}

// ///////// GET CATEGORIES
const getCategories = async (req, res) => {
    try {
        const foundCategories = await CategoryModel.find()
        if (foundCategories.length === 0) {
            return res.status(404).json({
                message: "Categories not found",
            })
        }
        res.status(200).json(foundCategories)
    } catch (error) {
        throw BaseError.BadRequest(400, "Error getting categories", error)
    }
}

// ///////// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const foundCategory = await CategoryModel.findById(id)
        if (!foundCategory) {
            return res.status(404).json({
                message: "Category not found",
            })
        }
        res.status(200).json(foundCategory)
    } catch (error) {
        throw BaseError.BadRequest(400, "Error getting a category", error)
    }
}

// ///////// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const foundCategory = await CategoryModel.findByIdAndDelete(id)

        if (!foundCategory) {
            return res.status(404).json({
                message: "Category not found",
            })
        }
        res.status(200).json({
            message: "Category deleted successfully",
        })
    } catch (error) {
        throw BaseError.BadRequest(400, "Error deleting a category", error)
    }
}

// ///////// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {

        const isUnique = await CategoryModel.findOne({ markasi: req.body.markasi })
        if (isUnique) {
            return res.status(400).json({
                message: "Bu moshina markasi bazada mavjud!",
            })
        }
        const { id } = req.params
        const foundCategories = await CategoryModel.findById(id)
        if (!foundCategories) {
            return res.status(404).json({
                message: "Category not found",
            })
        }
        await CategoryModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, upsert: true })
        res.status(200).json({
            message: `Category with id ${id} updated successfully`,
        })

    } catch (error) {
        throw BaseError.BadRequest(400, "Error updating a category", error)

    }
}


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    updateCategory
}