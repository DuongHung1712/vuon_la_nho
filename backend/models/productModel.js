import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },

  sizes: { type: [sizeSchema], required: false },

  size: { type: Array, required: false },
  price: { type: Number, required: false },

  difficulty: { type: String, required: true },
  light: { type: String, required: true },
  rating: { type: Number, required: false, default: 0 },
  reviewCount: { type: Number, required: false, default: 0 },
  image: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("products", productSchema);

export default productModel;
