const bucket = require("../config/firebase.js");
const Image = require("../schema/image_schema.js");
const { unlink } = require("fs").promises;

// Bitta rasm yuklash
const uploadSingleImage = async (req, res) => {
    try {
        const userId = req.body.userId;
        const file = req.file;

        // Validatsiya
        if (!file) {
            return res.status(400).json({ error: "Rasm yuklanmadi" });
        }

        if (!userId) {
            return res.status(400).json({ error: "Foydalanuvchi ID’si majburiy" });
        }

        // Fayl nomini yaratish
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(`images/${fileName}`);

        // Faylni Firebase Storage’ga yuklash
        await fileUpload.upload(file.path, {
            destination: `images/${fileName}`,
            metadata: { contentType: file.mimetype },
        });

        // URL’ni olish
        const [url] = await fileUpload.getSignedUrl({
            action: "read",
            expires: "03-01-2500",
        });

        // MongoDB’ga saqlash
        const image = new Image({
            userId,
            imageUrls: [url],
        });
        await image.save();

        // Vaqtincha faylni o‘chirish
        await unlink(file.path);

        res.status(200).json({ message: "Rasm yuklandi", imageUrl: url });
    } catch (error) {
        console.error("Rasm yuklashda xatolik:", error);
        res.status(500).json({ error: "Server xatosi: Rasm yuklanmadi" });
    }
};

// Bir nechta rasm yuklash
const uploadMultipleImages = async (req, res) => {
    try {
        const userId = req.body.userId;
        const files = req.files;

        // Validatsiya
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Kamida bitta rasm yuklanishi kerak" });
        }

        if (!userId) {
            return res.status(400).json({ error: "Foydalanuvchi ID’si majburiy" });
        }

        const imageUrls = [];

        // Har bir faylni Firebase Storage’ga yuklash
        for (const file of files) {
            const fileName = `${Date.now()}_${file.originalname}`;
            const fileUpload = bucket.file(`images/${fileName}`);

            // Faylni Firebase Storage’ga yuklash
            await fileUpload.upload(file.path, {
                destination: `images/${fileName}`,
                metadata: { contentType: file.mimetype },
            });

            // URL’ni olish
            const [url] = await fileUpload.getSignedUrl({
                action: "read",
                expires: "03-01-2500",
            });

            imageUrls.push(url);

            // Vaqtincha faylni o‘chirish
            await unlink(file.path);
        }

        // MongoDB’ga saqlash
        const image = new Image({
            userId,
            imageUrls,
        });
        await image.save();

        res.status(200).json({ message: "Rasmlar yuklandi", imageUrls });
    } catch (error) {
        console.error("Rasmlar yuklashda xatolik:", error);
        res.status(500).json({ error: "Server xatosi: Rasmlar yuklanmadi" });
    }
};

module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
};