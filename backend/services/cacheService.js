const NodeCache = require('node-cache');

/**
 * Cache service for storing API responses
 */
class CacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: 60, // Default TTL: 60 seconds
            checkperiod: 120, // Check for expired keys every 2 minutes
            useClones: false // Better performance
        });
    }

    /**
     * Get value from cache
     */
    get(key) {
        return this.cache.get(key);
    }

    /**
     * Set value in cache with optional TTL
     */
    set(key, value, ttl = null) {
        if (ttl) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }

    /**
     * Delete key from cache
     */
    del(key) {
        return this.cache.del(key);
    }

    /**
     * Clear all cache
     */
    flush() {
        return this.cache.flushAll();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return this.cache.getStats();
    }

    /**
     * Check if key exists
     */
    has(key) {
        return this.cache.has(key);
    }
}

// Export singleton instance
module.exports = new CacheService();
