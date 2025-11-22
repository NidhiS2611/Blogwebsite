const express = require('express');
const app = express();

require('dotenv').config();
const connectDB = require('./config/mongooseconnect');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./route/userroutes');
const blogRoutes = require('./route/blogroutes');
const commentRoutes = require('./route/commentroute');

app.use('/comment', commentRoutes);

app.use('/blog', blogRoutes);
app.use('/user', userRoutes);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;