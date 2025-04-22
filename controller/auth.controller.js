const UserModel = require("../schema/user.schema.js")
const BaseError = require("../Utils/Base.error")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../Utils/token.js")

const sendEmail = require("../Utils/email.js")

// REGISTER
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {  
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan!" })
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 2 * 60 * 1000

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: verificationCode,
      otpExpires: new Date(expiresAt)
    })

    await sendEmail(email, verificationCode)

    res.status(201).json({ message: "Foydalanuvchi ro‘yxatdan o‘tdi", user })
  } catch (error) {
    return next(BaseError.BadRequest("Ro‘yxatdan o‘tishda xato", error.message))
  }
}



////////// verif

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body

    if (!email && !code) {
      return res.status(404).json({
        message: "Gmail va code kiritilishi zarur!"
      })
    }

    const foundetUser = await UserModel.findOne({ email })

    if (!foundetUser) {
      return res.status(404).json({
        message: "Gmail topilmadi!"
      })
    }


    if (+foundetUser.otp !== code || new Date() > foundetUser.otpExpires) {
      return res.status(400).json({
        message: "Parol noto'gri yoki eskirgan bo'lishi mumkun"
      })
    }
    foundetUser.isVarified = true
    foundetUser.otp = null
    await foundetUser.save()
    res.status(200).json({
      message: "Gmail muvofaqiyatli tasdiqlandi!"
    })

  } catch (error) {
    return next(BaseError.BadRequest("Gmail tasdiqlashda xatolik!", error.message))
  }
}


///////////// FORGOT PASSWORD

const forgotPassword = async (req, res) => {
  const { email } = req.body

  const user = await UserModel.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi" })
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
  const resetCodeExpires = Date.now() + 2 * 60 * 1000

  user.resetPasswordCode = resetCode
  user.resetPasswordExpires = new Date(resetCodeExpires)
  await user.save()

  await sendEmail(email, resetCode)

  return res.status(200).json({ message: "Parolni tiklash kodi emailga yuborildi" })
}


/////////// otp tekshirish va yangi parolni kiritish

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body

  const user = await UserModel.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi" })
  }

  if (
    user.resetPasswordCode !== code ||
    new Date() > user.resetPasswordExpires
  ) {
    return res.status(400).json({ message: "Kod noto‘g‘ri yoki eskirgan" })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  user.password = hashedPassword
  user.resetPasswordCode = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  return res.status(200).json({ message: "Parol muvaffaqiyatli tiklandi" })
}


// LOGIN
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(BaseError.Unauthorized("Email yoki parol noto'g'ri"))
    }


    const accessToken = generateAccessToken(user)

    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Tizimga kirdingiz",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error(error)
    return next(BaseError.Internal("Tizimga kirishda xatolik", [error.message]))
  }
}




// REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token mavjud emas" })
    }

    let decoded
    try {
      decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      return res.status(401).json({ message: "Token not valid or expired" })
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
    console.error(error)
    return next(BaseError.BadRequest(400, "Refresh token’da xato", error))
  }
}

// LOGOUT
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return next(BaseError.BadRequest("Refresh token topilmadi"))
    }

    const user = await UserModel.findOne({ refreshToken })

    if (!user) {
      return next(BaseError.Unauthorized("Foydalanuvchi topilmadi yoki refresh token noto‘g‘ri"))
    }

    user.refreshToken = null
    await user.save()

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })

    res.status(200).json({ message: "Tizimdan chiqildi" })
  } catch (error) {
    console.error(error)
    return next(BaseError.Internal("Chiqishda xatolik", [error.message]))
  }
}



// GET USERS
const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find()
    if (!users.length) return next(BaseError.NotFound("Foydalanuvchilar topilmadi"))
    res.status(200).json(users)
  } catch (error) {
    return next(BaseError.Internal("Foydalanuvchilarni olishda xato", error.message))
  }
}

// ASSIGN ADMIN
const assignAdminRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(BaseError.BadRequest("ID noto‘g‘ri"))
    }

    const user = await UserModel.findById(id)
    if (!user) return next(BaseError.NotFound("Foydalanuvchi topilmadi"))

    if (user.role !== "user") {
      return next(BaseError.BadRequest("Foydalanuvchi allaqachon admin yoki superadmin"))
    }

    user.role = "admin"
    await user.save()

    res.status(200).json({
      message: `${user.email} endi admin`,
      user,
    })
  } catch (error) {
    return next(BaseError.Internal("Admin tayinlashda xato", error.message))
  }
}

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await UserModel.findById(userId).select('-password  -refreshToken  -_id  -isVarified  -otp')

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" })
    }

    res.status(200).json({ profile: user })
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUsers,
  assignAdminRole,
  verifyUser,
  forgotPassword,
  resetPassword,
  getProfile
}
