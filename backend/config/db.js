const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });


        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
