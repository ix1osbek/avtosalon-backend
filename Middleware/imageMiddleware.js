const multer = require("multer");
const path = require("path");

// Multer sozlamalari
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Faqat rasm fayllari yuklanishi mumkin"));
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cheklov
});

module.exports = {
    uploadSingle: upload.single("image"),
    uploadMultiple: upload.array("images", 10), // 10 ta rasm yuklash
};
