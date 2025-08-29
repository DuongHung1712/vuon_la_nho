import 'dotenv/config';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { Strategy as FacebookStrategy } from 'passport-facebook';

const configLoginwithFacebook = () => {
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
      profileFields: ['id', 'email', 'name', 'displayName']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await userModel.findOne({ email });
        if (!user) {
          user = new userModel({
            name: profile.displayName || "Facebook User",
            email,
            password: null,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
};

export default configLoginwithFacebook;
