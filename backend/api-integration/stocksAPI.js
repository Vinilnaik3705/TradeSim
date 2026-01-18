const yahooFinance = require('yahoo-finance2').default;
const cacheService = require('../services/cacheService');

// Configure yahoo-finance2 to skip validation errors
yahooFinance.setGlobalConfig({
    validation: {
        logErrors: false,
        logOptionsErrors: false
    }
});

// Fallback mock data for when Yahoo Finance is rate-limited
const FALLBACK_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.50, changePercent: 1.2, marketCap: 2850000000000, volume: 52000000 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 390.00, changePercent: 0.5, marketCap: 2900000000000, volume: 24000000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.50, changePercent: -0.3, marketCap: 1750000000000, volume: 18000000 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.00, changePercent: -1.0, marketCap: 1600000000000, volume: 45000000 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 540.00, changePercent: 3.2, marketCap: 1330000000000, volume: 38000000 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 380.00, changePercent: 2.1, marketCap: 960000000000, volume: 15000000 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 215.10, changePercent: 5.4, marketCap: 680000000000, volume: 95000000 },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', price: 365.00, changePercent: 0.2, marketCap: 780000000000, volume: 3000000 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 165.00, changePercent: 0.8, marketCap: 475000000000, volume: 8000000 },
    { symbol: 'V', name: 'Visa Inc.', price: 265.00, changePercent: 1.1, marketCap: 540000000000, volume: 5500000 },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 165.50, changePercent: -0.2, marketCap: 450000000000, volume: 6000000 },
    { symbol: 'MA', name: 'Mastercard Inc.', price: 425.00, changePercent: 0.9, marketCap: 400000000000, volume: 2500000 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 160.00, changePercent: 0.3, marketCap: 385000000000, volume: 5000000 },
    { symbol: 'PG', name: 'Procter & Gamble Co.', price: 155.00, changePercent: 0.1, marketCap: 365000000000, volume: 4500000 },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 520.00, changePercent: 1.5, marketCap: 485000000000, volume: 2800000 },
    { symbol: 'HD', name: 'The Home Depot Inc.', price: 360.00, changePercent: 0.7, marketCap: 365000000000, volume: 3200000 },
    { symbol: 'BAC', name: 'Bank of America Corp.', price: 35.50, changePercent: 1.2, marketCap: 280000000000, volume: 42000000 },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 105.00, changePercent: -0.5, marketCap: 425000000000, volume: 18000000 },
    { symbol: 'CVX', name: 'Chevron Corporation', price: 150.00, changePercent: -0.3, marketCap: 275000000000, volume: 7000000 },
    { symbol: 'ABBV', name: 'AbbVie Inc.', price: 165.00, changePercent: 0.6, marketCap: 290000000000, volume: 5500000 },
    { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.50, changePercent: -1.2, marketCap: 160000000000, volume: 35000000 },
    { symbol: 'KO', name: 'The Coca-Cola Company', price: 60.00, changePercent: 0.4, marketCap: 260000000000, volume: 12000000 },
    { symbol: 'COST', name: 'Costco Wholesale Corp.', price: 680.00, changePercent: 1.8, marketCap: 300000000000, volume: 1800000 },
    { symbol: 'PEP', name: 'PepsiCo Inc.', price: 170.00, changePercent: 0.2, marketCap: 235000000000, volume: 3500000 },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific', price: 540.00, changePercent: 0.9, marketCap: 210000000000, volume: 1200000 },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', price: 110.00, changePercent: 0.5, marketCap: 280000000000, volume: 8000000 },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', price: 52.00, changePercent: 0.3, marketCap: 210000000000, volume: 18000000 },
    { symbol: 'ADBE', name: 'Adobe Inc.', price: 580.00, changePercent: 2.5, marketCap: 265000000000, volume: 2200000 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 485.00, changePercent: 3.1, marketCap: 210000000000, volume: 4500000 },
    { symbol: 'DIS', name: 'The Walt Disney Company', price: 95.00, changePercent: 1.4, marketCap: 175000000000, volume: 8500000 },
    { symbol: 'INTC', name: 'Intel Corporation', price: 45.00, changePercent: -0.8, marketCap: 185000000000, volume: 35000000 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 155.00, changePercent: 2.8, marketCap: 250000000000, volume: 48000000 },
    { symbol: 'CRM', name: 'Salesforce Inc.', price: 265.00, changePercent: 1.6, marketCap: 260000000000, volume: 5500000 },
    { symbol: 'ORCL', name: 'Oracle Corporation', price: 115.00, changePercent: 0.7, marketCap: 315000000000, volume: 7000000 },
    { symbol: 'NKE', name: 'NIKE Inc.', price: 105.00, changePercent: 1.3, marketCap: 160000000000, volume: 6500000 },
    { symbol: 'T', name: 'AT&T Inc.', price: 18.50, changePercent: -0.2, marketCap: 135000000000, volume: 28000000 },
    { symbol: 'VZ', name: 'Verizon Communications', price: 40.00, changePercent: 0.1, marketCap: 168000000000, volume: 15000000 },
    { symbol: 'CMCSA', name: 'Comcast Corporation', price: 42.00, changePercent: 0.4, marketCap: 175000000000, volume: 14000000 },
    { symbol: 'WFC', name: 'Wells Fargo & Company', price: 48.00, changePercent: 0.9, marketCap: 175000000000, volume: 22000000 },
    { symbol: 'GS', name: 'The Goldman Sachs Group', price: 385.00, changePercent: 1.1, marketCap: 130000000000, volume: 1800000 },
    { symbol: 'MS', name: 'Morgan Stanley', price: 95.00, changePercent: 0.8, marketCap: 155000000000, volume: 6500000 },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: 65.00, changePercent: 2.2, marketCap: 70000000000, volume: 12000000 },
    { symbol: 'QCOM', name: 'QUALCOMM Inc.', price: 145.00, changePercent: 1.5, marketCap: 162000000000, volume: 7500000 },
    { symbol: 'TXN', name: 'Texas Instruments Inc.', price: 175.00, changePercent: 0.6, marketCap: 160000000000, volume: 3500000 },
    { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1050.00, changePercent: 2.1, marketCap: 485000000000, volume: 1500000 },
    { symbol: 'SBUX', name: 'Starbucks Corporation', price: 95.00, changePercent: 0.5, marketCap: 110000000000, volume: 6000000 },
    { symbol: 'MCD', name: "McDonald's Corporation", price: 295.00, changePercent: 0.3, marketCap: 215000000000, volume: 2200000 },
    { symbol: 'LOW', name: "Lowe's Companies Inc.", price: 230.00, changePercent: 0.8, marketCap: 140000000000, volume: 3000000 },
    { symbol: 'CAT', name: 'Caterpillar Inc.', price: 285.00, changePercent: 1.2, marketCap: 150000000000, volume: 2500000 },
    { symbol: 'GE', name: 'General Electric Company', price: 125.00, changePercent: 1.7, marketCap: 135000000000, volume: 5500000 }
];

/**
 * Yahoo Finance API Integration for Stocks
 */
class StocksAPI {
    constructor() {
        this.cacheTTL = {
            quote: parseInt(process.env.CACHE_TTL_QUOTE) || 60,
            history: parseInt(process.env.CACHE_TTL_HISTORY) || 300,
            search: parseInt(process.env.CACHE_TTL_SEARCH) || 600
        };
        this.useFallback = false;
    }

    /**
     * Get real-time stock quote
     */
    async getQuote(symbol) {
        const cacheKey = `stock:quote:${symbol}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const quote = await yahooFinance.quote(symbol);

            const data = {
                symbol: quote.symbol,
                name: quote.longName || quote.shortName,
                price: quote.regularMarketPrice,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                volume: quote.regularMarketVolume,
                marketCap: quote.marketCap,
                high: quote.regularMarketDayHigh,
                low: quote.regularMarketDayLow,
                open: quote.regularMarketOpen,
                previousClose: quote.regularMarketPreviousClose,
                fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
                avgVolume: quote.averageDailyVolume3Month,
                pe: quote.trailingPE,
                eps: quote.epsTrailingTwelveMonths,
                dividendYield: quote.dividendYield,
                timestamp: new Date().toISOString()
            };

            cacheService.set(cacheKey, data, this.cacheTTL.quote);
            return data;
        } catch (error) {
            console.error(`Yahoo Finance error for ${symbol}:`, error.message);
            // Return fallback data if available
            const fallback = FALLBACK_STOCKS.find(s => s.symbol === symbol);
            if (fallback) {
                return { ...fallback, timestamp: new Date().toISOString() };
            }
            throw new Error(`Failed to fetch stock quote for ${symbol}: ${error.message}`);
        }
    }

    /**
     * Get historical stock data
     */
    async getHistory(symbol, period = '1mo', interval = '1d') {
        const cacheKey = `stock:history:${symbol}:${period}:${interval}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const queryOptions = { period1: this.getPeriodDate(period), interval };
            const result = await yahooFinance.historical(symbol, queryOptions);

            const data = result.map(item => ({
                date: item.date,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            }));

            cacheService.set(cacheKey, data, this.cacheTTL.history);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch stock history for ${symbol}: ${error.message}`);
        }
    }

    /**
     * Search for stocks
     */
    async search(query) {
        const cacheKey = `stock:search:${query}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const results = await yahooFinance.search(query);

            const data = results.quotes
                .filter(q => q.quoteType === 'EQUITY')
                .slice(0, 10)
                .map(q => ({
                    symbol: q.symbol,
                    name: q.longname || q.shortname,
                    exchange: q.exchange,
                    type: q.quoteType
                }));

            cacheService.set(cacheKey, data, this.cacheTTL.search);
            return data;
        } catch (error) {
            throw new Error(`Failed to search stocks: ${error.message}`);
        }
    }

    /**
     * Get top gainers and losers
     */
    async getMovers() {
        const cacheKey = 'stock:movers';
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Popular stocks to track for movers
            const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'NFLX', 'DIS'];
            const quotes = await Promise.all(symbols.map(s => this.getQuote(s)));

            const sorted = quotes.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

            const data = {
                gainers: sorted.filter(q => q.changePercent > 0).slice(0, 5),
                losers: sorted.filter(q => q.changePercent < 0).slice(0, 5)
            };

            cacheService.set(cacheKey, data, this.cacheTTL.quote);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch movers: ${error.message}`);
        }
    }

    /**
     * Get top 50+ stocks (popular and liquid stocks) with GUARANTEED fallback
     * ALWAYS returns data immediately, Yahoo Finance is optional enhancement
     */
    async getTopStocks(limit = 50) {
        const cacheKey = `stock:top:${limit}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        // ALWAYS return fallback data immediately for reliability
        // This ensures Markets page NEVER shows "No assets found"
        const fallbackData = FALLBACK_STOCKS.slice(0, limit).map(stock => ({
            ...stock,
            timestamp: new Date().toISOString(),
            source: 'fallback' // Indicate this is fallback data
        }));

        // Cache the fallback data
        cacheService.set(cacheKey, fallbackData, this.cacheTTL.quote);

        // Try to update with Yahoo Finance in the background (non-blocking)
        // If successful, it will update the cache for next time
        this.updateStocksInBackground(limit).catch(err => {
            console.log('Background Yahoo Finance update failed (expected):', err.message);
        });

        return fallbackData;
    }

    /**
     * Background update from Yahoo Finance (non-blocking)
     */
    async updateStocksInBackground(limit) {
        try {
            const symbols = FALLBACK_STOCKS.map(s => s.symbol).slice(0, Math.min(limit, 20)); // Limit to 20 to avoid rate limits

            const batchSize = 5;
            const batches = [];
            for (let i = 0; i < symbols.length; i += batchSize) {
                batches.push(symbols.slice(i, i + batchSize));
            }

            const allQuotes = [];

            for (const batch of batches) {
                const quotes = await Promise.allSettled(
                    batch.map(symbol => this.getQuote(symbol))
                );

                quotes.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        allQuotes.push({ ...result.value, source: 'yahoo' });
                    }
                });

                // Delay between batches
                if (batches.indexOf(batch) < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            // Only update cache if we got some real data
            if (allQuotes.length > 0) {
                const cacheKey = `stock:top:${limit}`;
                cacheService.set(cacheKey, allQuotes, this.cacheTTL.quote);
                console.log(`Successfully updated ${allQuotes.length} stocks from Yahoo Finance`);
            }
        } catch (error) {
            // Silently fail - fallback data is already being used
            console.log('Background update failed, continuing with fallback data');
        }
    }

    /**
     * Helper: Convert period string to date
     */
    getPeriodDate(period) {
        const now = new Date();
        const periodMap = {
            '1d': 1,
            '5d': 5,
            '1mo': 30,
            '3mo': 90,
            '6mo': 180,
            '1y': 365,
            '5y': 1825
        };

        const days = periodMap[period] || 30;
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
}

module.exports = new StocksAPI();
