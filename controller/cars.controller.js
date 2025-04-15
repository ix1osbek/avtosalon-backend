const CarsModel = require("../schema/cars.schema")
const BaseError = require("../Utils/Base.error")

////// POST CAR

const createcar = async (req, res) => {
    try {
        await CarsModel.create(req.body)
        res.status(201).json({
            message: "Car added successfully",
        })
    } catch (error) {
        throw BaseError.BadRequest(400, "Error adding a car", error)
    }
}


////////// GET CARS
const getcar = async (req, res) => {
    try {
        const foundetCar = await CarsModel.find()
        if (foundetCar.length === 0) {
            return res.status(404).json({
                message: "Car not found",
            })
        }
        res.status(200).json(foundetCar)
    } catch (error) {
        throw BaseError.BadRequest(400, "Error getting a car", error)
    }
}


/////////// GET CAR BY ID

const getcarbyid = async (req, res) => {
    try {
        const { id } = req.params
        const foundetCar = await CarsModel.findById(id)
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            })
        }
        res.status(200).json(foundetCar)
    } catch (error) {
        throw BaseError.BadRequest(400, "Error getting a car", error)

    }
}


///////// delete car

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const foundetCar = await CarsModel.findByIdAndDelete(id)

        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            })
        }

        res.status(200).json({
            message: `Car with id ${id} deleted successfully`
        })
    } catch (error) {
        throw BaseError.BadRequest(400, "Error deleting a car!", error)
    }
}

////////// UPDATAE CAR


const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const foundetCar = await CarsModel.findById(id)
        if (!foundetCar) {
            return res.status(404).json({
                message: "Car not found",
            })
        }
        await CarsModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true  , upsert: true })
        res.status(200).json({
            message: `Car with id ${id} updated successfully`,
        })
    } catch (error) {
        throw BaseError.BadRequest(400, "Error updating a car!", error)
    }

}
module.exports = {
    createcar,
    getcar,
    getcarbyid,
    deleteCar,
    updateCar
}