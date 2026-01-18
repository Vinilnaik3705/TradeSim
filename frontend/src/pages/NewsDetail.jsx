import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from 'lucide-react';

// Sample news data - in production, this would come from an API
const newsArticles = {
    '1': {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cut in Q2 2026',
        source: 'Reuters',
        author: 'Sarah Johnson',
        date: '2026-01-18',
        time: '2 hours ago',
        category: 'Economy',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        content: `
The Federal Reserve has signaled a potential shift in monetary policy, with officials hinting at a possible interest rate cut in the second quarter of 2026. This marks a significant change from the hawkish stance maintained throughout 2025.

## Key Takeaways

Federal Reserve Chair Jerome Powell indicated during Wednesday's press conference that the central bank is closely monitoring economic indicators and remains "data-dependent" in its approach to monetary policy.

The potential rate cut comes as inflation shows signs of cooling, with the Consumer Price Index (CPI) falling to 2.4% year-over-year, approaching the Fed's 2% target.

## Market Implications

Financial markets reacted positively to the news, with the S&P 500 gaining 1.8% and the Nasdaq Composite rising 2.3% in afternoon trading. Bond yields fell sharply, with the 10-year Treasury yield dropping to 3.85%.

Analysts suggest that a rate cut could provide relief to borrowers and potentially stimulate economic growth, though some economists warn against premature easing.

## What This Means for Investors

- **Equities**: Growth stocks, particularly in the technology sector, are likely to benefit from lower borrowing costs
- **Bonds**: Fixed-income securities may see increased demand as yields stabilize
- **Real Estate**: Lower mortgage rates could boost housing market activity
- **Dollar**: The U.S. dollar may weaken against major currencies

The Fed's next policy meeting is scheduled for March 2026, where officials will review updated economic projections and provide further guidance on the path forward.
        `,
        relatedStocks: ['SPY', 'QQQ', 'TLT', 'DXY']
    },
    '2': {
        id: '2',
        title: 'Tech Stocks Rally as AI Sector Shows Strong Growth',
        source: 'Bloomberg',
        author: 'Michael Chen',
        date: '2026-01-18',
        time: '4 hours ago',
        category: 'Markets',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        content: `
Technology stocks surged today as artificial intelligence companies reported stronger-than-expected quarterly earnings, reigniting investor enthusiasm for the sector.

## AI Boom Continues

Major AI-focused companies saw significant gains, with several reaching new all-time highs. The rally was led by semiconductor manufacturers and cloud computing providers that power AI infrastructure.

NVIDIA, Microsoft, and Google parent Alphabet all posted gains exceeding 5%, while smaller AI startups in the public markets saw even more dramatic increases.

## Earnings Highlights

- Cloud computing revenue up 45% year-over-year
- AI chip demand exceeding supply by significant margins
- Enterprise AI adoption accelerating across industries
- Consumer AI applications gaining mainstream traction

## Analyst Perspectives

"We're still in the early innings of the AI revolution," said tech analyst Jennifer Martinez. "The infrastructure build-out alone represents a multi-trillion dollar opportunity over the next decade."

However, some analysts caution that valuations are becoming stretched, with price-to-earnings ratios for some AI stocks exceeding historical norms.

## Investment Opportunities

Investors looking to capitalize on the AI trend have several options:

1. **Direct AI plays**: Companies developing AI models and applications
2. **Infrastructure providers**: Semiconductor and cloud computing companies
3. **AI beneficiaries**: Traditional companies adopting AI to improve operations
4. **ETFs**: Diversified exposure through AI-focused exchange-traded funds

The sector's momentum shows no signs of slowing, with analysts projecting continued strong growth through 2026 and beyond.
        `,
        relatedStocks: ['NVDA', 'MSFT', 'GOOGL', 'AMD']
    },
    '3': {
        id: '3',
        title: 'Oil Prices Surge 5% on Middle East Supply Concerns',
        source: 'CNBC',
        author: 'David Williams',
        date: '2026-01-18',
        time: '6 hours ago',
        category: 'Commodities',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        content: `
Crude oil prices jumped more than 5% today following reports of potential supply disruptions in the Middle East, raising concerns about global energy security.

## Supply Concerns

West Texas Intermediate (WTI) crude rose to $78.50 per barrel, while Brent crude climbed to $82.30, marking the highest levels in three months.

The price surge comes amid geopolitical tensions in key oil-producing regions and unexpected production cuts from OPEC+ members.

## Market Impact

Energy stocks rallied across the board, with major oil companies seeing significant gains:

- ExxonMobil: +4.2%
- Chevron: +3.8%
- ConocoPhillips: +5.1%
- Occidental Petroleum: +6.3%

## Economic Implications

Higher oil prices could have far-reaching effects on the global economy:

**Inflation Concerns**: Rising energy costs may put upward pressure on inflation, potentially complicating the Federal Reserve's rate-cutting plans.

**Consumer Impact**: Gasoline prices are expected to rise in the coming weeks, affecting household budgets and consumer spending.

**Transportation Costs**: Higher fuel costs will increase shipping expenses, potentially leading to higher prices for goods.

## Analyst Outlook

Energy analysts are divided on whether the price surge will be sustained:

"We could see prices stabilize in the $75-80 range if supply concerns ease," said commodity strategist Robert Thompson. "However, any escalation in geopolitical tensions could push prices significantly higher."

Traders are closely monitoring developments in the region and OPEC+ production decisions for further direction.
        `,
        relatedStocks: ['XOM', 'CVX', 'COP', 'OXY', 'USO']
    },
    '4': {
        id: '4',
        title: 'Bitcoin Breaks $95,000 as Institutional Adoption Grows',
        source: 'CoinDesk',
        author: 'Emily Rodriguez',
        date: '2026-01-18',
        time: '8 hours ago',
        category: 'Crypto',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
        content: `
Bitcoin surged past $95,000 for the first time, driven by increasing institutional adoption and growing acceptance of cryptocurrency as a legitimate asset class.

## Historic Milestone

The world's largest cryptocurrency reached an all-time high of $95,450 before settling around $95,100, representing a 15% gain over the past week.

The rally comes as major financial institutions announce expanded crypto offerings and several countries move toward clearer regulatory frameworks.

## Institutional Momentum

Several factors are driving institutional interest:

- **ETF Inflows**: Bitcoin ETFs saw record inflows of $2.5 billion this week
- **Corporate Treasuries**: More companies adding Bitcoin to balance sheets
- **Banking Integration**: Major banks launching crypto custody services
- **Regulatory Clarity**: Improved regulatory environment in key markets

## Market Analysis

"We're seeing a fundamental shift in how institutions view Bitcoin," said crypto analyst Mark Stevens. "It's no longer a speculative asset but increasingly viewed as digital gold and a portfolio diversifier."

Trading volumes across major exchanges reached $85 billion in 24 hours, indicating strong market participation and liquidity.

## Altcoin Performance

The broader cryptocurrency market also benefited from Bitcoin's rally:

- Ethereum: +8.2% to $3,450
- Solana: +12.5% to $145
- Cardano: +9.8% to $1.05
- Polkadot: +7.3% to $9.20

## Looking Ahead

Analysts are setting new price targets, with some predicting Bitcoin could reach $100,000 by mid-2026 if current trends continue.

However, volatility remains a concern, and investors are advised to maintain appropriate risk management strategies when investing in cryptocurrencies.
        `,
        relatedStocks: ['BTC', 'ETH', 'COIN', 'MSTR']
    },
    '5': {
        id: '5',
        title: 'European Markets Close Higher on Strong Economic Data',
        source: 'Financial Times',
        author: 'Thomas Anderson',
        date: '2026-01-18',
        time: '10 hours ago',
        category: 'Global',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
        content: `
European stock markets closed sharply higher today following the release of stronger-than-expected economic data, boosting investor confidence in the region's recovery.

## Market Performance

Major European indices posted solid gains:

- FTSE 100 (London): +1.4%
- DAX (Frankfurt): +1.8%
- CAC 40 (Paris): +1.6%
- IBEX 35 (Madrid): +2.1%

## Economic Indicators

The positive market reaction came after several encouraging data releases:

**Manufacturing PMI**: Rose to 52.3, indicating expansion in the manufacturing sector for the first time in six months.

**Services PMI**: Climbed to 54.1, showing robust growth in the services sector.

**Unemployment**: Fell to 6.2%, the lowest level since early 2023.

**Consumer Confidence**: Improved to 98.5, suggesting increased optimism among European consumers.

## Sector Performance

Financial and industrial stocks led the gains:

- Banking sector: +2.5%
- Industrials: +2.1%
- Technology: +1.9%
- Consumer goods: +1.6%

## ECB Policy Outlook

The strong economic data may influence European Central Bank policy decisions. Analysts suggest the ECB might delay rate cuts if economic momentum continues.

"The data suggests the European economy is more resilient than many feared," said economist Dr. Maria Schmidt. "This could give the ECB more flexibility in its policy approach."

## Currency Markets

The euro strengthened against major currencies:

- EUR/USD: +0.6% to 1.0950
- EUR/GBP: +0.4% to 0.8520
- EUR/JPY: +0.8% to 162.30

## Investment Implications

The improving European economic outlook presents opportunities for investors:

1. **European equities**: Attractive valuations compared to U.S. markets
2. **Euro exposure**: Potential currency appreciation
3. **Sector rotation**: Cyclical stocks may outperform
4. **Fixed income**: European bonds offering competitive yields

Market participants will be watching upcoming inflation data and ECB communications for further direction.
        `,
        relatedStocks: ['EWU', 'EWG', 'EWQ', 'FEZ']
    },
    '6': {
        id: '6',
        title: 'Tesla Announces Record Q4 Deliveries, Stock Up 8%',
        source: 'MarketWatch',
        author: 'Lisa Martinez',
        date: '2026-01-18',
        time: '12 hours ago',
        category: 'Stocks',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        content: `
Tesla shares surged 8% in pre-market trading after the electric vehicle manufacturer announced record-breaking fourth-quarter deliveries, exceeding analyst expectations.

## Delivery Numbers

Tesla delivered 485,000 vehicles in Q4 2026, surpassing the consensus estimate of 450,000 units. Full-year deliveries reached 1.85 million vehicles, representing 35% year-over-year growth.

The strong performance was driven by increased production capacity and robust demand across all major markets.

## Model Breakdown

- Model 3/Y: 425,000 units
- Model S/X: 45,000 units
- Cybertruck: 15,000 units

The Cybertruck, despite production challenges, is ramping up faster than anticipated and contributing meaningfully to overall deliveries.

## Financial Implications

Analysts are raising price targets following the delivery report:

- Morgan Stanley: $320 (from $285)
- Goldman Sachs: $335 (from $300)
- JPMorgan: $310 (from $275)

The consensus 12-month price target now stands at $315, implying 12% upside from current levels.

## Production Expansion

Tesla continues to expand manufacturing capacity:

- **Gigafactory Texas**: Running at full capacity
- **Gigafactory Berlin**: Ramping to 500,000 annual units
- **Gigafactory Shanghai**: Expanding to 1 million annual units
- **Gigafactory Mexico**: Construction progressing on schedule

## Competitive Landscape

Despite increasing competition from traditional automakers and new EV startups, Tesla maintains its market leadership:

- Global EV market share: 18%
- Premium EV segment share: 35%
- Battery technology advantage: 2-3 years ahead of competitors

## Challenges Ahead

While the delivery numbers are impressive, Tesla faces several challenges:

1. **Price competition**: Ongoing price wars in key markets
2. **Margin pressure**: Discounts impacting profitability
3. **Regulatory scrutiny**: Autopilot safety investigations
4. **Supply chain**: Continued semiconductor constraints

## Analyst Commentary

"Tesla's execution continues to impress," said auto analyst James Peterson. "The company is demonstrating that it can scale production while maintaining quality and meeting demand across multiple markets."

Investors will be watching the upcoming earnings call for guidance on margins, pricing strategy, and 2026 delivery targets.
        `,
        relatedStocks: ['TSLA', 'GM', 'F', 'RIVN']
    }
};

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = newsArticles[id];

    if (!article) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
                        <p className="text-slate-400 mb-4">The news article you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const categoryColors = {
        'Economy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Markets': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Commodities': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Crypto': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'Global': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'Stocks': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Article Header */}
                <div className="bg-secondary/30 rounded-2xl border border-slate-700/50 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${categoryColors[article.category]}`}>
                            {article.category}
                        </span>
                        <span className="text-slate-500 text-sm">{article.time}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6">{article.title}</h1>

                    <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag size={16} />
                            <span>{article.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="bg-secondary/30 rounded-2xl border border-slate-700/50 p-8">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {article.content.split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('##')) {
                                return (
                                    <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                                        {paragraph.replace('## ', '')}
                                    </h2>
                                );
                            } else if (paragraph.startsWith('-')) {
                                const items = paragraph.split('\n-').filter(item => item.trim());
                                return (
                                    <ul key={index} className="list-disc list-inside space-y-2 text-slate-300 my-4">
                                        {items.map((item, i) => (
                                            <li key={i}>{item.replace('- ', '').trim()}</li>
                                        ))}
                                    </ul>
                                );
                            } else if (paragraph.match(/^\d+\./)) {
                                const items = paragraph.split(/\n\d+\./).filter(item => item.trim());
                                return (
                                    <ol key={index} className="list-decimal list-inside space-y-2 text-slate-300 my-4">
                                        {items.map((item, i) => (
                                            <li key={i}>{item.replace(/^\d+\./, '').trim()}</li>
                                        ))}
                                    </ol>
                                );
                            } else if (paragraph.startsWith('**')) {
                                const [title, ...rest] = paragraph.split(':');
                                return (
                                    <p key={index} className="text-slate-300 leading-relaxed my-4">
                                        <strong className="text-white">{title.replace(/\*\*/g, '')}:</strong>
                                        {rest.join(':')}
                                    </p>
                                );
                            } else if (paragraph.trim()) {
                                return (
                                    <p key={index} className="text-slate-300 leading-relaxed my-4">
                                        {paragraph}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                {/* Related Stocks */}
                {article.relatedStocks && (
                    <div className="bg-secondary/30 rounded-2xl border border-slate-700/50 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Related Stocks</h3>
                        <div className="flex flex-wrap gap-3">
                            {article.relatedStocks.map(stock => (
                                <button
                                    key={stock}
                                    onClick={() => navigate(`/trade/${stock}`)}
                                    className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white hover:bg-slate-700/50 hover:border-accent transition-all font-bold"
                                >
                                    {stock}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
