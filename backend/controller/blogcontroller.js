const blogmodel = require('../models/blogmodel');
const usermodel = require('../models/usermodel');
const mongoose = require('mongoose');
const ai = require('../services/aiservices')
const notifyOnNewBlog = require('../utility/notificationonpost')
const notifyOnlike = require('../utility/notificationonlike');

const createblog = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const userid = req.user.id;
    console.log("Creating blog for user:", userid);

    const { title, content, excerpt, category } = req.body;
    const media = req.file?.path || "default.jpg";

    if (!title || !content || !excerpt || !category) {
      return res.status(400).json({
        msg: "Title, content, excerpt, and category are required",
      });
    }

    const blog = await blogmodel.create({
      title,
      content,
      author: userid,
      media,
      excerpt,
      category,
    });

    const user = await usermodel.findById(userid);
    if (user) {
      user.Blog = user.Blog || [];
      user.Blog.push(blog._id);
      await user.save();
    }

    // safe notification
    try {
      await notifyOnNewBlog({ blogId: blog._id, blogOwnerId: userid });
    } catch (err) {
      console.log("Notification error:", err.msg || err);
    }

    return res.status(201).json({
      msg: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.log("ERROR:", error.message); 
    return res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};
const toggleLike = async (req, res) => {

  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await blogmodel.findById(blogId).populate("author", "name");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Ensure likes is an array and remove null/undefined
    blog.likes = Array.isArray(blog.likes) ? blog.likes.filter(id => id != null) : [];

    const userIdStr = userId.toString();

    // Convert ids safely
    const likesStr = blog.likes.map(id => id.toString());

    const alreadyLiked = likesStr.includes(userIdStr);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userIdStr);
    } else {
      // avoid pushing a duplicate and ensure correct type
      blog.likes.push(new mongoose.Types.ObjectId(userId));
    }

    await blog.save();
    await notifyOnlike({ senderId: userId, receiverId: blog.author._id, blogId: blog._id });

    res.json({
      msg: alreadyLiked ? "Unliked" : "Liked",
      likes: blog.likes.length
    });
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
}


const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("blogid", req.params);



    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }
    const blogId = new mongoose.Types.ObjectId(id);
    // 2. Optimized Aggregation Pipeline
    const blog = await blogmodel.aggregate([
      // Stage 1: Match the specific blog ID
      {
        $match: { _id: blogId }
      },

      // Stage 2: Load Blog Author details
      {
        $lookup: {
          from: "users", // Joins with 'users' collection
          localField: "author",
          foreignField: "_id",
          as: "authorData"
        }
      },
      { $unwind: "$authorData" }, // Convert authorData array to a single object

      // Stage 3: Load Comments AND Embed Comment User details (Nested Lookup)
      {
        $lookup: {
          from: "comments",
          localField: "Comments", // Ensure this case (Capital C) matches your Blog Schema
          foreignField: "_id",
          as: "commentsData",
          pipeline: [
            // Nested Lookup for User inside each Comment
            {
              $lookup: {
                from: "users", // Joins with 'users' collection again
                localField: "user", // Field in the 'comments' collection
                foreignField: "_id",
                as: "userDetails"
              }
            },
            { $unwind: "$userDetails" }, // Embeds the user object
            // Clean up: Remove password and __v from user details within the comment
            {
              $project: {
                "userDetails.password": 0,
                "__v": 0,
              }
            }
          ]
        }
      },

      // Stage 4: Add Like Count
      {
        $addFields: {
          likeCount: { $size: "$likes" }
        }
      },

      // Stage 5: Final Clean Response (Remove passwords and unused fields from top level)
      {
        $project: {
          __v: 0,
          "authorData.password": 0,
          // Note: commentsData.userDetails.password is already removed in the nested pipeline
        }
      }
    ]);

    // 3. Handle Not Found
    if (!blog.length) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 4. Send Success Response
    console.log("data", blog[0]);
    return res.status(200).json({
      success: true,
      data: blog[0]
    });

  } catch (error) {
    console.error("Aggregation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error during aggregation",
      error: error.message
    });
  }
};

const getFeedBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let query = {};

    // ✅ agar login user hai to following ko priority
    if (req.user && Array.isArray(req.user.following)) {
      query = {
        $or: [
          { author: { $in: req.user.following } }, // following blogs
          {}, // + global mix
        ],
      };
    }

    const blogs = await blogmodel
      .find(query)
      .sort({ createdAt: -1 })        // ✅ latest first
      .skip(skip)
      .limit(limit)
      .populate("author", "name profilepicture") // only author name and profile picture
      .lean();

    const formatted = blogs.map((b) => ({
      id: b._id,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      media: b.media
        ? b.media
        : "https://via.placeholder.com/400x200?text=Blog",
        author: {
        name: b.author?.name || "Unknown",
        profilepicture: b.author?.profilepicture
          
      },
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      likes: Array.isArray(b.likes) ? b.likes.length : 0,
        views: b.views || 0,
      
    }));
    console.log("Feed blogs:", formatted);
    res.status(200).json({
      success: true,
      blogs: formatted,
      page,
      limit,
    });
  } catch (err) {
    console.log("Feed error:", err);
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    // Blog exist check
    const blog = await blogmodel.findById(blogId);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Owner check
    if (blog.author.toString() !== userId)
      return res.status(403).json({ msg: "Not authorized" });

    // Update object
    let updateData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt,
      category: req.body.category,
    };

    // ✔ If image uploaded => update it
    if (req.file) {
      updateData.media = req.file.filename;
    }

    // Final update
    const updatedBlog = await blogmodel.findByIdAndUpdate(
      blogId,
      { $set: updateData },
      { new: true }
    );

    res.json({ msg: "Blog updated successfully", blog: updatedBlog });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};


 // path adjust karo




const generateBlogwithai = async (req, res) => {
  try {
    const { aiprompt } = req.body;

    if (!aiprompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const prompt = `
You are a professional blog writer.

Write a high-quality, engaging blog article about:

"${aiprompt}"

Rules:
- Length must be between 100 and 200 words
- Use simple English
- Add 1–2 small subheadings
- No emojis
- Do not mention AI
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",  // ✅ latest working
      contents: prompt,
    });

    res.json({
      success: true,
      content: response.text,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gemini AI failed",
    });
  }
};




const getallBlogs = async (req, res) => {
  try {
    const blogs = await blogmodel.find()

      .populate("author", "name profilepicture") // only author name and profile picture


    const formatted = blogs.map((b, index) => ({
      id: b.id,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      media: b.media
        ? b.media
        : "https://via.placeholder.com/400x200?text=Blog",
      author: {
        name: b.author?.name || "Unknown",
        profilepicture: b.author?.profilepicture},
         
      views: b.views || 0,
        
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

    }));
       console.log("All blogs:", formatted);
       

    res.json({ success: true, blogs: formatted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// routes/blog.js
const updateViewCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await blogmodel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.views.includes(userId)) {
      blog.views.push(userId);
      await blog.save();
    }
     console.log("Updated views for blog:", blog.title, "Total views:", blog.views.length);
    res.json({
      success: true,
      viewsCount: blog.views.length,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "View update failed" });
  }
};

// controllers/blog.controller.js

const deleteBlog = async (req, res) => {
  try {
    console.log("👉 Delete API hit hua");

    const { id } = req.params;
    const userId = req.user.id; // auth middleware se aata hai


    const blog = await blogmodel.findById(id);

    if (!blog) {
      console.log("❌ Blog nahi mila");
      return res.status(404).json({ message: "Blog not found" });
    }

    // Owner check
    if (blog.author.toString() !== userId.toString()) {
      console.log("⛔ Unauthorized delete attempt");
      return res.status(403).json({ message: "You are not allowed to delete this blog" });
    }

    await blogmodel.findByIdAndDelete(id);

    console.log("✅ Blog successfully delete ho gaya");

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("🔥 Delete blog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getTodayHighlight = async (req, res) => {
  try {

    const post = await blogmodel
      .find()
      .sort({ likes: -1 })   // ⚠ only works if likes is number
      .limit(1)
      .populate("author", "name");

    if (!post.length) {
      return res.status(200).json(null);
    }

    res.status(200).json(post[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getSavedBlogs = async (req, res) => {
  try {
    // 1. User dhoondo aur uske 'bookmarks' array ko populate karo
    const user = await usermodel.findById(req.user.id).populate({
      path: "bookmarks",
      populate: { 
        path: "author", 
        select: "name profilepicture" // Author ki info bhi le aao PostCard ke liye
      }
    }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Saved blogs ko format karo jaisa Home page par hai
    const formatted = user.bookmarks.map((b) => ({
      id: b._id,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      media: b.media || "https://via.placeholder.com/400x200?text=Blog",
      author: {
        name: b.author?.name || "Unknown",
        profilepicture: b.author?.profilepicture,
      },
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      likes: Array.isArray(b.likes) ? b.likes.length : 0,
      views: Array.isArray(b.views) ? b.views.length : 0, // Views array length ya count
    }));

    res.status(200).json({
      success: true,
      blogs: formatted, // Isse tumhara frontend loop asani se chal jayega
    });

  } catch (err) {
    console.log("Saved blogs error:", err);
    res.status(500).json({ message: "Failed to fetch saved blogs" });
  }
};


module.exports = { createblog, toggleLike, getSingleBlog, getFeedBlogs, updateBlog, generateBlogwithai, getallBlogs ,updateViewCount,deleteBlog, getTodayHighlight, getSavedBlogs};