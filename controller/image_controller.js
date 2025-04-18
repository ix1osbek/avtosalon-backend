const bucket = require("../config/firebase.js")
const { unlink } = require("fs").promises

const uploadSingleImage = async (req, res) => {
    try {
        const userId = req.body.userId
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: "Rasm yuklanmadi" })
        }

        if (!userId) {
            return res.status(400).json({ error: "Foydalanuvchi ID’si majburiy" })
        }

        const fileName = `${Date.now()}_${file.originalname}`
        const fileUpload = bucket.file(`images/${fileName}`)

        await fileUpload.upload(file.path, {
            destination: `images/${fileName}`,
            metadata: { contentType: file.mimetype }
        })

        const [url] = await fileUpload.getSignedUrl({
            action: "read",
            expires: "03-01-2500"
        })

        res.status(200).json({ message: "Rasm yuklandi", imageUrl: url })

        await unlink(file.path)

    } catch (error) {
        console.error("Rasm yuklashda xatolik:", error)
        res.status(500).json({ error: "Server xatosi: Rasm yuklanmadi" })
    }
};


const uploadMultipleImages = async (req, res) => {
    try {
        const userId = req.body.userId
        const files = req.files

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Kamida bitta rasm yuklanishi kerak" })
        }

        const imageUrls = []

        for (const file of files) {
            const fileName = `${Date.now()}_${file.originalname}`
            const fileUpload = bucket.file(`images/${fileName}`)

            await fileUpload.upload(file.path, {
                destination: `images/${fileName}`,
                metadata: { contentType: file.mimetype }
            })

        
            const [url] = await fileUpload.getSignedUrl({
                action: "read",
                expires: "03-01-2500"
            })

            imageUrls.push(url)
            await unlink(file.path)
        }

        res.status(200).json({ message: "Rasmlar yuklandi", imageUrls })
    } catch (error) {
        console.error("Rasmlar yuklashda xatolik:", error)
        res.status(500).json({ error: "Server xatosi: Rasmlar yuklanmadi" })
    }
}


module.exports = {
    uploadSingleImage,
    uploadMultipleImages
}