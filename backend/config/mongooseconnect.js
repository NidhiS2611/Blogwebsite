 const mongoose = require('mongoose');
const debug = require('debug')('blog:mongoose');

const dotenv = require('dotenv');

dotenv.config();

const mongo_uri = process.env.MONGO_URI;
console.log("Mongo URI:", mongo_uri);


if (!mongo_uri) {
    console.error("❌ Error: MONGO_URI is not defined in config!");
    process.exit(1); 
}

mongoose.set('debug', true); 


(async () => {
    try {
        await mongoose.connect(mongo_uri);
        debug('MongoDB Connected!');
        console.log("MongoDB Connected!");
    } catch (err) {
        debug('MongoDB Connection Error: %O', err);
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    }
    
})();

module.exports = mongoose;
