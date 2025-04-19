const { Schema, default: mongoose } = require("mongoose")

const carsSchema = new Schema({
    markasi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    model: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 150
    },
    motor: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    color: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 150
    },
    gearBook: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 150
    },
    deseriptions: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    tanirovkasi: {
        type: String,
        required: true,
        enum: ["Bor", "Yo'q"]
    },
    year: {
        type: Number,
        required: true,
        min: 1950,
        max: 2025
    },
    distance: {
        type: Number,
        required: true,
        min: 0,
        max: 10000000
    },
    narxi: {
        type: Number,
        required: true,
        min: 0
    },
    interiorImages: [{
        type: String
    }],
    exteriorImages: [{
        type: String
    }]
}, { versionKey: false, timestamps: true })

carsSchema.set("toObject", { virtuals: true })
carsSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

module.exports = mongoose.model("cars", carsSchema)