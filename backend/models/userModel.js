import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type:String, required: false, unique: true},
    password: {type:String, required: false},
    cartData: {type: Object, default: {}}
},{minimize: false})

const userModel = mongoose.models.user || mongoose.model('users', userSchema);

export default userModel
