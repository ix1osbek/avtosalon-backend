const Joi = require("joi")

const categoryValidator = (data) => {
    try {
        const categoryValidatorSchema = Joi.object({
            markasi: Joi.string().required().min(1).max(70).messages({
                "string.base": "Marka nomi stringda kiritilishi shart!",
                "string.empty": "Marka nomi to'ldirilishi shart!",
                "string.min": "Marka nomi 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Marka nomi 70 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "Marka nomini kiritish lozim!"
            })
        })

        const { error } = categoryValidatorSchema.validate(data)
        if (error) {
            return { error: error.details[0].message }
        }
        return { value: data }
    } catch (error) {
        return { error: "Kategoriya ma'lumotlarini tekshirishda xatolik" }
    }
}



module.exports = categoryValidator