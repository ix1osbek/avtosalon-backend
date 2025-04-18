const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    
    if (!token) return res.status(401).json({ error: "Token mavjud emas" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token noto'g'ri" });

        req.user = decoded;
        next();
    });
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Sizda bu amalni bajarishga ruxsat yo'q" });
        }
        next();
    };
};


const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ error: "Faqat superadmin ruxsati bor" });
    }
    next();
};



module.exports = { protect, authorize, isSuperAdmin };
