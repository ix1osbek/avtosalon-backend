const Joi = require("joi")

const userValidate = (data) => {
    try {
        const UserSchemaValidate = Joi.object({
            username: Joi.string()
                .min(3).max(30)
                .required()
                .messages({
                    'any.required': 'Foydalanuvchi ismi talab qilinadi',
                    'string.base': 'Foydalanuvchi ismi string bo‘lishi kerak',
                    'string.empty': `Foydalanuvchi ismi qismi bo'sh bo'lmasligi kerak!`,
                    'string.min': 'Foydalanuvchi ismi kamida 3 belgidan iborat bo‘lishi kerak',
                    'string.max': 'Foydalanuvchi ismi 30 belgidan oshmasligi kerak'
                }),

            email: Joi.string()
                .email({ tlds: { allow: ['com', 'net', 'org'] } })
                .required()
                .messages({
                    'any.required': 'Foydalanuvchi gmaili talab qilinadi!',
                    'string.base': 'Gmail string bo‘lishi kerak!',
                    'string.empty': ` Gmail qismini to'ldiring!`,
                    'string.email': 'Noto‘g‘ri email format kiritdingiz!'
                }),

            password: Joi.string()
                .required()
                .messages({
                    'any.required': 'Parol kiritish talab qilinadi!',
                    'string.base': 'Parol string bo‘lishi kerak',
                    'string.empty': 'Parol talab qilinadi'
                }),

            role: Joi.string()
                .valid('user', 'admin', 'superadmin')
                .default('user'),

            refreshToken: Joi.string()
                .allow(null)
                .optional(),

            isVerified: Joi.boolean()
                .default(false),

            otp: Joi.string()
                .pattern(/^[0-9]{6}$/)
                .default("0")
                .messages({
                    'string.pattern.base': 'OTP 6 ta raqamdan iborat bo‘lishi kerak'
                }),

            otpExpires: Joi.date(),

            resetPasswordCode: Joi.string()
                .alphanum()
                .optional()
                .messages({
                    'string.alphanum': 'Reset parol kodi faqat alphanumeric bo‘lishi kerak'
                }),

            resetPasswordExpires: Joi.date()
                .optional()
        })

        const { error } = UserSchemaValidate.validate(data)
        if (error) {
            return {
                error: error.details[0].message
            }
        }
        return { value: data }
    } catch (error) {
        return { error: "Foydalanuvchi ma'lumotlarini tekshirishda xatolik" }
    }
}


module.exports = userValidate
