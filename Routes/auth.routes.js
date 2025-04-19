const express = require("express")
const { register, login } = require("../controller/auth.controller.js")
const { assignAdmin, demoteAdmin } = require("../controller/user.controller.js")
const { protect, isSuperAdmin } = require("../Middleware/authMiddleware.js")

const authRout = express.Router()

authRout.post("/register", register)


authRout.post("/login", login)

authRout.put("/assign-admin/:userId", protect, isSuperAdmin, assignAdmin)


authRout.put("/demote-admin/:userId", protect, isSuperAdmin, demoteAdmin)

module.exports = authRout
