const categoryValidator = require("../Validators/category.validators.js")

const validateCategory = async (req, res, next) => {
    try {

        const { error } = await categoryValidator(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message: "Error validating category data",
            error: error.message || error,
            status: 400
        })
    }
}

module.exports = validateCategory
