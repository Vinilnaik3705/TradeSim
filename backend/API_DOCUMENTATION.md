# Trading Platform Backend API Documentation

## Overview

This backend provides RESTful API endpoints for accessing real-time and historical data for stocks, ETFs, and cryptocurrencies.

**Base URL**: `http://localhost:5000`

**Data Sources**:
- **Stocks & ETFs**: Yahoo Finance (via yahoo-finance2)
- **Cryptocurrency**: Binance Public API

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables as needed (defaults work for development)

### Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check

#### GET /health
Check server status

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2026-01-17T10:45:00.000Z",
  "uptime": 123.45
}
```

---

## Stock Endpoints

### GET /api/stocks/quote/:symbol
Get real-time stock quote

**Parameters**:
- `symbol` (path) - Stock symbol (e.g., AAPL, MSFT)

**Example**:
```bash
curl http://localhost:5000/api/stocks/quote/AAPL
```

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 185.50,
    "change": 2.30,
    "changePercent": 1.26,
    "volume": 52000000,
    "marketCap": 2850000000000,
    "high": 186.20,
    "low": 183.40,
    "open": 184.00,
    "previousClose": 183.20,
    "fiftyTwoWeekHigh": 199.62,
    "fiftyTwoWeekLow": 164.08,
    "timestamp": "2026-01-17T10:45:00.000Z"
  }
}
```

### GET /api/stocks/history/:symbol
Get historical stock data

**Parameters**:
- `symbol` (path) - Stock symbol
- `period` (query) - Time period: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `5y` (default: `1mo`)
- `interval` (query) - Data interval: `1m`, `5m`, `15m`, `1h`, `1d` (default: `1d`)

**Example**:
```bash
curl "http://localhost:5000/api/stocks/history/AAPL?period=1mo&interval=1d"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-17T00:00:00.000Z",
      "open": 184.00,
      "high": 186.20,
      "low": 183.40,
      "close": 185.50,
      "volume": 52000000
    }
  ]
}
```

### GET /api/stocks/search
Search for stocks

**Parameters**:
- `q` (query) - Search query

**Example**:
```bash
curl "http://localhost:5000/api/stocks/search?q=apple"
```

### GET /api/stocks/movers
Get top gainers and losers

**Example**:
```bash
curl http://localhost:5000/api/stocks/movers
```

**Response**:
```json
{
  "success": true,
  "data": {
    "gainers": [...],
    "losers": [...]
  }
}
```

### GET /api/stocks/batch
Get quotes for multiple stocks

**Parameters**:
- `symbols` (query) - Comma-separated list of symbols

**Example**:
```bash
curl "http://localhost:5000/api/stocks/batch?symbols=AAPL,MSFT,GOOGL"
```

---

## ETF Endpoints

### GET /api/etfs/quote/:symbol
Get real-time ETF quote (same format as stock quote)

### GET /api/etfs/history/:symbol
Get historical ETF data (same parameters as stock history)

### GET /api/etfs/search
Search for ETFs

**Parameters**:
- `q` (query) - Search query

### GET /api/etfs/popular
Get popular ETFs

**Example**:
```bash
curl http://localhost:5000/api/etfs/popular
```

### GET /api/etfs/holdings/:symbol
Get ETF holdings and sector weightings

**Example**:
```bash
curl http://localhost:5000/api/etfs/holdings/SPY
```

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "SPY",
    "holdings": [...],
    "sectorWeightings": [...],
    "category": "Large Blend",
    "family": "SPDR State Street Global Advisors"
  }
}
```

### GET /api/etfs/batch
Get quotes for multiple ETFs (same as stock batch)

---

## Cryptocurrency Endpoints

### GET /api/crypto/price/:symbol
Get real-time crypto price

**Parameters**:
- `symbol` (path) - Crypto symbol (e.g., BTC, ETH, BTCUSDT)

**Example**:
```bash
curl http://localhost:5000/api/crypto/price/BTC
```

**Response**:
```json
{
  "success": true,
  "data": {
    "symbol": "BTCUSDT",
    "baseAsset": "BTC",
    "price": 42500.50,
    "change": 850.30,
    "changePercent": 2.04,
    "volume": 25000.50,
    "quoteVolume": 1062500000,
    "high": 43000.00,
    "low": 41500.00,
    "open": 41650.20,
    "previousClose": 41650.20,
    "trades": 1250000,
    "timestamp": "2026-01-17T10:45:00.000Z"
  }
}
```

### GET /api/crypto/history/:symbol
Get historical crypto data

**Parameters**:
- `symbol` (path) - Crypto symbol
- `interval` (query) - Candlestick interval: `1m`, `5m`, `15m`, `1h`, `4h`, `1d`, `1w` (default: `1d`)
- `limit` (query) - Number of data points (default: 30, max: 1000)

**Example**:
```bash
curl "http://localhost:5000/api/crypto/history/BTC?interval=1d&limit=30"
```

### GET /api/crypto/trending
Get trending cryptocurrencies (top gainers and losers)

**Parameters**:
- `limit` (query) - Number of results per category (default: 10)

**Example**:
```bash
curl "http://localhost:5000/api/crypto/trending?limit=10"
```

### GET /api/crypto/market-cap
Get top cryptocurrencies by market cap

**Parameters**:
- `limit` (query) - Number of results (default: 20)

**Example**:
```bash
curl "http://localhost:5000/api/crypto/market-cap?limit=20"
```

### GET /api/crypto/search
Search for cryptocurrencies

**Parameters**:
- `q` (query) - Search query

**Example**:
```bash
curl "http://localhost:5000/api/crypto/search?q=bitcoin"
```

### GET /api/crypto/batch
Get prices for multiple cryptocurrencies

**Parameters**:
- `symbols` (query) - Comma-separated list of symbols

**Example**:
```bash
curl "http://localhost:5000/api/crypto/batch?symbols=BTC,ETH,BNB"
```

### GET /api/crypto/info/:symbol
Get exchange information for a crypto symbol

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `502` - External API Error

---

## Rate Limiting

- **Window**: 60 seconds
- **Max Requests**: 100 per window
- **Response Header**: `Retry-After` (seconds to wait)

When rate limited, you'll receive a `429` status with:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

---

## Caching

API responses are cached to improve performance and reduce external API calls:

- **Quote Data**: 60 seconds
- **Historical Data**: 300 seconds (5 minutes)
- **Search Results**: 600 seconds (10 minutes)

Cache TTL can be configured in `.env` file.

---

## CORS Configuration

The API allows requests from the frontend URL specified in `.env`:
```
FRONTEND_URL=http://localhost:5173
```

Update this value for production deployments.

---

## Development Tips

### Testing Endpoints

Use curl, Postman, or any HTTP client:

```bash
# Test health check
curl http://localhost:5000/health

# Test stock quote
curl http://localhost:5000/api/stocks/quote/AAPL

# Test crypto price
curl http://localhost:5000/api/crypto/price/BTC
```

### Monitoring Cache

Cache statistics are available via the cache service (for debugging):
```javascript
const cacheService = require('./services/cacheService');
console.log(cacheService.getStats());
```

---

## Architecture

```
backend/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── api-integration/         # API integration layer
│   ├── stocksAPI.js        # Yahoo Finance stocks
│   ├── etfsAPI.js          # Yahoo Finance ETFs
│   ├── cryptoAPI.js        # Binance crypto
│   └── dataModels.js       # Data normalization
├── routes/                  # Express routes
│   ├── stockRoutes.js
│   ├── etfRoutes.js
│   └── cryptoRoutes.js
├── services/                # Business logic
│   ├── cacheService.js     # Response caching
│   └── dataAggregator.js   # Multi-source aggregation
└── middleware/              # Express middleware
    ├── errorHandler.js     # Error handling
    └── rateLimiter.js      # Rate limiting
```

---

## Support

For issues or questions, please refer to:
- [Yahoo Finance2 Documentation](https://github.com/gadicc/node-yahoo-finance2)
- [Binance API Documentation](https://binance-docs.github.io/apidocs/spot/en/)
