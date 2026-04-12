const express = require('express');
const router = express.Router();
const { register,login,followUnfollowUser,getUserProfile,savetoken,updatenotification,getnotificationsetting,logout,updateprofile,changePassword,toggleBookmark,forgotpassword , verifyotp,resetpassword,deactivateAccount,deleteAccountPermanently} = require('../controller/usercontroller');
const authmiddle = require('../middleware/authmiddle');
const usermodel = require('../models/usermodel');
const upload = require('../config/multer');

router.post('/register', register);
router.post('/login', login);
router.post('/follow/:id', authmiddle, followUnfollowUser);
router.get('/me', authmiddle, async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await usermodel.findById(userid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    
    res.status(200).json({
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
    
  }
});
router.get('/profile/:id',getUserProfile )
router.post('/save-token', authmiddle, savetoken);
router.put('/update-notification', authmiddle, updatenotification);
router.get('/get-notification', authmiddle, getnotificationsetting);
router.post('/logout',logout)
router.put('/updateprofile',authmiddle,upload.single('profilepicture'),updateprofile)

router.put('/change-password', authmiddle, changePassword);
router.put('/bookmark/:id',authmiddle, toggleBookmark);
router.post('/forgot-password', forgotpassword);
router.post('/verify-otp', verifyotp);
router.post('/reset-password', resetpassword);
router.put('/deactivate', authmiddle, deactivateAccount);
router.delete('/delete-account', authmiddle, deleteAccountPermanently);


module.exports = router