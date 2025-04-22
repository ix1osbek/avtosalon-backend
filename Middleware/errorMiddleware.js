const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Serverda xatolik yuz berdi",
    error: process.env.NODE_ENV === "development" ? err.stack : err.name
  });
};

module.exports = errorHandler;
