const userValidate = require("../Validators/auth.validators.js")


const userValidators =async(req , res , next)=>{
    try {
        const {error} = await userValidate(req.body)
        if(error){
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        next()
    } catch (error) {
        throw new Error("error")
    }
}

module.exports= userValidators