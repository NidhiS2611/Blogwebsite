const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();
const connectDB = require('./config/mongooseconnect');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors({
    origin: 'https://blogwebsite-pi-silk.vercel.app',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));



const userRoutes = require('./route/userroutes');
const blogRoutes = require('./route/blogroutes');
const commentRoutes = require('./route/commentroute');
const notificationRoutes = require('./route/notificationroutes');

app.use('/comment', commentRoutes);
app.use('/notification', notificationRoutes);

app.use('/blog', blogRoutes);
app.use('/user', userRoutes);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;