const commentmodel = require('../models/commentmodel');
const blogmodel = require('../models/blogmodel');
const usermodel = require('../models/usermodel');
const { email } = require('zod');


const comment = async (req, res) => {
  try {
    const { comment } = req.body;   // <- FIXED
    const blogid = req.params.id;
    const userid = req.user._id;

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

    res.redirect(`/blog/${blogid}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const editcomment = async(req,res)=>{
  try {
    const {comment} = req.body;
    const commentid = req.params.id;
    const comments = await commentmodel.findByIdAndUpdate(commentid, {comment:comment}, {new:true});
    if(!comments) {
      return res.status(404).json({error:'Comment not found'});
    }
    await comments.save();
    res.redirect(`/blog/${comments.blog}`);
  } catch(error) {
    console.error(error);
    res.status(500).json({error:'Something went wrong'});
  }
};
const deletecomment = async(req,res)=>{
  try{
 const {id} = req.params
 const comment = await commentmodel.findByIdAndDelete(id)
 res.redirect(`/blog/${comment.blog}`)
  } catch(error){
    console.error(error);
    res.status(500).json({error:'Something went wrong'});
  }
}

module.exports = { comment, editcomment, deletecomment };