const {Schema , default: mongoose} = require("mongoose")

const categorySchema = new Schema({
    markasi: {
        type: String,
        required: true,
        unique: [true, "Bu moshina markasi bazada mavjud!"],
        minLength: [1, "Moshina markasi 1 ta belgidan ko'p bo'lishi kerak!"],
        maxLength: [70, "Moshina markasi 70 ta belgidan ko'p bo'lmasligi kerak!"]
    }
} , {versionKey: false, timestamps: true})
const CategoryModel = mongoose.model("category", categorySchema)
module.exports = CategoryModel