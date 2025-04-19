const axios = require('axios')
const FormData = require('form-data')

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
      throw new Error(`ImgBB’ga yuklashda xato: ${error.message}`)
    }
  }
  return imageUrls
}

module.exports = uploadToImgBB