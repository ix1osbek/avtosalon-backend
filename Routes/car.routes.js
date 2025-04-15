const { Router } = require("express");
const { createcar, getcar, getcarbyid, deleteCar, updateCar } = require("../controller/cars.controller.js")
const carRouter = Router()

carRouter.post("/add_car", createcar)

carRouter.get("/cars", getcar)

carRouter.get("/one_car/:id", getcarbyid)

carRouter.delete("/delete_car/:id", deleteCar)

carRouter.put("/update_car/:id", updateCar)
module.exports = carRouter