const UserModel = require("../schema/user.schema.js")
const BaseError = require("../Utils/Base.error")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../Utils/token.js")

// REGISTER
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: "Foydalanuvchi ro‘yxatdan o‘tdi", user })
  } catch (error) {
    return next(BaseError.BadRequest("Ro‘yxatdan o‘tishda xato", error.message))
  }
}


// LOGIN
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Email va passwordni tekshirish
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(BaseError.Unauthorized("Email yoki parol noto'g'ri"));
    }

    // Access token yaratish
    const accessToken = generateAccessToken(user);
    // Refresh token yaratish
    const refreshToken = generateRefreshToken(user);

    // Refresh tokenni database’da saqlash
    user.refreshToken = refreshToken;
    await user.save();

    // Refresh tokenni cookie'da saqlash
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // XSS hujumlaridan saqlanish
      secure: process.env.NODE_ENV === "production", // Faqat HTTPS bo'lsa ishlaydi
      sameSite: "strict", // Cross-site so'rovlarda cookie'ni yuborishga ruxsat bermaydi
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie 7 kun davomida saqlanadi
    });

    // Access tokenni response'da yuborish
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
    });
  } catch (error) {
    console.error(error);
    return next(BaseError.Internal("Tizimga kirishda xatolik", [error.message]));
  }
};




// REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token mavjud emas" });
    }

    // Refresh tokenni verifikatsiya qilish
    let decoded;
    try {
      decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Token not valid or expired" });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Noto‘g‘ri refresh token" });
    }

    // Yangi access token yaratish
    const newAccessToken = generateAccessToken(user);
    res.status(200).json({
      message: "Yangi access token generatsiya qilindi",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return next(BaseError.BadRequest(400, "Refresh token’da xato", error));
  }
};

// LOGOUT
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken; // 🟢 cookie'dan tokenni olamiz

    if (!refreshToken) {
      return next(BaseError.BadRequest("Refresh token topilmadi"));
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return next(BaseError.Unauthorized("Foydalanuvchi topilmadi yoki refresh token noto‘g‘ri"));
    }

    user.refreshToken = null;
    await user.save();

    // Cookie'larni tozalaymiz
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Tizimdan chiqildi" });
  } catch (error) {
    console.error(error);
    return next(BaseError.Internal("Chiqishda xatolik", [error.message]));
  }
};



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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUsers,
  assignAdminRole,
}
