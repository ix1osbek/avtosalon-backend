const joi = require("joi")

const categoryValidator = (data) => {
    try {

        const categoryValidatorSchema = joi.object({
            markasi: joi.string().required().min(1).max(70).messages({
                "string.base": "Marka nomi stringda kiritilishi shart!",
                "string.empty": "Marka nomi to'dirilishi shart!",
                "string.min": "Marka nomi 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Marka nomi 70 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "Marka nomini kiritish lozim!"
            })
        })
        return categoryValidatorSchema.validate(data)
    } catch (error) {
        throw new Error("Validator error")
    }
}

module.exports = categoryValidator