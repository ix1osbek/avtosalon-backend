const CarsModel = require("../schema/cars.schema.js")
const CategoryModel = require("../schema/category.schema.js")
const BaseError = require("../Utils/Base.error")
const mongoose = require("mongoose")
const uploadToImgBB = require("../Utils/uploadToImgBB")

////////////////////////// POST CAR
const createCar = async (req, res, next) => {
    try {
      const category = await CategoryModel.findOne({ markasi: req.body.markasi })
      if (!category) return next(BaseError.NotFound("Moshina markasi topilmadi"))
  
      const carData = {
        markasi: category._id,
        model: req.body.model,
        motor: req.body.motor,
        color: req.body.color,
        gearBook: req.body.gearBook,
        deseriptions: req.body.deseriptions,
        tanirovkasi: req.body.tanirovkasi,
        year: req.body.year,
        distance: req.body.distance,
        narxi: req.body.narxi,
        interiorImages: [],
        exteriorImages: []
      }
  
      const car = await CarsModel.create(carData)
      res.status(201).json({ message: "Yangi avtomabil qo'shildi!", car })
    } catch (error) {
      next(BaseError.BadRequest("Avtomabil qo'shishda xatolik!", error.message))
    }
  }
  

////////////////////// POST INTERIOR IMAGES
const addInteriorImages = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) return next(BaseError.BadRequest("Avtomobil ID noto'g'ri!"))
  
      const car = await CarsModel.findById(id)
      if (!car) return next(BaseError.NotFound("Avtomobil topilmadi!"))
  
      if (!req.files?.length) return next(BaseError.BadRequest("Ichki rasm fayllari yuklanmadi!"))
  
      const imageUrls = await uploadToImgBB(req.files)
      car.interiorImages.push(...imageUrls)
      await car.save()
  
      res.status(200).json({ message: "Ichki rasmlar yuklandi", car })
    } catch (error) {
      next(BaseError.Internal("Ichki rasmlarni yuklashda xatolik", error.message))
    }
  }
  
/////////////////// POST EXTERIOR IMAGES
const addExteriorImages = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) return next(BaseError.BadRequest("Avtomobil ID noto'g'ri!"))
  
      const car = await CarsModel.findById(id)
      if (!car) return next(BaseError.NotFound("Avtomobil topilmadi!"))
  
      if (!req.files?.length) return next(BaseError.BadRequest("Tashqi rasm fayllari yuklanmadi!"))
  
      const imageUrls = await uploadToImgBB(req.files)
      car.exteriorImages.push(...imageUrls)
      await car.save()
  
      res.status(200).json({ message: "Tashqi rasmlar yuklandi!", car })
    } catch (error) {
      next(BaseError.Internal("Tashqi rasmlarni yuklashda xatolik", error.message))
    }
  }
  

///////////////////////////GET CARS
const getcar = async (req, res, next) => {
    try {
      const cars = await CarsModel.find().populate("markasi")
      if (!cars.length) return next(BaseError.NotFound("Mashinalar topilmadi"))
      res.status(200).json(cars)
    } catch (error) {
      next(BaseError.Internal("Mashinalarni olishda xato", error.message))
    }
  }
  
/////////// GET CAR BY ID
const getcarbyid = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) return next(BaseError.BadRequest("Avtomobil ID noto'g'ri"))
  
      const car = await CarsModel.findById(id).populate("markasi")
      if (!car) return next(BaseError.NotFound("Avtomobil topilmadi"))
  
      res.status(200).json(car)
    } catch (error) {
      next(BaseError.Internal("Mashina ma'lumotini olishda xatolik", error.message))
    }
  }
  

///////// DELETE CAR
const deleteCar = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) return next(BaseError.BadRequest("Avtomobil ID noto‘g‘ri"))
  
      const car = await CarsModel.findByIdAndDelete(id)
      if (!car) return next(BaseError.NotFound("Mashina topilmadi"))
  
      res.status(200).json({ message: `Mashina (${id}) o‘chirildi` })
    } catch (error) {
      next(BaseError.Internal("Mashina o‘chirishda xato", error.message))
    }
  }
  

////////// UPDATE CAR
const updateCar = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) return next(BaseError.BadRequest("Avtomobil ID noto‘g‘ri"))
  
      if (req.body.markasi && typeof req.body.markasi === 'string') {
        const category = await CategoryModel.findOne({ markasi: req.body.markasi })
        if (!category) return next(BaseError.BadRequest("Bunday marka topilmadi"))
        req.body.markasi = category._id
      }
  
      const foundCar = await CarsModel.findById(id)
      if (!foundCar) return next(BaseError.NotFound("Mashina topilmadi"))
  
      let interiorImages = foundCar.interiorImages
      let exteriorImages = foundCar.exteriorImages
  
      if (req.files?.interior?.length) {
        const newInteriorUrls = await uploadToImgBB(req.files.interior)
        interiorImages.push(...newInteriorUrls)
      }
  
      if (req.files?.exterior?.length) {
        const newExteriorUrls = await uploadToImgBB(req.files.exterior)
        exteriorImages.push(...newExteriorUrls)
      }
  
      const updateData = {
        ...req.body,
        interiorImages,
        exteriorImages
      }
  
      const updatedCar = await CarsModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      }).populate("markasi")
  
      res.status(200).json({
        message: `Mashina (${id}) yangilandi`,
        car: updatedCar
      })
    } catch (error) {
      next(BaseError.Internal("Mashina yangilashda xato", error.message))
    }
  }
  

module.exports = {
    createCar,
    addInteriorImages,
    addExteriorImages,
    getcar,
    getcarbyid,
    deleteCar,
    updateCar
}