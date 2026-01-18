import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import MarketToggle from '../components/ui/MarketToggle';
import { useMarket } from '../context/MarketContext';

// All holdings data
const allHoldings = [
    { name: 'Bitcoin', symbol: 'BTC', value: 45000, color: '#F59E0B', quantity: 1.0, avgPrice: 42000, type: 'crypto' },
    { name: 'Ethereum', symbol: 'ETH', value: 30000, color: '#3B82F6', quantity: 9.6, avgPrice: 2800, type: 'crypto' },
    { name: 'Tesla', symbol: 'TSLA', value: 15000, color: '#EF4444', quantity: 70, avgPrice: 180, type: 'stock' },
    { name: 'Apple', symbol: 'AAPL', value: 10000, color: '#10B981', quantity: 54, avgPrice: 150, type: 'stock' },
    { name: 'Solana', symbol: 'SOL', value: 8000, color: '#9333EA', quantity: 80, avgPrice: 95, type: 'crypto' },
    { name: 'Microsoft', symbol: 'MSFT', value: 12000, color: '#06B6D4', quantity: 30, avgPrice: 380, type: 'stock' },
];

export default function Portfolio() {
    const { marketType } = useMarket();

    // Filter holdings based on market type
    const portfolioData = allHoldings.filter(item =>
        marketType === 'crypto' ? item.type === 'crypto' : item.type === 'stock'
    );

    const totalValue = portfolioData.reduce((acc, item) => acc + item.value, 0);

    return (
        <MainLayout>
            <div className="space-y-6 sm:space-y-8">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">Portfolio</h2>
                    <p className="text-text-muted mt-1 text-sm">Manage your holdings and performance</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Summary Card - Unique Style */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-card to-secondary border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-[80px] -mr-10 -mt-10" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="p-2 sm:p-3 rounded-xl bg-tertiary text-text-main border border-border">
                                    <Wallet size={20} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-text-muted font-medium text-sm sm:text-base">Net Worth</span>
                            </div>
                            <h1 className="text-4xl font-bold text-text-main tracking-tight">${totalValue.toLocaleString()}</h1>
                            <div className="mt-4 sm:mt-6 flex items-center gap-3">
                                <span className="flex items-center text-success bg-success/10 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold">
                                    <ArrowUpRight size={14} className="sm:w-4 sm:h-4 mr-1" /> 15.4%
                                </span>
                                <span className="text-text-muted text-xs sm:text-sm">All Time</span>
                            </div>
                        </div>
                    </div>

                    {/* Distribution Chart */}
                    <BentoCard className="lg:col-span-2" title="Asset Distribution" icon={Briefcase}>
                        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                            <div className="w-full lg:w-1/2 h-[220px] sm:h-[260px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={portfolioData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {portfolioData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                            formatter={(value) => `$${value.toLocaleString()}`}
                                            itemStyle={{ color: 'var(--color-text)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-text-muted text-xs uppercase tracking-widest">Assets</span>
                                    <span className="text-2xl font-bold text-text-main">{portfolioData.length}</span>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                                {portfolioData.map((item) => (
                                    <div key={item.name} className="bg-tertiary rounded-xl p-3 border border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-base font-medium text-text-main">{item.name}</span>
                                        </div>
                                        <p className="font-bold text-base text-text-main">${item.value.toLocaleString()}</p>
                                        <p className="text-xs text-text-muted mr-2">{((item.value / totalValue) * 100).toFixed(1)}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Holdings Table */}
                <BentoCard icon={Briefcase}>
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                        <h3 className="text-xl font-bold text-text-main">Your Holdings</h3>
                        <MarketToggle />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                                <tr>
                                    <th className="text-left py-4 px-4 font-medium">Asset</th>
                                    <th className="text-right py-4 px-4 font-medium">Balance</th>
                                    <th className="text-right py-4 px-4 font-medium">Avg. Price</th>
                                    <th className="text-right py-4 px-4 font-medium">Current Value</th>
                                    <th className="text-right py-4 px-4 font-medium">P/L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {portfolioData.filter(i => i.name !== 'Cash').map((item, idx) => {
                                    const currentPrice = item.value / item.quantity;
                                    const pl = (currentPrice - item.avgPrice) * item.quantity;
                                    const plPercent = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;

                                    // Dummy state for expansion (using internal state component or just keeping it static for now, 
                                    // but let's make it interactive by converting the row to a component if possible, 
                                    // OR just adding a details row that is always visible for 'Pro' look or creating a toggle.
                                    // To keep it simple in one file without too much refactor, I'll use a local component or just a simple details expansion logic if I can.
                                    // Actually, let's just make the row clickable to toggle specific 'expanded' state.
                                    // Since I can't easily add complex state here without refactoring to sub-component, I will add a 'Recent Trades' preview line below each row 
                                    // or just link to the Trade page. The user asked for "Expandable rows".
                                    // Let's create a sub-component `PortfolioRow` to handle state.
                                    return <PortfolioRow key={idx} item={item} pl={pl} plPercent={plPercent} />;
                                })}
                            </tbody>
                        </table>
                    </div>
                </BentoCard>
            </div>
        </MainLayout>
    );
}

const PortfolioRow = ({ item, pl, plPercent }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <>
            <tr
                onClick={() => setExpanded(!expanded)}
                className={`transition-colors cursor-pointer ${expanded ? 'bg-tertiary' : 'hover:bg-tertiary'}`}
            >
                <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: item.color }}>
                            {item.name[0]}
                        </div>
                        <div>
                            <span className="font-bold text-base text-text-main block">{item.name}</span>
                            {expanded && <span className="text-xs text-accent">Hide History</span>}
                        </div>
                    </div>
                </td>
                <td className="text-right py-4 px-4 text-text-main text-base">{item.quantity}</td>
                <td className="text-right py-4 px-4 text-text-muted text-base">${item.avgPrice.toLocaleString()}</td>
                <td className="text-right py-4 px-4 font-bold text-base text-text-main">${item.value.toLocaleString()}</td>
                <td className={`text-right py-4 px-4 ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                    <div className="flex flex-col items-end">
                        <span className="font-bold">{pl >= 0 ? '+' : ''}${pl.toLocaleString()}</span>
                        <span className="text-xs opacity-70 bg-tertiary px-1.5 rounded">{plPercent.toFixed(2)}%</span>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-tertiary">
                    <td colSpan={5} className="py-4 px-4">
                        <div className="bg-card rounded-xl p-4 border border-border">
                            <h4 className="text-xs font-bold text-text-muted uppercase mb-3">Recent Trade History</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-success font-bold">Buy</span>
                                    <span className="text-text-muted">0.5 {item.name} @ $41,000</span>
                                    <span className="text-text-muted">2 days ago</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-success font-bold">Buy</span>
                                    <span className="text-text-muted">0.2 {item.name} @ $39,500</span>
                                    <span className="text-text-muted">5 days ago</span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};
