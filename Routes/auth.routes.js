const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  assignAdminRole,
  getUsers,
  refreshToken,
  logoutUser,
} = require("../controller/auth.controller.js")
const { protect, authorize } = require("../Middleware/authMiddleware")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/assign-admin/:id", protect, authorize("superadmin"), assignAdminRole)
router.get("/users", protect, authorize("superadmin"), getUsers)
router.post("/refresh-token", refreshToken)
router.post("/logout", protect, logoutUser)

module.exports = router