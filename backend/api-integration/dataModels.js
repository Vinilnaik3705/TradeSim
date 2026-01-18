/**
 * Unified data models for stocks, ETFs, and crypto
 */

/**
 * Normalize stock data to common format
 */
function normalizeStockData(data) {
    return {
        type: 'stock',
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        marketCap: data.marketCap,
        high: data.high,
        low: data.low,
        open: data.open,
        previousClose: data.previousClose,
        timestamp: data.timestamp
    };
}

/**
 * Normalize ETF data to common format
 */
function normalizeETFData(data) {
    return {
        type: 'etf',
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        previousClose: data.previousClose,
        timestamp: data.timestamp
    };
}

/**
 * Normalize crypto data to common format
 */
function normalizeCryptoData(data) {
    return {
        type: 'crypto',
        symbol: data.symbol,
        name: data.baseAsset,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        previousClose: data.previousClose,
        timestamp: data.timestamp
    };
}

/**
 * Normalize historical data to common format
 */
function normalizeHistoricalData(data) {
    return data.map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
    }));
}

module.exports = {
    normalizeStockData,
    normalizeETFData,
    normalizeCryptoData,
    normalizeHistoricalData
};
