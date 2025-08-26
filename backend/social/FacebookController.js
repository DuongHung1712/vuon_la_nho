import 'dotenv/config'
import passport from 'passport';
import userModel from "../models/userModel.js"

import { Strategy as FacebookStrategy } from 'passport-facebook';


const configLoginwithFacebook = () => {
    passport.use(new FacebookStrategy ({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
        profileFields: ['id', 'name', 'displayName']
    },
    async function (accessToken, refreshToken, profile, cb) {
        console.log("Facebook profile", profile);
        const typeAcc = 'FACEBOOK';
        let dataraw = {
            username: profile.displayName,
            facebookId: profile.id
        }
         

    }
    ));
}
export default configLoginwithFacebook;