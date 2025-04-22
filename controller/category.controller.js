const BaseError = require("../Utils/Base.error")
const CategoryModel = require("../schema/category.schema.js")
const CarsModel = require("../schema/cars.schema.js")

/// POST CATEGORY
const createCategory = async (req, res, next) => {
    try {
      const existCategory = await CategoryModel.findOne({ markasi: req.body.markasi })
      if (existCategory) {
        return next(BaseError.BadRequest("Bu moshina markasi bazada mavjud!"))
      }
  
      await CategoryModel.create(req.body)
      res.status(201).json({
        message: "Category qo'shildi!"
      })
    } catch (error) {
      return next(BaseError.BadRequest("Category qo'shishda xatolik!", error.message))
    }
  }
  

// ///////// GET CATEGORIES
const getCategories = async (req, res, next) => {
    try {
      const categories = await CategoryModel.find()
      if (categories.length === 0) {
        return next(BaseError.NotFound("Categories not found!"))
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
      return next(BaseError.Internal("Category olishda xatolik!", error.message))
    }
  }
  
// ///////// GET CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
    try {
      const { id } = req.params
      const category = await CategoryModel.findById(id)
      if (!category) {
        return next(BaseError.NotFound("Category topilmadi!"))
      }
  
      const cars = await CarsModel.find({ markasi: category._id }).select(
        'model motor color narxi interiorImages exteriorImages'
      )
  
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
      return next(BaseError.Internal("Category olishda xatolik!", error.message))
    }
  }
  
////// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params
      const category = await CategoryModel.findById(id)
      if (!category) {
        return next(BaseError.NotFound("Category not found!"))
      }
  
      const cars = await CarsModel.find({ markasi: id })
      if (cars.length > 0) {
        return next(BaseError.BadRequest("Bu kategoriyaga bog‘liq mashinalar mavjud, avval ularni o‘chirish kerak!"))
      }
  
      await CategoryModel.findByIdAndDelete(id)
      res.status(200).json({
        message: `${id} Category o'chirildi! `
      })
    } catch (error) {
      return next(BaseError.Internal("Categorylarni o'chirishda xatolik!", error.message))
    }
  }
  
// ///////// UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
    try {
      const isUnique = await CategoryModel.findOne({ markasi: req.body.markasi })
      if (isUnique) {
        return next(BaseError.BadRequest("Bu moshina markasi bazada mavjud!"))
      }
  
      const { id } = req.params
      const foundCategories = await CategoryModel.findById(id)
      if (!foundCategories) {
        return next(BaseError.NotFound("Category topilmadi!"))
      }
  
      await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
      })
  
      res.status(200).json({
        message: `Category ${id} yangilandi!`,
      })
    } catch (error) {
      return next(BaseError.BadRequest("Yangilanishdagi xatolik!", error.message))
    }
  }
  


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    updateCategory
}