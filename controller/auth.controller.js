const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../schema/user.schema.js")

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save()

        res.status(201).json({ message: "Foydalanuvchi ro'yxatdan o'tdi", user: newUser })
    } catch (error) {
        res.status(500).json({ error: "Ro'yxatdan o'tishda xatolik" })
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "Foydalanuvchi topilmadi" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Parol noto‘g‘ri" })
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "Tizimga muvaffaqiyatli kirildi",
            token
        });
    } catch (error) {
        console.error("Login xatoligi:", error)
        res.status(500).json({ error: "Tizimga kirishda xatolik" })
    }
}


module.exports = { register, login }
