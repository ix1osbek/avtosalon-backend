const userValidate = require("../Validators/auth.validators.js")
const BaseError = require("../Utils/Base.error.js")


const userValidators = async (req, res, next) => {
    try {
        const { error } = await userValidate(req.body)
        if (error) {
            return next(BaseError.BadRequest(400, error.details[0].message))
        }
        next()
    } catch (error) {
        return next(BaseError.ServerError(500, "Foydalanuvchi ma'lumotlarini tekshirishda xato", error))
    }
}



module.exports= userValidators