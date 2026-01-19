const express = require('express');
const router = express.Router();
const { createblog,toggleLike,getTopBlogs,getSingleBlog,updateBlog,generateBlogwithai ,getallBlogs} = require('../controller/blogcontroller');
const upload = require('../config/multer'); 
const authmiddle = require('../middleware/authmiddle');
router.post('/create', authmiddle, upload.single('media'), createblog);
router.post('/like/:id', authmiddle, toggleLike);
router.get('/blog/:id',authmiddle, getSingleBlog);
router.get('/blog', getTopBlogs);
router.put('/updateblog/:id', authmiddle, upload.single('media'), updateBlog);
router.post('/generate-ai-blog',  generateBlogwithai);
router.get('/allblog', getallBlogs);

module.exports = router;