const express = require("express");
const { uploadSingle, uploadMultiple } = require("../Middleware/imageMiddleware");
const { uploadSingleImage, uploadMultipleImages } = require("../controller/image_controller.js");

const router = express.Router();

// Bitta rasm yuklash
router.post("/upload-single", uploadSingle, uploadSingleImage);

// Bir nechta rasm yuklash
router.post("/upload-multiple", uploadMultiple, uploadMultipleImages);

module.exports = router