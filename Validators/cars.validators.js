const joi = require("joi")
const BaseError = require("../Utils/Base.error")
const currentYear = new Date().getFullYear()

const carsValidator = (data) => {
    try {
        const carsValidatorSchema = joi.object({
            markasi: joi.string().required().min(1).max(70).messages({
                "string.empty": "Moshina markasi stringda kiritilishi shart!",
                "string.min": "Moshina markasi 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Moshina markasi 70 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "Moshina markasi qismi to'ldirilishi shart!"
            }),
            motor: joi.number().required().min(0).max(10).messages({
                "number.base": "Moshina motori raqamlarda kiritilishi shart!",
                "number.max": "Moshina motori 10 dan oshmasligi kerak!",
                "number.min": "Moshina motori 0 dan kam bo'lmasligi kerak!",
                "any.required": "Moshina motori qismi to'ldirilishi shart!"
            }),
            color: joi.string().required().min(1).max(150).messages({
                "string.empty": "Moshina rangi stringda kiritilishi shart!",
                "string.max": "Moshina rangi 150 ta belgidan ko'p bo'lmasligi kerak!",
                "string.min": "Moshina rangi 1 ta belgidan ko'p bo'lishi kerak!",
                "any.required": "Moshina rangi qismi to'ldirilishi shart!"
            }),
            gearBook: joi.string().required().min(1).max(150).messages({
                "string.empty": "Iltimos kiritilgan ma'mumot stringda kiritilishi shart!",
                "string.min": "Iltimos kiritilgan malumot 1 ta belgidan ko'p bo'lishi kerak!",
                "string.max": "Iltimos kiritilgan malumot 150 ta belgidan ko'p bo'lmasligi kerak!",
                "any.required": "gearBook qismi to'ldirilishi shart!",
            }),
            deseriptions: joi.string().required().min(1).max(2000).messages({
                "string.empty": "Moshina haqidagi ma'lumot stringda kiritilishi shart!",
                "string.max": "Moshina haqidagi ma'lumot 2000 ta belgidan ko'p bo'lmasligi kerak!",
                "string.min": "Moshina haqidida ma'lumot 1 ta belgidan ko'p bo'lishi kerak!",
                "any.required": "deseriptions qismi to'ldirilishi shart!",
            }),
            tanirovkasi: joi.string().valid("Bor", "Yo'q").required().messages({
                "any.only": "Iltimos tanlovlardan birini tanlang!",
            }),
            year: joi.number().required().min(1950).max(currentYear).messages({
                "number.base": "Moshina yili raqamlarda kiritilishi shart!",
                "number.max": `Moshina yili ${currentYear} dan oshmasligi kerak!`,
                "number.min": "Moshina yili 1950 dan kam bo'lmasligi kerak!",
                "any.required": "Moshina yili qismi to'ldirilishi shart!"
            }),
            distance: joi.number().required().min(0).max(10000000).messages({
                "number.base": "Moshina bosib o'tgan masofasi raqamlarda kiritilishi shart!",
                "number.max": "Moshina 10000000 km dan ko'p yurgan bo'lishi mumkun emas!",
                "any.required": "distance qismi to'ldirilishi shart!",
                "number.min": "Moshina  0 km dan kam yurgan bo'lishi mumkun emas!",
            }),
            narxi: joi.number().required().min(0).messages({
                "number.base": "Iltimos narxni raqamlarda kiriting!",
                "number.min": "Iltimos narxni 0 dan kam bo'lmasligi kerak!",
                "any.required": "narxi qismi to'ldirilishi shart!",
            })

        })
        return carsValidatorSchema.validate(data)
    } catch (error) {
        throw new Error("Validator error")
    }
}

module.exports = carsValidator