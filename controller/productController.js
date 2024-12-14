import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js';



// ------------- Add Product -------------- \\
const addProduct = async (req, res) => {
      try {

            const {
                  name,
                  price,
                  description,
                  discountPercentage,
                  category,
            } = req.body;


            const image1 = req.files.image1 && req.files.image1[0]
            const image2 = req.files.image2 && req.files.image2[0]



            if (!name) {
                  return res.send({
                        success: false,
                        message: 'Product name is required!'
                  })
            }
            if (!price) {
                  return res.send({
                        success: false,
                        message: 'Product price is required!'
                  })
            }
            if (!category) {
                  return res.send({
                        success: false,
                        message: 'Product category is required!'
                  })
            }
            if (!description) {
                  return res.send({
                        success: false,
                        message: 'Product description is required!'
                  })
            }

            let image = [image1, image2].filter((item) => item !== undefined)


            let imageUrl = await Promise.all(
                  image.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, {
                              resource_type: 'image'
                        });
                        return result.secure_url;
                  })
            );

            const productData = {
                  name,
                  price: Number(price),
                  discountPercentage: Number(discountPercentage),
                  category,
                  description,
                  image: imageUrl
            }

            const product = new productModel(productData)
            product.save()

            res.send({
                  success: true,
                  message: `${name} added and saved to DB successfully!`
            })

      } catch (error) {
            console.log('Product added error!', error)
            return res.json({ success: false, message: error.message })
      }
};


//--------------- Remove Product ------------- \\
const removeProduct = async (req, res) => {
      try {
            await productModel.findByIdAndDelete(req.body._id)
            res.send({
                  success: true,
                  message: 'Product deleted successfully!'
            })
      } catch (error) {
            console.log('Product deleted error!', error)
            res.json({
                  success: false,
                  message: error.message
            })
      }
};


// --------------- List Product --------------- \\
const listProduct = async (req, res) => {
      try {
            const total = await productModel.countDocuments({});
            const products = await productModel.find({});

            if (products.length) {
                  return res.send({
                        success: true,
                        total,
                        products
                  });
            }

            res.send({
                  success: false,
                  message: "No products found!"
            });

      } catch (error) {
            console.log('Product list error!', error);
            res.status(500).json({
                  success: false,
                  message: error.message
            });
      }
};


// ---------------- Single Product --------------- \\
const singleProduct = async (req, res) => {
      try {
            const { _id } = req.query
            const product = await productModel.findById(_id)
            if (!product) {
                  return res.send({
                        success: false,
                        message: "No product matched with this id!"
                  })
            }
            return res.json({
                  success: true,
                  product
            })

      } catch (error) {
            console.log('Single product error!', error)
            return res.json({ success: false, message: error.message })
      }
};

export { addProduct, removeProduct, listProduct, singleProduct }


