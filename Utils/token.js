const jwt = require("jsonwebtoken")

// Access token generatsiya qilish
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
}

// Refresh token generatsiya qilish
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET ,
        { expiresIn: "7d" }
    )
}

// Tokenni tekshirish (middleware uchun)
const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
}