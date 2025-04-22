const express = require("express")
const userValidate = require("../Middleware/userMiddleware.js")
const router = express.Router()
const {
  registerUser,
  loginUser,
  assignAdminRole,
  getUsers,
  refreshToken,
  logoutUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getProfile
} = require("../controller/auth.controller.js")
const { protect, authorize } = require("../Middleware/authMiddleware")

router.post("/register",userValidate, registerUser)
router.post("/login", loginUser)
router.put("/assign-admin/:id", protect, authorize("superadmin"), assignAdminRole)
router.get("/users", protect, authorize("superadmin"), getUsers)
router.post("/refresh-token", refreshToken)
router.post("/logout", protect, logoutUser)
router.post("/verify" , verifyUser )
router.post("/forgot_password" ,  forgotPassword)
router.post("/reset_password" , resetPassword)
router.get("/profile" ,protect, getProfile)



module.exports = router