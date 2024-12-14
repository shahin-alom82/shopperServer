
import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
      name: { type: String, require: true },
      image: { type: Array, require: true },
      price: { type: Number, require: true },
      description: { type: String, require: true },
      discountPercentage: { type: Number },
      category: { type: String, require: true }
})

const productModel = mongoose.model.product || mongoose.model('product', productSchema);
export default productModel;