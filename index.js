require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const carRouter = require("./Routes/car.routes.js");
const errorMiddleware = require("./Middleware/errorMiddleware.js");
const categoryRouter = require("./Routes/category.routes.js");
const authRout = require("./Routes/auth.routes.js");
// const multer = require("multer");
// const path = require("path");


const app = express();
app.use(cors());
connectDB();
app.use(express.json());
app.use(authRout);
app.use(carRouter);
app.use(categoryRouter);
app.use('/uploads', express.static('uploads')); // Vaqtincha fayllar uchun

// // Multer sozlamalari
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// // const upload = multer({ storage });
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});