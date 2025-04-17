
const validateCars = require("../Validators/cars.validators.js")

const carsValidator = async (req, res, next) => {
    try {
        const { error } = await validateCars(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Error validating car data",
            error: error.message || error,
            status: 400
        });
    }
}

module.exports = carsValidator
