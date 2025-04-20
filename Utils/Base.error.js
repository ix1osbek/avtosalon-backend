module.exports = class BaseError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message = "Bad Request", errors = []) {
        return new BaseError(400, message, errors);
    }

    static Unauthorized(message = "Unauthorized", errors = []) {
        return new BaseError(401, message, errors); // ✅ status kodi 401 deb ko‘rsatilishi kerak
    }
    

    static NotFound(message = "Not Found", errors = []) {
        return new BaseError(404, message, errors);
    }

    static Internal(message = "Internal Server Error", errors = []) {
        return new BaseError(500, message, errors);
    }
}
