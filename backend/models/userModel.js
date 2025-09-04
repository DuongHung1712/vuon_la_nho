import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: false},
    email: {type:String, required: true, unique: true, sparse: true},
    password: {type:String, required: false},
    cartData: {type: Object, default: {}}
},{minimize: false})

const userModel = mongoose.models.user || mongoose.model('users', userSchema);

export default userModel
