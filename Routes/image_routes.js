const express = require("express");
const { uploadSingle, uploadMultiple } = require("../Middleware/imageMiddleware.js");
const { uploadSingleImage, uploadMultipleImages } = require("../controller/image_controller.js");

const imageRout = express.Router();

// Bitta rasm yuklash
imageRout.post("/upload-single", uploadSingle, uploadSingleImage);

// Bir nechta rasm yuklash
imageRout.post("/upload-multiple", uploadMultiple, uploadMultipleImages);

module.exports = imageRout;
