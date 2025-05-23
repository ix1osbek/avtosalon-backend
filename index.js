require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const carRouter = require("./Routes/car.routes.js");
const errorMiddleware = require("./Middleware/errorMiddleware.js");
const categoryRouter = require("./Routes/category.routes.js");
const authRout = require("./Routes/auth.routes.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({credentials:true}));
connectDB();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(authRout);
app.use(carRouter);
app.use(categoryRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})