const express = require('express');
const router = express.Router();
const { register,login,followUnfollowUser} = require('../controller/usercontroller');
const authmiddle = require('../middleware/authmiddle');
const usermodel = require('../models/usermodel');

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

module.exports = router;