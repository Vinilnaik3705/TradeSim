const express = require('express');
const router = express.Router();
const stocksAPI = require('../api-integration/stocksAPI');

/**
 * GET /api/stocks/quote/:symbol
 * Get real-time stock quote
 */
router.get('/quote/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const data = await stocksAPI.getQuote(symbol.toUpperCase());
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stocks/history/:symbol
 * Get historical stock data
 * Query params: period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y), interval (1m, 5m, 15m, 1h, 1d)
 */
router.get('/history/:symbol', async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const { period = '1mo', interval = '1d' } = req.query;
        const data = await stocksAPI.getHistory(symbol.toUpperCase(), period, interval);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stocks/search
 * Search for stocks
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
        const data = await stocksAPI.search(q);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stocks/movers
 * Get top gainers and losers
 */
router.get('/movers', async (req, res, next) => {
    try {
        const data = await stocksAPI.getMovers();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stocks/top
 * Get top 50+ popular stocks
 * Query params: limit (default: 50)
 */
router.get('/top', async (req, res, next) => {
    try {
        const { limit = 50 } = req.query;
        const data = await stocksAPI.getTopStocks(parseInt(limit));
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/stocks/batch
 * Get quotes for multiple symbols
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
            symbolList.map(symbol => stocksAPI.getQuote(symbol).catch(err => ({ error: err.message })))
        );

        res.json({ success: true, data: quotes });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
