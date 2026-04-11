const express = require('express');
const router = express.Router();
const { createblog,toggleLike,getFeedBlogs,getSingleBlog,updateBlog,generateBlogwithai ,getallBlogs,updateViewCount,deleteBlog,getTodayHighlight ,getSavedBlogs} = require('../controller/blogcontroller');
const upload = require('../config/multer'); 
const authmiddle = require('../middleware/authmiddle');
router.post('/create', authmiddle, upload.single('media'), createblog);
router.post('/like/:id', authmiddle, toggleLike);
router.get('/blog/:id',authmiddle, getSingleBlog);
router.get('/feedblog', authmiddle, getFeedBlogs);
router.put('/updateblog/:id', authmiddle, upload.single('media'), updateBlog);
router.post('/generate-ai-blog',  generateBlogwithai);
router.get('/allblog', getallBlogs);
router.put('/view/:id', authmiddle, updateViewCount);
router.delete('/deleteblog/:id',authmiddle,upload.single('media'),deleteBlog)
router.get('/today-highlight', getTodayHighlight);
router.get('/saved-blogs', authmiddle, getSavedBlogs);
module.exports = router;