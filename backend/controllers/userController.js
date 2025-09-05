import { response } from "express"
import userModel from "../models/userModel.js"
import validator from "validator"
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"
const qs = require('querystring');


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // Checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validating email format &  strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Hashing password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
const facebooklogin = async (req, res) => {
    const redirectUri = `https://vuonlanho.store/api/user/auth/facebook/callback`;
    const clientId = process.env.FACEBOOK_APP_ID;
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email`;
    res.redirect(url);
}

const facebookcallback = async (req, res) => {
    const code = req.query.code;
    const redirectUri = 'https://vuonlanho.store/api/user/auth/facebook/callback';
    try {
        const tokenRes = await axios.get(
            'https://graph.facebook.com/v10.0/oauth/access_token',
            {
                params: {
                    client_id: process.env.FB_CLIENT_ID,
                    client_secret: process.env.FB_CLIENT_SECRET,
                    redirect_uri: 'https://vuonlanho.store/api/user/auth/facebook/callback',
                    code: req.query.code,
                },
                timeout: 10000,
            }
        );
        const access_token = tokenRes.data.access_token;
        const profileRes = await axios.get(
            'https://graph.facebook.com/me',
            {
                params: { fields: 'id,name,email' },
                headers: { Authorization: `Bearer ${access_token}` }
            }
        );
        const { email, name } = profileRes.data;

        let user = await userModel.findOne({ email });
        if (!user) {
            // Nếu chưa có user thì tạo mới
            user = await userModel.create({
                email,
                name,
                password: null,
                authProvider: "facebook"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.redirect(`https://vuonlanho.store/success?token=${token}`);
    } catch (error) {
        console.error('Error fetching Facebook user info:', error);
    }
}
const googleLogin = (req, res) => {
    const redirectUri = `https://vuonlanho.store/api/user/auth/google/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email`;
    res.redirect(url);
}

const googleCallback = async (req, res) => {
    const code = req.query.code;
    const redirectUri = 'https://vuonlanho.store/api/user/auth/google/callback';
    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000,
            }
        );
        const accessToken = tokenRes.data.access_token;

        const profileRes = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );
        const { email, name } = profileRes.data;

        let user = await userModel.findOne({ email });
        if (!user) {
            // Nếu chưa có user thì tạo mới
            user = await userModel.create({
                email,
                name,
                password: null,
                authProvider: "google"
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.redirect(`https://vuonlanho.store/success?token=${token}`);
    } catch (error) {
        console.error('Error fetching Google user info:', error);
    }
}

export {
    loginUser,
    registerUser,
    adminLogin,
    facebooklogin,
    facebookcallback,
    googleLogin,
    googleCallback
}