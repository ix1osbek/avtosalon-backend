class BaseError extends Error {
    constructor(name, statusCode, description, isOperational = true) {
      super(description)
      this.name = name
      this.statusCode = statusCode
      this.isOperational = isOperational
      Error.captureStackTrace(this, this.constructor)
    }
  
    static BadRequest(message, error = '') {
      return new BaseError("BadRequest", 400, message || `So'rov yaroqsiz!`, true)
    }
  
    static Unauthorized(message = "Ruxsat yo‘q") {
      return new BaseError("Unauthorized", 401, message, true)
    }
  
    static NotFound(message = "Topilmadi") {
      return new BaseError("NotFound", 404, message, true)
    }
  
    static InternalError(message = "Server xatosi") {
        return new BaseError("InternalError", 500, message, true)
      }
      

    static ServerError(message = "Serverda xatolik yuz berdi") {
        return new BaseError("ServerError", 500, message, true)
    }

    static Forbidden(message = "Sizda bu amal uchun ruxsat yo‘q") {
        const error = new BaseError(message, 403);
        error.name = "Forbidden";
        return error;
      }
    
  }
  
  module.exports = BaseError
  