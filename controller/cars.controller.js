const CarsModel = require("../schema/cars.schema");
const CategoryModel = require("../schema/category.schema.js");
const BaseError = require("../Utils/Base.error");
const fs = require("fs"); // To‘liq fs moduli
const fsPromises = require("fs").promises; // Promise-based metodlar uchun
const mongoose = require("mongoose");
const axios = require('axios'); // Axios import
const FormData = require('form-data'); // form-data kutubxonasi

////// POST CAR
const createcar = async (req, res, next) => {
    try {
        const category = await CategoryModel.findOne({ markasi: req.body.markasi });
        if (!category) {
            return res.status(404).json({
                message: "Moshina markasi topilmadi!"
            });
        }
        const carData = {
            markasi: category._id,
            motor: req.body.motor,
            color: req.body.color,
            gearBook: req.body.gearBook,
            deseriptions: req.body.deseriptions,
            tanirovkasi: req.body.tanirovkasi,
            year: req.body.year,
            distance: req.body.distance,
            narxi: req.body.narxi
        };
        await CarsModel.create(carData);
        res.status(201).json({
            message: "Car added successfully"
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error adding a car", error));
    }
};

////////// GET CARS
const getcar = async (req, res, next) => {
    try {
        const foundetCar = await CarsModel.find().populate("markasi");
        if (foundetCar.length === 0) {
            return res.status(404).json({
                message: "Car not found",
            });
        }
        res.status(200).json(foundetCar);
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting a car", error));
    }
};

/////////// GET CAR BY ID
const getcarbyid = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundetCar = await CarsModel.findById(id);
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            });
        }
        res.status(200).json(foundetCar);
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error getting a car", error));
    }
};

///////// DELETE CAR
const deleteCar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundetCar = await CarsModel.findByIdAndDelete(id);
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found"
            });
        }
        res.status(200).json({
            message: `Car with id ${id} deleted successfully`
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error deleting a car!", error));
    }
};

////////// UPDATE CAR
const updateCar = async (req, res, next) => {
    try {
        if (req.body.markasi && typeof req.body.markasi === 'string') {
            const category = await CategoryModel.findOne({ markasi: req.body.markasi });
            if (!category) {
                return res.status(400).json({ message: "Bunday marka topilmadi" });
            }
            req.body.markasi = category._id;
        }
        const { id } = req.params;
        const foundetCar = await CarsModel.findById(id);
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            });
        }
        await CarsModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, upsert: true });
        res.status(200).json({
            message: `Car with id ${id} updated successfully`,
        });
    } catch (error) {
        return next(BaseError.BadRequest(400, "Error updating a car!", error));
    }
};

////////// UPLOAD CAR IMAGE (ImgBB bilan yangilangan)
const uploadCarImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Rasm fayli yuklanmadi' });
        }

        const carId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({ message: 'Noto‘g‘ri avtomobil ID' });
        }

        // Faylni ImgBB’ga yuklash
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            params: {
                key: process.env.IMGBB_API_KEY,
                name: `car_images_${Date.now()}_${req.file.originalname}`
            },
            headers: {
                ...formData.getHeaders() // form-data kutubxonasi getHeaders ni qo‘llab-quvvatlaydi
            }
        });

        // ImgBB javobidan URL’ni olish
        const url = response.data.data.url;
        if (!url) {
            return res.status(500).json({ message: 'Rasm yuklashda xato: URL olinmadi' });
        }

        // Vaqtincha faylni o‘chirish
        await fsPromises.unlink(req.file.path);

        // Avtomobilni yangilash
        const car = await CarsModel.findByIdAndUpdate(
            carId,
            { imageUrl: url },
            { new: true }
        ).populate("markasi");
        if (!car) {
            return res.status(404).json({ message: 'Avtomobil topilmadi' });
        }
        return res.status(200).json({ message: 'Rasm yuklandi', car });
    } catch (error) {
        console.error('Rasm yuklash xatosi:', error);
        return next(BaseError.BadRequest(500, 'Server xatosi', error.message));
    }
};

module.exports = {
    createcar,
    getcar,
    getcarbyid,
    deleteCar,
    updateCar,
    uploadCarImage
};