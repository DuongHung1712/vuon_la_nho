import express from 'express';
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';
import passport from "passport"
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/auth/facebook',
    passport.authorize('facebook'));

userRouter.get('/auth/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/login' }) ,
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

export default userRouter;