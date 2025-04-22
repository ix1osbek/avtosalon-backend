const categoryValidator = require("../Validators/category.validators.js")
const BaseError = require("../Utils/Base.error.js")

const validateCategory = async (req, res, next) => {
    try {
      const { error } = await categoryValidator(req.body)
      if (error) {
        return next(BaseError.BadRequest(400, error.details[0].message))
      }
      next()
    } catch (error) {
      return next(BaseError.BadRequest(400, "Error validating category data", error))
    }
  }
  

module.exports = validateCategory
