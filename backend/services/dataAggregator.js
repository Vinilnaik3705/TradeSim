const stocksAPI = require('../api-integration/stocksAPI');
const etfsAPI = require('../api-integration/etfsAPI');
const cryptoAPI = require('../api-integration/cryptoAPI');
const { normalizeStockData, normalizeETFData, normalizeCryptoData } = require('../api-integration/dataModels');

/**
 * Data aggregator service for combining multiple data sources
 */
class DataAggregator {
    /**
     * Get mixed portfolio data (stocks, ETFs, crypto)
     */
    async getPortfolioData(symbols) {
        const results = await Promise.allSettled(
            symbols.map(async (item) => {
                const { symbol, type } = item;

                try {
                    switch (type.toLowerCase()) {
                        case 'stock':
                            const stockData = await stocksAPI.getQuote(symbol);
                            return normalizeStockData(stockData);

                        case 'etf':
                            const etfData = await etfsAPI.getQuote(symbol);
                            return normalizeETFData(etfData);

                        case 'crypto':
                            const cryptoData = await cryptoAPI.getPrice(symbol);
                            return normalizeCryptoData(cryptoData);

                        default:
                            throw new Error(`Unknown asset type: ${type}`);
                    }
                } catch (error) {
                    return {
                        symbol,
                        type,
                        error: error.message
                    };
                }
            })
        );

        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return {
                    symbol: symbols[index].symbol,
                    type: symbols[index].type,
                    error: result.reason.message
                };
            }
        });
    }

    /**
     * Get market overview (top stocks, ETFs, crypto)
     */
    async getMarketOverview() {
        try {
            const [movers, popularETFs, topCrypto] = await Promise.all([
                stocksAPI.getMovers(),
                etfsAPI.getPopular().then(etfs => etfs.slice(0, 5)),
                cryptoAPI.getTopByMarketCap(5)
            ]);

            return {
                stocks: {
                    gainers: movers.gainers,
                    losers: movers.losers
                },
                etfs: popularETFs,
                crypto: topCrypto,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Failed to fetch market overview: ${error.message}`);
        }
    }

    /**
     * Search across all asset types
     */
    async searchAll(query) {
        const [stocks, etfs, crypto] = await Promise.allSettled([
            stocksAPI.search(query),
            etfsAPI.search(query),
            cryptoAPI.search(query)
        ]);

        return {
            stocks: stocks.status === 'fulfilled' ? stocks.value : [],
            etfs: etfs.status === 'fulfilled' ? etfs.value : [],
            crypto: crypto.status === 'fulfilled' ? crypto.value : []
        };
    }

    /**
     * Calculate portfolio statistics
     */
    calculatePortfolioStats(portfolioData) {
        const validData = portfolioData.filter(item => !item.error);

        if (validData.length === 0) {
            return {
                totalValue: 0,
                totalChange: 0,
                totalChangePercent: 0,
                assetCount: 0
            };
        }

        const totalValue = validData.reduce((sum, item) => sum + (item.price || 0), 0);
        const totalChange = validData.reduce((sum, item) => sum + (item.change || 0), 0);
        const avgChangePercent = validData.reduce((sum, item) => sum + (item.changePercent || 0), 0) / validData.length;

        return {
            totalValue,
            totalChange,
            totalChangePercent: avgChangePercent,
            assetCount: validData.length,
            byType: {
                stocks: validData.filter(i => i.type === 'stock').length,
                etfs: validData.filter(i => i.type === 'etf').length,
                crypto: validData.filter(i => i.type === 'crypto').length
            }
        };
    }
}

module.exports = new DataAggregator();
