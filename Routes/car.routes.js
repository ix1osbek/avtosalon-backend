// const { Router } = require("express");
// const { createcar, getcar, getcarbyid, deleteCar, updateCar, uploadCarImage } = require("../controller/cars.controller.js");
// const carsValidator = require("../Middleware/carsMiddleware.js");
// const { protect, authorize, restrictToAdmin } = require("../Middleware/authMiddleware.js"); // restrictToAdmin qo'shildi
// const upload = require("../Utils/multerConfig.js");

// const carRouter = Router();

// carRouter.post("/add_car", protect, authorize("admin", "superadmin"), carsValidator, createcar);
// carRouter.get("/cars", protect, getcar);
// carRouter.get("/one_car/:id", protect, getcarbyid);
// carRouter.delete("/delete_car/:id", protect, authorize("admin", "superadmin"), deleteCar);
// carRouter.put("/update_car/:id", protect, authorize("admin", "superadmin"), carsValidator, updateCar);
// carRouter.put(
//     '/add_img/:id/image',
//     protect, // Autentifikatsiya
//     restrictToAdmin, // Faqat admin va superadmin
//     upload.single('image'), // Bitta rasm yuklash
//     uploadCarImage
// );

// module.exports = carRouter;

const express = require('express');
const router = express.Router();
const { createcar, getcar, getcarbyid, deleteCar, updateCar, uploadCarImage } = require('../controller/cars.controller');
const multer = require('multer');
const path = require('path'); // path modulini import qilish

// Multer sozlamalari
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routerlar
router.post('/add_car', createcar);
router.get('/get_cars', getcar);
router.get('/get_car/:id', getcarbyid);
router.delete('/delete_car/:id', deleteCar);
router.put('/update_car/:id', updateCar);
router.put('/add_img/:id/image', upload.single('image'), uploadCarImage);

module.exports = router;