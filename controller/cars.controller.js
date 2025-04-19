const CarsModel = require("../schema/cars.schema.js")
const CategoryModel = require("../schema/category.schema.js")
const BaseError = require("../Utils/Base.error")
const mongoose = require("mongoose")
const uploadToImgBB = require("../Utils/uploadToImgBB")

////////////////////////// POST CAR
const createcar = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ markasi: req.body.markasi })
        if (!category) {
            return res.status(404).json({
                message: "Moshina markasi topilmadi!"
            })
        }

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
        res.status(201).json({
            message: "Car added successfully",
            car
        })
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error adding a car", error))
    }
};

////////////////////// POST INTERIOR IMAGES
const addInteriorImages = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto‘g‘ri avtomobil ID" })
        }

        const car = await CarsModel.findById(id)
        if (!car) {
            return res.status(404).json({ message: "Avtomobil topilmadi" })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Rasm fayllari yuklanmadi" })
        }

        const imageUrls = await uploadToImgBB(req.files)
        car.interiorImages = [...car.interiorImages, ...imageUrls]
        await car.save()

        res.status(200).json({
            message: "Ichki rasmlar yuklandi",
            car
        })
    } catch (error) {
        return next(BaseError.BadRequest(500, "Ichki rasmlarni yuklashda xato", error))
    }
}

/////////////////// POST EXTERIOR IMAGES
const addExteriorImages = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto‘g‘ri avtomobil ID" })
        }

        const car = await CarsModel.findById(id)
        if (!car) {
            return res.status(404).json({ message: "Avtomobil topilmadi" })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Rasm fayllari yuklanmadi" })
        }

        const imageUrls = await uploadToImgBB(req.files)
        car.exteriorImages = [...car.exteriorImages, ...imageUrls]
        await car.save()

        res.status(200).json({
            message: "Tashqi rasmlar yuklandi",
            car
        })
    } catch (error) {
        return next(BaseError.BadRequest(500, "Tashqi rasmlarni yuklashda xato", error))
    }
};

///////////////////////////GET CARS
const getcar = async (req, res, next) => {
    try {
        const foundetCar = await CarsModel.find().populate("markasi")
        if (foundetCar.length === 0) {
            return res.status(404).json({
                message: "Car not found",
            })
        }
        res.status(200).json(foundetCar)
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting a car", error))
    }
}

/////////// GET CAR BY ID
const getcarbyid = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundetCar = await CarsModel.findById(id).populate("markasi")
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            })
        }
        res.status(200).json(foundetCar)
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting a car", error))
    }
}

///////// DELETE CAR
const deleteCar = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundetCar = await CarsModel.findByIdAndDelete(id)
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found"
            });
        }
        res.status(200).json({
            message: `Car with id ${id} deleted successfully`
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error deleting a car!", error))
    }
}

////////// UPDATE CAR
const updateCar = async (req, res, next) => {
    try {
        if (req.body.markasi && typeof req.body.markasi === 'string') {
            const category = await CategoryModel.findOne({ markasi: req.body.markasi })
            if (!category) {
                return res.status(400).json({ message: "Bunday marka topilmadi" })
            }
            req.body.markasi = category._id
        }

        const { id } = req.params
        const foundetCar = await CarsModel.findById(id)
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            });
        }

        let interiorImages = foundetCar.interiorImages
        let exteriorImages = foundetCar.exteriorImages

        if (req.files && req.files.interior && req.files.interior.length > 0) {
            const newInteriorUrls = await uploadToImgBB(req.files.interior)
            interiorImages = [...interiorImages, ...newInteriorUrls]
        }

        if (req.files && req.files.exterior && req.files.exterior.length > 0) {
            const newExteriorUrls = await uploadToImgBB(req.files.exterior)
            exteriorImages = [...exteriorImages, ...newExteriorUrls]
        }

        const updateData = {
            ...req.body,
            interiorImages,
            exteriorImages
        };

        const updatedCar = await CarsModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("markasi")
        res.status(200).json({
            message: `Car with id ${id} updated successfully`,
            car: updatedCar
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error updating a car!", error))
    }
}

module.exports = {
    createcar,
    addInteriorImages,
    addExteriorImages,
    getcar,
    getcarbyid,
    deleteCar,
    updateCar
};