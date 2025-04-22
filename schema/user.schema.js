const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: null,
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: 0
    },
    otpExpires: {
        type: Date,
        required: true
    },
    resetPasswordCode: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }

}, { timestamps: true, versionKey: false })

const UserModel = mongoose.model("user", UserSchema)

module.exports = UserModel
