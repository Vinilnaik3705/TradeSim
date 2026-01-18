const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser({
    customFields: {
        item: ['media:content', 'media:thumbnail']
    }
});

// RSS Feed sources for financial news
const RSS_FEEDS = {
    all: [
        'https://feeds.bloomberg.com/markets/news.rss',
        'https://www.cnbc.com/id/100003114/device/rss/rss.html', // Top News
        'https://www.marketwatch.com/rss/topstories',
        'https://www.coindesk.com/arc/outboundfeeds/rss/',
        'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664' // Economy
    ],
    stocks: [
        'https://feeds.bloomberg.com/markets/news.rss',
        'https://www.marketwatch.com/rss/topstories',
        'https://www.cnbc.com/id/100727362/device/rss/rss.html' // Stocks
    ],
    crypto: [
        'https://www.coindesk.com/arc/outboundfeeds/rss/',
        'https://cointelegraph.com/rss',
        'https://decrypt.co/feed'
    ],
    economy: [
        'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
        'https://feeds.bloomberg.com/economics/news.rss'
    ]
};

/**
 * Fetch financial news from RSS feeds
 * @param {string} category - 'all', 'stocks', 'crypto', 'economy'
 * @param {number} limit - Number of articles to fetch
 */
async function getFinancialNews(category = 'all', limit = 20) {
    try {
        const feeds = RSS_FEEDS[category] || RSS_FEEDS.all;
        const allArticles = [];

        // Fetch from multiple RSS feeds in parallel
        const feedPromises = feeds.map(async (feedUrl) => {
            try {
                const feed = await parser.parseURL(feedUrl);
                return feed.items.map(item => ({
                    id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: item.title || 'Untitled',
                    description: item.contentSnippet || item.content || item.summary || '',
                    content: item.content || item.contentSnippet || item.summary || '',
                    source: feed.title || extractDomain(feedUrl),
                    author: item.creator || item.author || 'Staff Writer',
                    url: item.link || '#',
                    image: item.enclosure?.url || item['media:content']?.$ || null,
                    publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
                    category: categorizeArticle(item.title + ' ' + (item.contentSnippet || ''))
                }));
            } catch (error) {
                console.error(`Failed to fetch RSS feed ${feedUrl}:`, error.message);
                return [];
            }
        });

        const feedResults = await Promise.all(feedPromises);
        feedResults.forEach(articles => allArticles.push(...articles));

        // Sort by publish date (newest first)
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Return limited results
        return {
            success: true,
            data: allArticles.slice(0, limit),
            totalResults: allArticles.length,
            source: 'RSS Feeds'
        };
    } catch (error) {
        console.error('RSS Feed Error:', error.message);
        return getFallbackNews();
    }
}

/**
 * Extract domain name from URL
 */
function extractDomain(url) {
    try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '').replace('.com', '').toUpperCase();
    } catch {
        return 'News';
    }
}

/**
 * Categorize article based on content
 */
function categorizeArticle(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('bitcoin') || lowerText.includes('crypto') || lowerText.includes('ethereum') || lowerText.includes('blockchain')) {
        return 'Crypto';
    } else if (lowerText.includes('stock') || lowerText.includes('nasdaq') || lowerText.includes('s&p') || lowerText.includes('dow')) {
        return 'Stocks';
    } else if (lowerText.includes('oil') || lowerText.includes('gold') || lowerText.includes('commodity') || lowerText.includes('crude')) {
        return 'Commodities';
    } else if (lowerText.includes('fed') || lowerText.includes('inflation') || lowerText.includes('gdp') || lowerText.includes('economy')) {
        return 'Economy';
    } else if (lowerText.includes('europe') || lowerText.includes('asia') || lowerText.includes('global') || lowerText.includes('china')) {
        return 'Global';
    } else {
        return 'Markets';
    }
}

/**
 * Fallback news when RSS feeds are unavailable
 */
function getFallbackNews() {
    const now = new Date();
    return {
        success: true,
        data: [
            {
                id: 'fallback-1',
                title: 'Markets Update: Trading Activity Remains Strong',
                description: 'Financial markets continue to show resilience amid economic uncertainty.',
                content: 'Financial markets continue to show resilience amid economic uncertainty. Investors are closely monitoring central bank policies and corporate earnings reports.',
                source: 'Market News',
                author: 'Editorial Team',
                url: '#',
                image: null,
                publishedAt: now.toISOString(),
                category: 'Markets'
            },
            {
                id: 'fallback-2',
                title: 'Cryptocurrency Market Analysis',
                description: 'Digital assets show mixed performance as regulatory clarity improves.',
                content: 'Digital assets show mixed performance as regulatory clarity improves across major markets.',
                source: 'Crypto News',
                author: 'Editorial Team',
                url: '#',
                image: null,
                publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                category: 'Crypto'
            },
            {
                id: 'fallback-3',
                title: 'Economic Indicators Point to Steady Growth',
                description: 'Latest data suggests continued economic expansion.',
                content: 'Latest economic data suggests continued expansion with moderate inflation.',
                source: 'Economic Times',
                author: 'Editorial Team',
                url: '#',
                image: null,
                publishedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
                category: 'Economy'
            }
        ],
        totalResults: 3,
        fallback: true
    };
}

module.exports = {
    getFinancialNews
};
