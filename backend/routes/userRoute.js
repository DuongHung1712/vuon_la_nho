import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';
import passport from "passport"
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] , session: false })
);

userRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

export default userRouter;