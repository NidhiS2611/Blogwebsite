
const usermodel = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const { generatetoken } = require('../utils/generatetoken');
const { z } = require('zod');


const userschema = z.object({
  name: z.string().min(3, 'minimum 3 characters required').max(20, 'maximum 20 characters allowed'),
  email: z.string().email('invalid email'),
  password: z.string().min(6, 'minimum 6 characters required in password').max(20, 'maximum 20 characters allowed').refine((val => /[A-Z]/.test(val)), 'Password must contain at least one uppercase letter'),
  

})

const register = async (req, res) => {
  try {


    const { name, email, password } = req.body;
    

    const validation = userschema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error.issues[0].message });

    }

    if (!name || !email || !password ) {
      return res.status(400).json({ message: 'All fields are required' });
    }



    const user = await usermodel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await usermodel.create({
      name,
      email,
      password: hash,
      
    })
    const token = await generatetoken(newUser)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })


    return res.status(201).json({ message: 'User registered successfully', token })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'internal server error' })
  }
}
const login = async (req, res) => {
  try {

    const { email, password } = req.body
  
       



    if (!email || !password) {
      return res.status(400).json({ message: 'all fields are required' })
    }

    const user = await usermodel.findOne({ email })


    if (!user ) {
      return res.status(400).json({ message: 'User not find' })
    }
   
    const match = await bcrypt.compare(password, user.password)
   
    

    if (!match) {
      return res.status(400).json({ message: 'invalid credentials' })
    }
    const token = await generatetoken(user)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: 'None',
    })

    
    return res.status(200).json({
      message: 'login successful', token, user: {
        
        name: user.name,
        email: user.email
      }
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: 'internal error' })

  }
}
const followUnfollowUser = async (req, res) => {
    try {
        const userfollowedid = req.params.id;  // jis user ko follow karna hai
        const userid = req.user.id // jo follow kar raha hai

        if (userid === userfollowedid) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        const user = await usermodel.findById(userid);
        const followedUser = await usermodel.findById(userfollowedid);

        if (!user || !followedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // ---- CHECK IF ALREADY FOLLOWING ----
        const isFollowing = user.following.includes(userfollowedid);

        if (isFollowing) {
            // Already following → UNFOLLOW
            user.following = user.following.filter(id => id.toString() !== userfollowedid);
            followedUser.followers = followedUser.followers.filter(id => id.toString() !== userid);

            await user.save();
            await followedUser.save();

            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            // NOT FOLLOWING → FOLLOW
            user.following.push(userfollowedid);
            followedUser.followers.push(userid);

            await user.save();
            await followedUser.save();

            return res.status(200).json({ message: "Followed successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};



module.exports = { register, login, followUnfollowUser   };