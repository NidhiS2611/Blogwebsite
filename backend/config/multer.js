const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary Settings (Apne Cloudinary Dashboard se credentials yaha daal)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_website_uploads', // Cloudinary pe is naam ka folder ban jayega
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: Resize karne ke liye
    },
});

// 3. Multer Middleware
const upload = multer({ storage: storage });

module.exports = upload;
 