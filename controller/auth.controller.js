const UserModel = require("../schema/user.schema")
const BaseError = require("../Utils/Base.error")
const mongoose = require("mongoose")
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../Utils/token.js")

////// REGISTER USER
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan" })
    }

    const user = await UserModel.create({ name, email, password })
    res.status(201).json({ message: "Foydalanuvchi ro‘yxatdan o‘tdi", user })
  } catch (error) {
    return next(BaseError.BadRequest(400, "Ro‘yxatdan o‘tishda xato", error))
  }
}

////// LOGIN USER
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Parol noto‘g‘ri" })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    res.status(200).json({
      message: "Tizimga kirdingiz",
      accessToken,
      refreshToken,
      user,
    })
  } catch (error) {
    return next(BaseError.BadRequest(400, "Kirishda xato", error))
  }
}

////// REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token mavjud emas" })
    }

    let decoded
    try {
      decoded = verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      )
    } catch (error) {
      return res.status(401).json({ message: "Refresh token noto‘g‘ri yoki muddati tugagan" })
    }

    const user = await UserModel.findById(decoded.id)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Noto‘g‘ri refresh token" })
    }

    const newAccessToken = generateAccessToken(user)

    res.status(200).json({
      message: "Yangi access token generatsiya qilindi",
      accessToken: newAccessToken,
    })
  } catch (error) {
    return next(BaseError.BadRequest(400, "Refresh token’da xato", error))
  }
}

////// LOGOUT USER
const logoutUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" })
    }

    user.refreshToken = null
    await user.save()

    res.status(200).json({ message: "Tizimdan chiqildi" })
  } catch (error) {
    return next(BaseError.BadRequest(400, "Chiqishda xato", error))
  }
}

////// GET USERS 
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find()
    if (users.length === 0) {
      return res.status(404).json({ message: "Foydalanuvchilar topilmadi" })
    }
    res.status(200).json(users)
  } catch (error) {
    return next(BaseError.BadRequest(400, "Foydalanuvchilarni olishda xato", error))
  }
}

////// ASSIGN ADMIN ROLE 
const assignAdminRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri foydalanuvchi ID" })
    }

    const user = await UserModel.findById(id)
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" })
    }

    if (user.role === "admin" || user.role === "superadmin") {
      return res.status(400).json({
        message: `Foydalanuvchi allaqachon ${
          user.role === "admin" ? "admin" : "superadmin"
        }`,
      })
    }

    user.role = "admin"
    await user.save()

    res.status(200).json({
      message: `Foydalanuvchi ${user.email} admin sifatida tayinlandi`,
      user,
    })
  } catch (error) {
    return next(BaseError.BadRequest(400, "Admin tayinlashda xato", error))
  }
}

module.exports = {
  registerUser,
  loginUser,
  assignAdminRole,
  getUsers,
  refreshToken,
  logoutUser,
}