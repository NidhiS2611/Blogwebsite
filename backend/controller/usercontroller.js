
const usermodel = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const { generatetoken } = require('../utils/generatetoken');
const { z } = require('zod');
const blog = require('../models/blogmodel');
const notifyOnFollow = require('../utility/notificationonfollow');  


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
      sameSite: 'lax',
      
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
             await notifyOnFollow({ senderId: userid, receiverId: userfollowedid });

            return res.status(200).json({ message: "Followed successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};



getUserProfile = async (req, res) => {
  try {
    const userid = req.params.id || req.params._id;

    // 🔹 User basic info + followers + following
    const user = await usermodel.findById(userid)
      .select("name bio profilepicture followers following Blog created_at")
      .populate("followers", "name")
      .populate("following", "name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔹 User blogs (detail)
    const blogs = await blog.find({ author: userid })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,

      profile: {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        profilepicture:  
         user.profilepicture
        ? `http://localhost:3000/uploads/${user.profilepicture}`
        : "https://via.placeholder.com/400x200?text=Blog",

        followersCount: user.followers.length,
        followingCount: user.following.length,

        followers: user.followers,
        following: user.following,

        articlesCount: blogs.length,
        articles: blogs,

        joinedAt: user.created_at
      }
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
const savetoken = async (req,res)=>{
  try{
 const {token }= req.body
 const userid = req.user?.id
 if (!userid || !token) {
   return res.status(400).json({ message: 'User ID and token are required' });
 }
 const user = await usermodel.findByIdAndUpdate(userid,{fcmToken: token}, {new:true})
  if (!user) {    
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Token saved successfully', user });
  console.log('FCM Token saved:', user.fcmToken);

  }
  catch(err){
    console.log('error in saving token', err);
    res.status(500).json({ message: 'internal server error' })
    

  }
}

const updatenotification = async (req, res) => {
  const userid = req.user?.id;
  const { type, value } = req.body;

  try {
    const allowedTypes = ['blog', 'follow', 'like', 'comment'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid notification type' });
    }

    const user = await usermodel.findByIdAndUpdate(
      userid,
      {
        $set: {
          [`notificationSettings.${type}`]: value
        }
      },
      { new: true }
    ).select('notificationSettings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: `${type} notification ${value ? 'ON' : 'OFF'}`,
      notificationSettings: user.notificationSettings
    });

  } catch (err) {
    console.log('error in updating notification settings', err);
    res.status(500).json({ message: 'internal server error' });
  }
};
const getnotificationsetting = async (req, res) => {
  const userid = req.user?.id;

  try {
    const user = await usermodel
      .findById(userid)
      .select('notificationSettings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      notificationSettings: user.notificationSettings
    });

  } catch (err) {
    console.log('error in getting notification settings', err);
    res.status(500).json({ message: 'internal server error' });
  }
};


const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true, 
    secure: false,
    sameSite: 'none',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
}
const updateprofile = async (req, res) => {
  try {
    const userid = req.user.id;
    const { name, bio } = req.body;
    const profilepicture = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (profilepicture) updateData.profilepicture = profilepicture;
    const updatedUser = await usermodel.findByIdAndUpdate(
      userid,
      { $set: updateData },
      { new: true }
    )
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) { 
    console.log('Error updating profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


 const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware se aayega
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords required" });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, followUnfollowUser ,getUserProfile, savetoken, updatenotification, getnotificationsetting,logout, updateprofile, changePassword};