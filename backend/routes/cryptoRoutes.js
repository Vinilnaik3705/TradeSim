const express = require('express');
const router = express.Router();
const cryptoAPI = require('../api-integration/cryptoAPI');

/**
 * GET /api/crypto/price/:symbol
 * Get real-time crypto price
 */
router.get('/price/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const data = await cryptoAPI.getPrice(symbol);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/history/:symbol
 * Get historical crypto data
 * Query params: interval (1m, 5m, 15m, 1h, 4h, 1d, 1w), limit (default: 30)
 */
router.get('/history/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const { interval = '1d', limit = 30 } = req.query;
        const data = await cryptoAPI.getHistory(symbol, interval, parseInt(limit));
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/trending
 * Get trending cryptocurrencies (top gainers and losers)
 * Query params: limit (default: 10)
 */
router.get('/trending', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const data = await cryptoAPI.getTrending(parseInt(limit));
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/market-cap
 * Get top cryptocurrencies by market cap (volume)
 * Query params: limit (default: 50)
 */
router.get('/market-cap', async (req, res, next) => {
    try {
        const { limit = 50 } = req.query;
        const data = await cryptoAPI.getTopByMarketCap(parseInt(limit));
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/search
 * Search for cryptocurrencies
 * Query params: q (search query)
 */
router.get('/search', async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }
        const data = await cryptoAPI.search(q);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/batch
 * Get prices for multiple crypto symbols
 * Query params: symbols (comma-separated list)
 */
router.get('/batch', async (req, res, next) => {
    try {
        const { symbols } = req.query;
        if (!symbols) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "symbols" is required'
            });
        }

        const symbolList = symbols.split(',').map(s => s.trim());
        const prices = await Promise.all(
            symbolList.map(symbol => cryptoAPI.getPrice(symbol).catch(err => ({ error: err.message })))
        );

        res.json({ success: true, data: prices });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/crypto/info/:symbol
 * Get exchange info for a crypto symbol
 */
router.get('/info/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const data = await cryptoAPI.getExchangeInfo(symbol);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
