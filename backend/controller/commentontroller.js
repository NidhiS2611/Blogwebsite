const commentmodel = require('../models/commentmodel');
const blogmodel = require('../models/blogmodel');
const usermodel = require('../models/usermodel');
const { email } = require('zod');
const notifyOnComment = require('../utility/notificationoncomment');


const comment = async (req, res) => {
  try {
    const { comment } = req.body;   // <- FIXED
    const blogid = req.params.id;
    const userid = req.user.id;

    const user = await usermodel.findOne({ email: req.user.role});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blog = await blogmodel.findById(blogid);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const newComment = await commentmodel.create({
      comment,
      blog: blogid,
      user: userid
    });

    blog.Comments.push(newComment._id);  // <- FIXED lowercase
    await blog.save();
    user.comments.push(newComment._id);
await user.save();
await notifyOnComment({ senderId: userid, receiverId: blog.author, blogId: blogid, commentText: comment });
console.log(newComment);


    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const editcomment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentid = req.params.id;

    const updatedComment = await commentmodel
      .findByIdAndUpdate(commentid, { comment }, { new: true })
      .populate("user", "name profilepicture"); // optional but best

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,   // 🔥 frontend friendly key
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE /comment/delete/:id
const deletecomment = async (req, res) => {
  try {
    const deleted = await commentmodel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
       // ✅ sirf apna delete
    });

    if (!deleted) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

const fetchcomment = async (req, res) => {
  try {
    const postid = req.params.id;

    const comments = await commentmodel
      .find({blog: postid })                // ✅ find (not findOne)
      .populate("user", "name")  // ✅ user data
      .sort({ createdAt: -1 });        // latest first
   console.log("comments",comments);
    res.status(200).json({
      success: true,
      comments,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};


module.exports = { comment, editcomment, deletecomment,fetchcomment };