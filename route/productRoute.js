import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct } from '../controller/productController.js'
import upload from '../middleWare/multer.js'
import adminAuth from '../middleWare/adminAuth.js'

const productRoute = express.Router()

productRoute.post('/add', upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 2 }
]),
      adminAuth,
      addProduct)
productRoute.post('/remove', removeProduct)
productRoute.get('/list', listProduct)
productRoute.get('/single', singleProduct)

export default productRoute