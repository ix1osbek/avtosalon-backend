const Joi = require("joi")
const currentYear = new Date().getFullYear()

const carsValidator = (data) => {
    try {
        const carsValidatorSchema = Joi.object({
            markasi: Joi.string().required().min(1).max(70).messages({
                "string.empty": "Moshina markasi stringda kiritilishi shart!",
                "string.min": "Moshina markasi 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Moshina markasi 70 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "Moshina markasi qismi to'ldirilishi shart!"
            }),
            model: Joi.string().required().min(1).max(150).messages({
                "string.empty": "Moshina modeli stringda kiritilishi shart!",
                "string.max": "Moshina modeli 150 ta belgidan ko'p bo'lmasligi kerak!",
                "string.min": "Moshina modeli 1 ta belgidan ko'p bo'lishi kerak!",
                "any.required": "Moshina modeli qismi to'ldirilishi shart!"
            }),
            motor: Joi.number().required().min(0).max(10).messages({
                "number.base": "Moshina motori raqamlarda kiritilishi shart!",
                "number.max": "Moshina motori 10 dan oshmasligi kerak!",
                "number.min": "Moshina motori 0 dan kam bo'lmasligi kerak!",
                "any.required": "Moshina motori qismi to'ldirilishi shart!"
            }),
            color: Joi.string().required().min(1).max(150).messages({
                "string.empty": "Moshina rangi stringda kiritilishi shart!",
                "string.max": "Moshina rangi 150 ta belgidan ko'p bo'lmasligi kerak!",
                "string.min": "Moshina rangi 1 ta belgidan ko'p bo'lishi kerak!",
                "any.required": "Moshina rangi qismi to'ldirilishi shart!"
            }),
            gearBook: Joi.string().required().min(1).max(150).messages({
                "string.empty": "Iltimos kiritilgan ma'lumot stringda kiritilishi shart!",
                "string.min": "Iltimos kiritilgan ma'lumot 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Iltimos kiritilgan ma'lumot 150 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "gearBook qismi to'ldirilishi shart!",
            }),
            deseriptions: Joi.string().required().min(1).max(2000).messages({
                "string.empty": "Moshina haqidagi ma'lumot stringda kiritilishi shart!",
                "string.max": "Moshina haqidagi ma'lumot 2000 ta belgidan ko'p bo'lmasligi kerak!",
                "string.min": "Moshina haqidagi ma'lumot 1 ta belgidan ko'p bo'lishi kerak!",
                "any.required": "deseriptions qismi to'ldirilishi shart!",
            }),
            tanirovkasi: Joi.string().valid("Bor", "Yo'q").required().messages({
                "any.only": "Iltimos tanlovlardan birini tanlang!",
            }),
            year: Joi.number().required().min(1950).max(currentYear).messages({
                "number.base": "Moshina yili raqamlarda kiritilishi shart!",
                "number.max": `Moshina yili ${currentYear} dan oshmasligi kerak!`,
                "number.min": "Moshina yili 1950 dan kam bo'lmasligi kerak!",
                "any.required": "Moshina yili qismi to'ldirilishi shart!"
            }),
            distance: Joi.number().required().min(0).max(10000000).messages({
                "number.base": "Moshina bosib o'tgan masofasi raqamlarda kiritilishi shart!",
                "number.max": "Moshina 10000000 km dan ko'p yurgan bo'lishi mumkin emas!",
                "any.required": "distance qismi to'ldirilishi shart!",
                "number.min": "Moshina  0 km dan kam yurgan bo'lishi mumkin emas!",
            }),
            narxi: Joi.number().required().min(0).messages({
                "number.base": "Iltimos narxni raqamlarda kiriting!",
                "number.min": "Iltimos narxni 0 dan kam bo'lmasligi kerak!",
                "any.required": "narxi qismi to'ldirilishi shart!",
            }),
            interiorImages: Joi.array().items(Joi.string()).messages({
                "array.base": "Iltimos rasm fayllarini yuklang!",
                "any.required": "interiorImages qismi to'ldirilishi shart!",
            }),
            exteriorImages: Joi.array().items(Joi.string()).messages({
                "array.base": "Iltimos rasm fayllarini yuklang!",
                "any.required": "exteriorImages qismi to'ldirilishi shart!",
            }),

        })

        const { error } = carsValidatorSchema.validate(data)
        if (error) {
            return {
                error: error.details[0].message
            }
        }
        return { value: data }
    } catch (error) {
        return { error: "Moshina ma'lumotlarini tekshirishda xatolik" }
    }
}



module.exports = carsValidator