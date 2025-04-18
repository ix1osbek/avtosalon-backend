const { Router } = require("express");
const { createcar, getcar, getcarbyid, deleteCar, updateCar } = require("../controller/cars.controller.js")
const carsValidator = require("../Middleware/carsMiddleware.js")
const { protect, authorize } = require("../Middleware/authMiddleware.js")
const carRouter = Router()

carRouter.post("/add_car", protect, authorize("admin", "superadmin"),carsValidator, createcar)

carRouter.get("/cars", protect,getcar)

carRouter.get("/one_car/:id",protect, getcarbyid)

carRouter.delete("/delete_car/:id",protect, authorize("admin", "superadmin"), deleteCar)

carRouter.put("/update_car/:id",protect, authorize("admin", "superadmin"), carsValidator, updateCar)


module.exports = carRouter