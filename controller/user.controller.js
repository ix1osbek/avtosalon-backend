const User = require("../schema/user.schema.js");

const assignAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        }

        user.role = "admin"; // Admin rolini berish
        await user.save();

        res.status(200).json({ message: "Admin tayinlandi", user });
    } catch (error) {
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
};



const demoteAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

        if (req.user.role !== "superadmin") {
            return res.status(403).json({ error: "Sizda adminni userga aylantirish huquqi yo'q" });
        }

        if (user.role !== "admin") {
            return res.status(400).json({ error: "Foydalanuvchi allaqachon admin emas" });
        }

        user.role = "user"; // Adminni userga aylantirish
        await user.save();

        res.status(200).json({ message: "Admin foydalanuvchi sifatida qayta tayinlandi", user });
    } catch (error) {
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
};


module.exports = { assignAdmin  , demoteAdmin };
