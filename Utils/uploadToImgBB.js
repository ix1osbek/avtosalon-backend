const axios = require('axios')
const FormData = require('form-data')
const BaseError = require("../Utils/Base.error.js")

const uploadToImgBB = async (files) => {
  const imageUrls = []
  for (const file of files) {
    const formData = new FormData()
    formData.append('image', file.buffer.toString('base64'))

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData,
        { headers: formData.getHeaders() }
      )
      imageUrls.push(response.data.data.url)
    } catch (error) {
      return next(BaseError.ServerError(500, `ImgBB’ga yuklashda xato: ${error.message}`, error))
    }
  }
  return imageUrls
}


module.exports = uploadToImgBB