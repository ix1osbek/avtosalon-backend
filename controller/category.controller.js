const BaseError = require("../Utils/Base.error")
const CategoryModel = require("../schema/category.schema.js")
const CarsModel = require("../schema/cars.schema.js")

/// POST CATEGORY
const createCategory = async (req, res, next) => {
    try {
        const existCategory = await CategoryModel.findOne({ markasi: req.body.markasi })
        if (existCategory) {
            return res.status(400).json({
                message: "Bu moshina markasi bazada mavjud!"
            })
        }
        await CategoryModel.create(req.body)
        res.status(201).json({
            message: "Category added successfully"
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error adding a category!", error))
    }
};

// ///////// GET CATEGORIES
const getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find()
        if (categories.length === 0) {
            return res.status(404).json({
                message: "Categories not found!"
            });
        }
        const formattedCategories = await Promise.all(
            categories.map(async (category) => {
                const cars = await CarsModel.find({ markasi: category._id }).select(
                    'model motor color narxi interiorImages exteriorImages'
                )
                return {
                    id: category._id.toString(),
                    markasi: category.markasi,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    cars: cars.map(car => ({
                        id: car._id.toString(),
                        model: car.model,
                        motor: car.motor,
                        color: car.color,
                        narxi: car.narxi,
                        interiorImages: car.interiorImages,
                        exteriorImages: car.exteriorImages
                    }))
                }
            })
        )
        res.status(200).json(formattedCategories)
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting categories!", error))
    }
}
// ///////// GET CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(404).json({
                message: "Category not found!"
            })
        }

        const cars = await CarsModel.find({ markasi: category._id }).select(
            'model motor color narxi interiorImages exteriorImages'
        );
        const formattedCategory = {
            id: category._id.toString(),
            markasi: category.markasi,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            cars: cars.map(car => ({
                id: car._id.toString(),
                model: car.model,
                motor: car.motor,
                color: car.color,
                narxi: car.narxi,
                interiorImages: car.interiorImages,
                exteriorImages: car.exteriorImages
            }))
        }
        res.status(200).json(formattedCategory)
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting a category!", error))
    }
};
////// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(404).json({
                message: "Category not found!"
            })
        }

        const cars = await CarsModel.find({ markasi: id });
        if (cars.length > 0) {
            return res.status(400).json({
                message: "Bu kategoriyaga bog‘liq mashinalar mavjud, avval ularni o‘chirish kerak!"
            });
        }
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).json({
            message: `Category with id ${id} deleted successfully`
        })
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error deleting a category!", error))
    }
};
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