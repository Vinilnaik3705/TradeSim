require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const etfRoutes = require('./routes/etfRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const newsRoutes = require('./routes/newsRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://trade-sim-tau.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/etfs', etfRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
