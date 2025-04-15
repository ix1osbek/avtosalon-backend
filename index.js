require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db.js")
const carRouter = require("./Routes/car.routes.js")
const errorMiddleware = require("./Middleware/errorMiddleware.js")


const app = express()
app.use(cors())
connectDB()
app.use(express.json())
app.use(carRouter)


app.use(errorMiddleware)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);

})
