require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const stockRoutes = require("./routes/stockRoutes");
const etfRoutes = require("./routes/etfRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const newsRoutes = require("./routes/newsRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://tradesim-9yh.pages.dev",
        /^https:\/\/.*\.tradesim-9yh\.pages\.dev$/
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(rateLimiter);

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get("/", (req, res) => {
    res.send("TradeSim Backend Running ✅");
});

app.use("/api/stocks", stockRoutes);
app.use("/api/etfs", etfRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/auth", require("./routes/authRoutes"));

app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.method} ${req.url} not found`
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
