const {userValidate , loginValidator , verifyUserValidator} = require("../Validators/auth.validators.js")
const BaseError = require("../Utils/Base.error.js")


const userValidators = (req, res, next) => {
    const { error } = userValidate(req.body)
    if (error) {
        return next(BaseError.BadRequest(error)) 
    }
    next()
}

const loginValidators = (req , res , next) => {
    const { error } = loginValidator(req.body)
    if (error) {
        return next(BaseError.BadRequest(error))
    }
    next()
}






module.exports= {
    userValidators,
    loginValidators
}