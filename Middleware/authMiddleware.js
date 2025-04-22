const { verifyToken } = require("../Utils/token.js")
const BaseError = require("../Utils/Base.error")

const protect = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(BaseError.Unauthorized(401, "Token mavjud emas"))
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(BaseError.Unauthorized(401, "Access token muddati tugagan"))
    }
    return next(BaseError.Unauthorized(401, "Token noto'g'ri!"))
  }
}


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        BaseError.Forbidden(403, "Sizda bu amalni bajarishga ruxsat yo'q")
      )
    }
    next()
  }
}


module.exports = { protect, authorize }