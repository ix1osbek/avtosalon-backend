const Mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await Mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully");

    } catch (error) {
        console.log("Database connection failed", error)


    }
}

module.exports = connectDB