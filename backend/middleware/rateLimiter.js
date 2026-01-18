/**
 * Rate limiting middleware to prevent API abuse
 */
const rateLimit = new Map();

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, {
            count: 1,
            resetTime: now + windowMs
        });
        return next();
    }

    const userLimit = rateLimit.get(ip);

    // Reset if window has passed
    if (now > userLimit.resetTime) {
        rateLimit.set(ip, {
            count: 1,
            resetTime: now + windowMs
        });
        return next();
    }

    // Increment request count
    userLimit.count++;

    // Check if limit exceeded
    if (userLimit.count > maxRequests) {
        const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
        res.set('Retry-After', retryAfter);
        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            retryAfter
        });
    }

    next();
};

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimit.entries()) {
        if (now > data.resetTime) {
            rateLimit.delete(ip);
        }
    }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
