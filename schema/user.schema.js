const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    }
}, { timestamps: true , versionKey: false })

module.exports = mongoose.model("User", UserSchema)
