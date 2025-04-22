
const validateCars = require("../Validators/cars.validators.js")
const BaseError = require("../Utils/Base.error.js")

const carsValidator = async (req, res, next) => {
    try {
      const { error } = await validateCars(req.body)
      if (error) {
        return next(BaseError.BadRequest(400, error.details[0].message))
      }
      next();
    } catch (error) {
      return next(BaseError.BadRequest(400, "Error validating car data", error))
    }
  }
  

module.exports = carsValidator
