const User = require("../schema/user.schema.js")

const assignAdmin = async (req, res, next) => {
    try {
      const { userId } = req.params
      const user = await User.findById(userId)
  
      if (!user) {
        return next(BaseError.NotFound("Foydalanuvchi topilmadi"))
      }
  
      user.role = "admin"
      await user.save()
  
      res.status(200).json({
        message: "Admin tayinlandi",
        user,
      })
    } catch (error) {
      return next(BaseError.Internal("Xatolik yuz berdi", error.message))
    }
  }
  


  const demoteAdmin = async (req, res, next) => {
    try {
      const { userId } = req.params
      const user = await User.findById(userId)
  
      if (!user) {
        return next(BaseError.NotFound("Foydalanuvchi topilmadi"))
      }
  
      if (req.user.role !== "superadmin") {
        return next(BaseError.Forbidden("Sizda adminni userga aylantirish huquqi yo'q"))
      }
  
      if (user.role !== "admin") {
        return next(BaseError.BadRequest("Foydalanuvchi allaqachon admin emas"))
      }
  
      user.role = "user"
      await user.save()
  
      res.status(200).json({
        message: "Admin foydalanuvchi sifatida qayta tayinlandi",
        user,
      })
    } catch (error) {
      return next(BaseError.Internal("Xatolik yuz berdi", error.message))
    }
  }
  


module.exports = { assignAdmin  , demoteAdmin }
