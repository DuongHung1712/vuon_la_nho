import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true },
    description: {type:String, required:true },
    category: {type:String, required:true },
    difficulty:{type:String, required:true },
    light: {type:String, required:true },
    price: {type:Number, required:true },
    image: {type:Array, required:true },
    bestseller: {type:Boolean},
    date: {type: Number, required: true}
})

const productModel = mongoose.models.product ||  mongoose.model("products",productSchema);

export default productModel
