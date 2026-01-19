const blogmodel = require('../models/blogmodel');
const usermodel = require('../models/usermodel');
const mongoose = require('mongoose');
const model = require('../services/aiservices')

const createblog = async (req, res) => {
  // Ensure user is authenticated
 
  const userid = req.user.id;
  console.log(userid);
  


  try {
    const { title, content, excerpt , category } = req.body;
    const media = req.file ? req.file.filename : "default.jpg";

    if (!title || !content || !excerpt || !category) {
      res.json({ msg: "Title, content, excerpt, and category are required" });
    }

    const blog = await blogmodel.create({
      title,
      content,
      author: userid,
      media,
      excerpt,
      category
    });

    // attach blog to user safely
    const user = await usermodel.findById(userid);
    if (user) {
      user.Blog = user.Blog || [];
      user.Blog.push(blog._id);
      await user.save();
    }

    res.status(201).json({ msg: "Blog created successfully", blog });
  } catch (error) {
    console.log(error);}}
const toggleLike = async (req, res) => {
 
 try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await blogmodel.findById(blogId);
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
      blog.likes.push( new mongoose.Types.ObjectId(userId));
    }

    await blog.save();

    res.json({
      msg: alreadyLiked ? "Unliked" : "Liked",
      likes: blog.likes.length
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
  

const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogid = new mongoose.Types.ObjectId(id) 

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // 2. Optimized Aggregation Pipeline
    const blog = await blogmodel.aggregate([
      // Stage 1: Match the specific blog ID
      {
        $match: { _id: blogid }
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
const getTopBlogs = async (req, res) => {
  try {
    const blogs = await blogmodel.find()
      .limit(5)
      .populate("author", "name") // only author name
      .lean();

    const formatted = blogs.map((b, index) => ({
      id: b._id,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
          media: b.media
        ? `http://localhost:3000/uploads/${b.media}`
        : "https://via.placeholder.com/400x200?text=Blog",
      author: b.author?.name || "Unknown",
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
         day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    
    }));

    res.json({ success: true, blogs: formatted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
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


const generateBlogwithai = async (req, res) => {
  try {
    const { aiprompt } = req.body;

    const prompt = `
You are a professional blog writer.

Write a high-quality, engaging blog article about:

"${aiprompt}"

Rules:
- Length must be between 100 and 200 words
- Use simple, clear English
- Add a short introduction
- Use small paragraphs
- Add 1–2 subheadings
- Make it suitable for a blog website
- Do not add emojis
- Do not mention AI or Gemini
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      content: text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "AI failed" });
  }
}
const getallBlogs = async (req, res) => {
  try {
    const blogs = await blogmodel.find()
      
      .populate("author", "name") // only author name
      

    const formatted = blogs.map((b, index) => ({
      id: b.id,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
          media: b.media
        ? `http://localhost:3000/uploads/${b.media}`
        : "https://via.placeholder.com/400x200?text=Blog",
      author: b.author?.name || "Unknown",
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
         day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    
    }));

    res.json({ success: true, blogs: formatted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


module.exports = { createblog, toggleLike, getSingleBlog , getTopBlogs, updateBlog, generateBlogwithai, getallBlogs   };