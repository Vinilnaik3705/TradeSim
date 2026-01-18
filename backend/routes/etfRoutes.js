const express = require('express');
const router = express.Router();
const etfsAPI = require('../api-integration/etfsAPI');

/**
 * GET /api/etfs/quote/:symbol
 * Get real-time ETF quote
 */
router.get('/quote/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const data = await etfsAPI.getQuote(symbol.toUpperCase());
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/history/:symbol
 * Get historical ETF data
 * Query params: period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y), interval (1m, 5m, 15m, 1h, 1d)
 */
router.get('/history/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const { period = '1mo', interval = '1d' } = req.query;
        const data = await etfsAPI.getHistory(symbol.toUpperCase(), period, interval);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/search
 * Search for ETFs
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
        const data = await etfsAPI.search(q);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/popular
 * Get popular ETFs
 */
router.get('/popular', async (req, res, next) => {
    try {
        const data = await etfsAPI.getPopular();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/top
 * Get top 50+ ETFs across different categories
 * Query params: limit (default: 50)
 */
router.get('/top', async (req, res, next) => {
    try {
        const { limit = 50 } = req.query;
        const data = await etfsAPI.getTopETFs(parseInt(limit));
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/holdings/:symbol
 * Get ETF holdings and sector weightings
 */
router.get('/holdings/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const data = await etfsAPI.getHoldings(symbol.toUpperCase());
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/etfs/batch
 * Get quotes for multiple ETF symbols
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

        const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
        const quotes = await Promise.all(
            symbolList.map(symbol => etfsAPI.getQuote(symbol).catch(err => ({ error: err.message })))
        );

        res.json({ success: true, data: quotes });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
