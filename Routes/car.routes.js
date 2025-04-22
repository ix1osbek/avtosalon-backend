const express = require('express')
const router = express.Router()
const { createCar, addInteriorImages, addExteriorImages, getcar, getcarbyid, deleteCar, updateCar } = require('../controller/cars.controller')
const upload = require('../Utils/multer.config')
const { protect, authorize } = require('../Middleware/authMiddleware')
const carsValidator = require('../Middleware/carsMiddleware')

router.post('/add_car', protect, authorize('admin', 'superadmin'), carsValidator, createCar)
router.post('/:id/interior-images', protect, authorize('admin', 'superadmin'), upload.array('images', 5), addInteriorImages)
router.post('/:id/exterior-images', protect, authorize('admin', 'superadmin'), upload.array('images', 5), addExteriorImages)
router.get('/get_cars', protect, getcar)
router.get('/get_car/:id', protect, getcarbyid)
router.delete('/delete_car/:id', protect, authorize('admin', 'superadmin'), deleteCar)
router.put('/update_car/:id', protect, authorize('admin', 'superadmin'), carsValidator, upload.fields([
    { name: 'interior', maxCount: 5 },
    { name: 'exterior', maxCount: 5 }
]), updateCar)

module.exports = router