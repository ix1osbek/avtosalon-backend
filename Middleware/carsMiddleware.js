
const validateCars = require("../Validators/cars.validators.js")
const BaseError = require("../Utils/Base.error.js")



const carsValidator = (req, res, next) => {
  const { error } = validateCars(req.body)
  if (error) {
    return next(BaseError.BadRequest(error)) 
  }
  next()
}


module.exports = carsValidator
