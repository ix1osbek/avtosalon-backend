const { Schema, default: mongoose } = require('mongoose')
const currentYear = new Date().getFullYear()

const carSchema = new Schema({
    markasi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    motor: {
        type: Number,
        required: true,
        min: [0, "Moshina motori 0 dan kam bo'lmasligi kerak!"],
        max: [10, "Moshina motori 10 dan oshmasligi kerak!"]
    },
    color: {
        type: String,
        required: true,
        minLength: [0, "Moshina rangi 1 ta belgidan ko'p bo'lishi kerak!"],
        maxLength: [150, "Moshina rangi 150 ta belgidan ko'p bo'lmasligi kerak!"]
    },
    gearBook: {
        type: String,
        required: true,
        minLength: [0, "Iltimos kiritilgan malumot 1 ta belgidan ko'p bolishi kerak!"],
        maxLength: [150, "Iltimos kiritilgan malumot 150 ta belgidan ko'p bo'lmasligi kerak!"],
    },
    deseriptions: {
        type: String,
        required: true,
        minLength: [0, "Moshina haqidida ma'lumot 1 ta belgidan ko'p bo'lishi kerak!"],
        maxLength: [2000, "Moshina haqidagi ma'lumot 2000 ta belgidan ko'p bo'lmasligi kerak!"]
    },
    tanirovkasi: {
        type: String,
        required: true,
        enum: ["Bor", "Yo'q"],
    },
    year: {
        type: Number,
        required: true,
        min: [1950, "Moshina yili 1950 dan kam bo'lmasligi kerak!"],
        max: [currentYear, `Moshina yili ${currentYear} dan oshmasligi kerak!`]
    },
    distance: {
        type: Number,
        required: true,
        min: [0, "Moshina  0 km dan kam yurgan bo'lishi mumkun emas!"],
        max: [10000000, "Moshina 10000000 km dan ko'p yurgan bo'lishi mumkun emas!"]
    },
    narxi: {
        type: Number,
        required: true,
        min: [0, "Iltimos narxni kiriting!"],
    },
    imageUrl: { type: String }
}, { versionKey: false, timestamps: true });

const CarsModel = mongoose.model("Cars", carSchema);

module.exports = CarsModel;
