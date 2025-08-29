import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'  
import orderRouter from './routes/orderRoute.js'
import configLoginwithFacebook from './social/FacebookController.js'
import { config } from 'dotenv'
import passport from 'passport'
import LocalStratery from 'passport-local'
// APP Config
const app = express()   
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
// Middleware
app.use(express.json())
app.use(cors()) 



// API Endpoints
app.use('/api/user',userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.get('/', (req, res) => {
    res.send("API Working")
})
configLoginwithFacebook();
passport.use(new LocalStratery(function verify(username, password, cb) {
    console.log(username, password);
}));
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})