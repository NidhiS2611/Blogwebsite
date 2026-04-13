
const usermodel = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const { generatetoken } = require('../utils/generatetoken');
const { z } = require('zod');
const blog = require('../models/blogmodel');
const notifyOnFollow = require('../utility/notificationonfollow');
const { trusted } = require('mongoose');
const crypto = require('crypto');
const otpModel = require('../models/otpmodel');
const sendmail = require('../services/sendmail');


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

    if (!name || !email || !password) {
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
      secure: true,
      sameSite: 'None',
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


    if (!user) {
      return res.status(400).json({ message: 'User not find' })
    }

    const match = await bcrypt.compare(password, user.password)



    if (!match) {
      return res.status(400).json({ message: 'invalid credentials' })
    }

    if (user.isActive === false) {
      user.isActive = true;
      // Uske purane blogs ko wapas public (true) kar do
      await blog.updateMany({ author: user.id }, { isPublished: true });
      await user.save();
      console.log(`User ${user.email} reactivated!`);
    }
    const token = await generatetoken(user)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'None',

    })


    return res.status(200).json({
      message: 'login successful', token, user: {

        name: user.name,
        email: user.email,
        isActive: user.isActive
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
    const userfollowedid = req.params.id;
    const userid = req.user.id;

    if (userid === userfollowedid) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const user = await usermodel.findById(userid);
    const followedUser = await usermodel.findById(userfollowedid);

    if (!user || !followedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isAlreadyFollowing = user.following
      .map(id => id.toString())
      .includes(userfollowedid);

    let isFollowing;

    if (isAlreadyFollowing) {
      // 🔹 UNFOLLOW
      user.following = user.following.filter(
        id => id.toString() !== userfollowedid
      );

      followedUser.followers = followedUser.followers.filter(
        id => id.toString() !== userid
      );

      isFollowing = false;

    } else {
      // 🔹 FOLLOW
      user.following.push(userfollowedid);
      followedUser.followers.push(userid);

      isFollowing = true;

      await notifyOnFollow({
        senderId: userid,
        receiverId: userfollowedid
      });
    }

    await user.save();
    await followedUser.save();

    return res.status(200).json({
      message: isFollowing ? "Followed successfully" : "Unfollowed successfully",
      isFollowing   // 👈 IMPORTANT
    });

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
            ? user.profilepicture
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
const savetoken = async (req, res) => {
  try {
    const { token } = req.body
    const userid = req.user?.id
    if (!userid || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }
    const user = await usermodel.findByIdAndUpdate(userid, { fcmToken: token }, { new: true })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Token saved for user:', user.fcmToken);
    res.status(200).json({ message: 'Token saved successfully', user });


  }
  catch (err) {
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
    const profilepicture = req.file ? req.file.path : undefined;
    console.log('req.file:', req.file);

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
    console.log('Error updating profile:', err.message);
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
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // Auth middleware se mil jayega
    const blogId = req.params.id; // URL se mil jayega

    const user = await usermodel.findById(userId);

    // Check karo ki pehle se bookmark hai ya nahi
    const isBookmarked = user.bookmarks.includes(blogId);

    if (isBookmarked) {
      // Agar hai toh nikal do (Remove)
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== blogId);
    } else {
      // Agar nahi hai toh add kar do (Add)
      user.bookmarks.push(blogId);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      bookmarks: user.bookmarks
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling bookmark" });
  }
};

// usercontroller.js
const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User inactive mark karo
    await usermodel.findByIdAndUpdate(userId, { isActive: false });

    // 2. Blogs hide karo
    await blog.updateMany({ author: userId }, { isPublished: false });

    // 3. COOKIE CLEAR KARO (Vercel-Render Specific)
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,      // Vercel/Render dono HTTPS hain, toh ye TRUE hona chahiye
      sameSite: "none",  // Cross-site ke liye 'none' compulsory hai
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Account deactivated and logged out from Vercel ✅"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// usercontroller.js
const deleteAccountPermanently = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User ke saare blogs delete karo (Database cleaning)
    const deletedBlogs = await blog.deleteMany({ author: userId });
    console.log(`${deletedBlogs.deletedCount} blogs deleted for user: ${userId}`);

    // 2. User ki profile delete karo
    const deletedUser = await usermodel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User nahi mila" });
    }

    // 3. User ki profile image agar Cloudinary/Server par hai toh wahan se bhi hata dena

    res.status(200).json({
      success: true,
      message: "Account aur aapke saare blogs hamesha ke liye delete ho gaye hain."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotpassword = async (req, res) => {
  // Implement forgot password logic here 
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
    const newotp = new otpModel({ email, otpHash });
    await newotp.save();
    const message = `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`;
    await sendmail(email, "Password Reset OTP", message);
    res.status(200).json({ message: "OTP sent to email" });



  }
  catch (e) {
    res.status(400).json({ message: "Invalid data" });
    console.log(e);
  }
}


const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
    const otpRecord = await otpModel.findOne({ email, otpHash });

    if (!otpRecord || otpRecord.createdAt < new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed with password reset logic
    // ...
    res.status(200).json({ message: "OTP verified successfully" });

  }
  catch (e) {
    res.status(400).json({ message: "Invalid data" });
    console.log(e);
  }

}


const resetpassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    const otpHash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
    const otpRecord = await otpModel.findOne({ email, otpHash });

    if (!otpRecord || otpRecord.createdAt < new Date(Date.now() - 5 * 60 * 1000)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    await otpModel.deleteMany({ email });
    res.status(200).json({ message: "Password reset successfully" });


  }
  catch (e) {
    res.status(400).json({ message: "Invalid data" });
    console.log(e);
  }
}
module.exports = { register, login, followUnfollowUser, getUserProfile, savetoken, updatenotification, getnotificationsetting, logout, updateprofile, changePassword, toggleBookmark, deactivateAccount, deleteAccountPermanently, forgotpassword, verifyotp, resetpassword };