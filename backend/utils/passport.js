const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const usermodel = require('../models/usermodel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. MongoDB mein Email se dhundo
      let user = await usermodel.findOne({ email: profile.emails[0].value });

      if (user) {
        // ✅ Login Logic: Agar user mil gaya, bas uska googleId attach kar do (agar pehle nahi tha)
        if (!user.googleId) {
          user.googleId = profile.id;
          user.authMethod = 'google';
          await user.save();
        }
        return done(null, user);
      } else {
        // ✅ Signup Logic: Naya user create karo
        const newUser = await usermodel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilepicture: profile.photos[0].value,
          authMethod: 'google',
          password: null // Password ki zarurat nahi hai Google auth mein
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));