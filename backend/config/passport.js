import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Optional: restrict to specific domain
        const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
        if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
          return done(null, false, { message: `Only ${allowedDomain} emails allowed` });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            fullName: profile.displayName,
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.fullName) user.fullName = profile.displayName;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
