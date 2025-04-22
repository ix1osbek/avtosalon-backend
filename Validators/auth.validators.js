const Joi = require("joi")

const userValidate = (data) => {
    try {
        const UserSchemaValidate = Joi.object({
            username: Joi.string()
                .min(3).max(30)
                .required()
                .messages({
                    'string.base': 'Foydalanuvchi ismi string bo‘lishi kerak',
                    'string.empty': 'Foydalanuvchi ismi talab qilinadi',
                    'string.min': 'Foydalanuvchi ismi kamida 3 belgidan iborat bo‘lishi kerak',
                    'string.max': 'Foydalanuvchi ismi 30 belgidan oshmasligi kerak'
                }),

            email: Joi.string()
                .email({ tlds: { allow: ['com', 'net', 'org'] } })
                .required()
                .messages({
                    'string.base': 'Email string bo‘lishi kerak',
                    'string.empty': 'Email talab qilinadi',
                    'string.email': 'Noto‘g‘ri email format'
                }),

            password: Joi.string()
                .required()
                .messages({
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
        return UserSchemaValidate.validate(data)
    } catch (error) {

    }

}
module.exports = userValidate
