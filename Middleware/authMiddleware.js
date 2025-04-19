const jwt = require("jsonwebtoken")

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    
    if (!token) return res.status(401).json({ error: "Token mavjud emas" })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token noto'g'ri" })

        req.user = decoded
        next()
    })
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Sizda bu amalni bajarishga ruxsat yo'q" })
        }
        next()
    }
}

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: "Faqat superadmin ruxsati bor" })
    }
    next()
}

const restrictToAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token topilmadi' })
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!['admin', 'superadmin'].includes(decoded.role)) {
            return res.status(403).json({ message: 'Faqat admin yoki superadmin rasm yuklay oladi' })
        }
        req.user = decoded // Foydalanuvchi ma'lumotlarini keyingi middleware'ga o'tkazish
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Yaroqsiz token' })
    }
}

module.exports = { protect, authorize, isSuperAdmin, restrictToAdmin } 