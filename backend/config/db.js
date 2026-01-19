const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/tradesim', {
            // New Mongoose 6+ defaults render these options unnecessary but adding for clarity if using older versions or specific needs
            // useStylesParser and useUnifiedTopology are now default true
        });

        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ Error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
