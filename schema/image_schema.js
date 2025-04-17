const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrls: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);