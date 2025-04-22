const categoryValidator = require("../Validators/category.validators.js")
const BaseError = require("../Utils/Base.error.js")

const validateCategory = (req, res, next) => {
  const { error } = categoryValidator(req.body)
  if (error) {
    return next(BaseError.BadRequest(error))
  }
  next()
}

  

module.exports = validateCategory
