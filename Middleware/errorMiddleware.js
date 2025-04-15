const BaseError = require("../Utils/Base.error.js")

module.exports = (err, req, res, next) => {
    if (err instanceof BaseError) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        })
        return
    }


    if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map((error) => error.message)
        res.status(400).json({
            message: "Validation Error",
            errors: errorMessages,
        })
    }


    if (err.code === 11000) {
        const fields = Object.keys(err.keyValue).join(", ")
        res.status(400).json({
            message: `Dublicate value for fields: ${fields}`,
            errors: errorMessages
        })
    }

    if (err.name === "JsonWebTokenError") {
        res.status(401).json({
            message: `Invalid Token`
        })
        return
    }

    if (err.name === "TokenExpiredError") {
        res.status(401).json({
            message: "Token has expired"
        })
        return
    }

    res.status(500).json({
        message: "Server error",
        errors: [err.message || "Unexpected error occured"]
    })
}