const express = require('express');
const passport = require('passport');
const {generatetoken} = require('../utils/generatetoken');
const router = express.Router();

// 1. Google Login Trigger
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback (Yahan sara magic hoga)
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      // ✅ Passport ne user ko 'req.user' mein daal diya hai
      const user = req.user;

      // 🔹 Check karo account Active hai ya nahi (Tera Danger Zone logic)
      if (!user.isActive) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=Account deactivated`);
      }

      // 🔹 JWT Token generate karo (Wahi logic jo tune banaya hai)
      const token = generateToken(user._id);

      // 🔹 Cookie set karo (Vercel/Render ke liye optimized)
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Hamesha true rakho production ke liye
        sameSite: "none", // Cross-site cookies ke liye zaroori hai
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Din
      });

      // 🔹 Success! Ab frontend ke home page par bhej do
      // Frontend is cookie ko automatically read kar lega (Axios withCredentials: true se)
      res.redirect(`${process.env.FRONTEND_URL}/home`);

    } catch (error) {
      console.error("JWT Error in Google Callback:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Server Error`);
    }
  }
);

module.exports = router;