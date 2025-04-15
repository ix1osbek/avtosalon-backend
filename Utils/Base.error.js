module.exports = class BaseError extends Error {
    status
    error
    constructor(status, message, errors) {
        super(message)
        this.status = status,
            this.errors = errors
    }
    static BadRequest(status, message, errors) {
        return new BaseError(status || 400, message, errors)
    }
}