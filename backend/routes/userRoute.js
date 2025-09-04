import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { loginUser, registerUser, adminLogin, facebooklogin, googleCallback, facebookcallback, googleLogin } from '../controllers/userController.js';
import axios from 'axios';
import userModel from '../models/userModel.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/auth/facebook',facebooklogin)
userRouter.get('/auth/facebook/callback',facebookcallback);
userRouter.get('/auth/google', googleLogin)
userRouter.get('/auth/google/callback', googleCallback);

export default userRouter;