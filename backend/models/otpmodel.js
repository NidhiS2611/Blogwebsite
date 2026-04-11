const mongoose = require('mongoose');       
 const otpschema = new mongoose.Schema({
    email: { type: String, required: true },
    otpHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // OTP will expire after 5 minutes
});

const otpModel = mongoose.model('otp', otpschema);

module.exports = otpModel;