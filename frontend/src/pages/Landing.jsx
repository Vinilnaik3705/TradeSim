import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Search, Menu, X, ArrowUpRight, ArrowRight, TrendingUp, TrendingDown,
    Github, Linkedin, Twitter, Mail, Phone, LineChart, Layers, Zap,
    Shield, Wallet, Grid2X2,
} from 'lucide-react';
import {
    Reveal, Stagger, StaggerItem, TextReveal, AnimatedCounter,
    Magnetic, TiltCard, Marquee, GlowOrb, HoverLift,
} from '../components/motion';
import proChart from '../assets/pro-chart.png';

// Demo Data for Markets
const DEMO_MARKETS = [
    { symbol: 'BTC/USD', price: '64,231.50', change: '+2.4%', up: true },
    { symbol: 'ETH/USD', price: '3,452.10', change: '+1.8%', up: true },
    { symbol: 'TSLA', price: '245.30', change: '-0.5%', up: false },
    { symbol: 'AAPL', price: '182.90', change: '+0.2%', up: true },
    { symbol: 'NVDA', price: '920.00', change: '+3.1%', up: true },
    { symbol: 'SOL/USD', price: '148.62', change: '+4.7%', up: true },
    { symbol: 'XRP/USD', price: '0.5241', change: '-1.2%', up: false },
    { symbol: 'MSFT', price: '428.15', change: '+0.9%', up: true },
];

const FEATURES = [
    { icon: LineChart, title: 'Advanced Charting', desc: 'Candlesticks, drawing tools and indicators powered by a professional-grade engine.' },
    { icon: Zap, title: 'Real-Time Data', desc: 'Live streaming prices across crypto and stock markets with instant updates.' },
    { icon: Wallet, title: 'Paper Trading', desc: 'Trade with a virtual wallet. Learn the market with zero real-money risk.' },
    { icon: Grid2X2, title: 'Market Heatmaps', desc: 'Visualize the entire market at a glance with dynamic sector heatmaps.' },
    { icon: Layers, title: 'Portfolio Analytics', desc: 'Track P&L, allocation, and performance across every position you hold.' },
    { icon: Shield, title: 'Secure Accounts', desc: 'Supabase-backed authentication with email, Google, and GitHub sign-in.' },
];

const STATS = [
    { value: 200, suffix: '+', label: 'Tradable Assets' },
    { value: 100, suffix: 'K', label: 'Virtual Starting Capital' },
    { value: 24, suffix: '/7', label: 'Live Market Data' },
    { value: 0, suffix: '%', label: 'Real-Money Risk' },
];

const Landing = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Scroll Handler for Navbar Styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth Scroll to Section
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const NavbarLink = ({ to, label, isScrollId }) => (
        <button
            onClick={() => isScrollId ? scrollToSection(to) : null}
            className="kx-underline text-[rgba(255,255,255,0.55)] hover:text-white font-medium transition-colors cursor-pointer"
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-primary text-white font-sans selection:bg-accent selection:text-black relative overflow-x-hidden">

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-primary/85 backdrop-blur-xl border-b border-white/[0.06] py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group">
                            <img src="/logo.png" alt="Kryonex Logo" className="w-9 h-9 object-contain transition-transform duration-500 group-hover:rotate-[15deg]" />
                            <span className="text-2xl font-extrabold tracking-tight">Kryonex</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                            <NavbarLink to="products" label="Products" isScrollId={true} />
                            <NavbarLink to="features" label="Features" isScrollId={true} />
                            <NavbarLink to="markets" label="Markets" isScrollId={true} />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center kx-glass rounded-full px-4 py-2 text-[rgba(255,255,255,0.45)] gap-2 hover:border-accent/30 transition-all cursor-text w-64 group">
                            <Search size={16} className="group-hover:text-accent transition-colors" />
                            <span className="text-sm">Search markets</span>
                            <span className="ml-auto text-xs bg-white/[0.06] px-2 py-0.5 rounded text-[rgba(255,255,255,0.35)]">Ctrl+K</span>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <Link to="/dashboard" className="kx-shimmer bg-accent hover:bg-sky-300 text-black px-6 py-2 rounded-full font-bold transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link to="/login" className="kx-underline text-[rgba(255,255,255,0.55)] hover:text-white font-medium transition-colors">
                                    Log in
                                </Link>
                            )}
                            <Magnetic>
                                <Link to="/register" className="kx-shimmer inline-block bg-accent hover:bg-sky-300 text-black px-6 py-2 rounded-full font-bold transition-all shadow-[0_0_24px_rgba(56,189,248,0.35)]">
                                    Get started
                                </Link>
                            </Magnetic>
                        </div>

                        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-primary/95 backdrop-blur-xl border-y border-white/[0.06] p-6 flex flex-col gap-6 shadow-2xl">
                        <div className="flex flex-col gap-4">
                            <NavbarLink to="products" label="Products" isScrollId={true} />
                            <NavbarLink to="features" label="Features" isScrollId={true} />
                            <NavbarLink to="markets" label="Markets" isScrollId={true} />
                        </div>
                        <div className="h-px bg-white/[0.06]" />
                        <div className="flex flex-col gap-4">
                            {user ? (
                                <Link to="/dashboard" className="text-center bg-accent text-black px-6 py-3 rounded-xl font-bold">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-center text-[rgba(255,255,255,0.55)] hover:text-white font-medium py-2">
                                        Log in
                                    </Link>
                                    <Link to="/register" className="text-center bg-accent text-black px-6 py-3 rounded-xl font-bold hover:bg-sky-300">
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                {/* Animated grid + glow background */}
                <div className="absolute inset-0 z-0 kx-grid-bg kx-grid-fade" aria-hidden="true" />
                <GlowOrb className="top-[-10%] left-[15%] kx-float" color="rgba(56,189,248,0.14)" size={560} />
                <GlowOrb className="bottom-[5%] right-[10%]" color="rgba(34,211,160,0.08)" size={420} />

                {/* Decorative rotating ring */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-accent/[0.07] kx-spin-slow pointer-events-none" aria-hidden="true">
                    <span className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/60 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6">
                    <Reveal delay={0.1} y={0} blur>
                        <span className="inline-flex items-center gap-2 kx-glass rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent">
                            <span className="w-1.5 h-1.5 rounded-full bg-success kx-live-dot" />
                            Live simulated markets
                        </span>
                    </Reveal>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] text-balance">
                        <TextReveal text="Precision over" delay={0.2} as="span" />
                        <br />
                        <TextReveal text="Prediction" delay={0.5} as="span" className="kx-gradient-text" />
                    </h1>

                    <Reveal delay={0.7}>
                        <p className="text-lg md:text-2xl text-[rgba(255,255,255,0.5)] max-w-2xl mx-auto font-medium leading-relaxed text-pretty">
                            Analyze the market. Profit in both bull and bear phases — without risking a rupee.
                        </p>
                    </Reveal>

                    <Reveal delay={0.9} className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                        <Magnetic>
                            <Link to={user ? '/dashboard' : '/login'} className="kx-shimmer inline-flex items-center gap-2 bg-accent text-black hover:bg-sky-300 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_32px_rgba(56,189,248,0.35)]">
                                Start Trading Now
                                <ArrowRight size={20} />
                            </Link>
                        </Magnetic>
                        <button onClick={() => scrollToSection('products')} className="kx-underline text-[rgba(255,255,255,0.55)] hover:text-white font-semibold px-4 py-4 transition-colors">
                            Explore the platform
                        </button>
                    </Reveal>
                </div>

                {/* Scroll hint */}
                <Reveal delay={1.4} y={0} className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-10 rounded-full border border-white/15 flex justify-center pt-2">
                        <span className="w-1 h-2 rounded-full bg-accent animate-bounce" />
                    </div>
                </Reveal>
            </header>

            {/* Live Ticker Marquee */}
            <section className="relative z-10 border-y border-white/[0.06] bg-secondary/40 py-4" aria-label="Market ticker">
                <Marquee speed={35}>
                    {DEMO_MARKETS.map((m) => (
                        <div key={m.symbol} className="flex items-center gap-3 px-2">
                            <span className="font-bold text-sm text-white">{m.symbol}</span>
                            <span className="price-mono text-sm text-[rgba(255,255,255,0.6)]">{m.price}</span>
                            <span className={`price-mono text-xs font-semibold flex items-center gap-1 ${m.up ? 'text-success' : 'text-danger'}`}>
                                {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {m.change}
                            </span>
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* Stats Strip */}
            <section className="relative z-10 py-20 border-b border-white/[0.06]">
                <div className="container mx-auto px-6">
                    <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS.map((stat) => (
                            <StaggerItem key={stat.label} className="text-center flex flex-col gap-2">
                                <span className="text-4xl md:text-5xl font-extrabold tracking-tight kx-gradient-text price-mono">
                                    <AnimatedCounter value={stat.value} />{stat.suffix}
                                </span>
                                <span className="text-xs uppercase tracking-[0.2em] text-[rgba(255,255,255,0.35)] font-semibold">{stat.label}</span>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="relative z-10 py-28 overflow-hidden">
                <GlowOrb className="top-[20%] right-[-10%]" color="rgba(56,189,248,0.08)" size={520} />
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-14">
                        <div className="flex-1 flex flex-col gap-6">
                            <Reveal>
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">The Terminal</span>
                            </Reveal>
                            <TextReveal text="Advanced Charting" as="h2" className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance" />
                            <Reveal delay={0.15}>
                                <p className="text-xl text-[rgba(255,255,255,0.5)] leading-relaxed text-pretty">
                                    Professional-grade tools for serious traders. Multiple chart layouts, live indicators, and real-time data streaming.
                                </p>
                            </Reveal>
                            <Stagger delay={0.2} className="flex flex-col gap-4 text-[rgba(255,255,255,0.7)]">
                                {['Candlestick & line charts', 'Order book depth view', 'Drawing tools & strategy builder'].map(item => (
                                    <StaggerItem key={item} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0"><ArrowUpRight size={14} /></span>
                                        {item}
                                    </StaggerItem>
                                ))}
                            </Stagger>
                        </div>
                        <Reveal className="flex-1 w-full" delay={0.2} y={40}>
                            <TiltCard className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_24px_80px_-24px_rgba(56,189,248,0.25)]">
                                <img
                                    src={proChart}
                                    alt="Kryonex professional charting interface"
                                    className="w-full h-auto"
                                />
                            </TiltCard>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section id="features" className="relative z-10 py-28 border-t border-white/[0.06]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 flex flex-col items-center gap-4">
                        <Reveal>
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Everything Included</span>
                        </Reveal>
                        <TextReveal text="Built for the modern trader" as="h2" className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance" />
                    </div>

                    <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f) => (
                            <StaggerItem key={f.title}>
                                <HoverLift className="kx-card h-full p-7 flex flex-col gap-4">
                                    <span className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                        <f.icon size={20} />
                                    </span>
                                    <h3 className="text-lg font-bold">{f.title}</h3>
                                    <p className="text-sm text-[rgba(255,255,255,0.45)] leading-relaxed">{f.desc}</p>
                                </HoverLift>
                            </StaggerItem>
                        ))}
                    </Stagger>
                </div>
            </section>

            {/* Markets Section (DEMO VIEW) */}
            <section id="markets" className="relative z-10 py-28 border-t border-white/[0.06] overflow-hidden">
                <GlowOrb className="bottom-[-20%] left-[-10%]" color="rgba(56,189,248,0.08)" size={520} />
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 flex flex-col items-center gap-4">
                        <Reveal>
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-success">Live Coverage</span>
                        </Reveal>
                        <TextReveal text="Market Overview" as="h2" className="text-4xl md:text-6xl font-extrabold tracking-tight" />
                        <Reveal delay={0.1}>
                            <p className="text-[rgba(255,255,255,0.5)] text-lg">Real-time global market data coverage. (Demo View)</p>
                        </Reveal>
                    </div>

                    <Reveal y={40}>
                        <div className="max-w-4xl mx-auto kx-card overflow-hidden">
                            <div className="grid grid-cols-4 bg-white/[0.03] p-4 th-label border-b border-white/[0.05]">
                                <div>Symbol</div>
                                <div className="text-right">Price</div>
                                <div className="text-right">Change</div>
                                <div className="text-right">Trend</div>
                            </div>
                            <Stagger gap={0.05} className="divide-y divide-white/[0.04]">
                                {DEMO_MARKETS.slice(0, 5).map((market) => (
                                    <StaggerItem key={market.symbol} y={12} className="grid grid-cols-4 p-5 hover:bg-accent/[0.04] transition-colors cursor-pointer items-center">
                                        <div className="font-bold text-white flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-[10px] text-accent">{market.symbol[0]}</span>
                                            {market.symbol}
                                        </div>
                                        <div className="text-right price-mono text-[rgba(255,255,255,0.7)]">{market.price}</div>
                                        <div className={`text-right price-mono font-medium ${market.up ? 'text-success' : 'text-danger'}`}>
                                            {market.change}
                                        </div>
                                        <div className="text-right flex justify-end">
                                            {market.up
                                                ? <TrendingUp size={16} className="text-success" />
                                                : <TrendingDown size={16} className="text-danger" />}
                                        </div>
                                    </StaggerItem>
                                ))}
                            </Stagger>
                            <div className="p-4 bg-white/[0.02] text-center">
                                <Link to="/markets" className="inline-flex items-center gap-1 text-sm text-accent hover:text-white transition-colors font-semibold group">
                                    View Full Market Data
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-32 border-t border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 kx-grid-bg kx-grid-fade" aria-hidden="true" />
                <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(56,189,248,0.1)" size={640} />
                <div className="container mx-auto px-6 relative flex flex-col items-center text-center gap-8">
                    <TextReveal text="Master the markets. Risk nothing." as="h2" className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl text-balance" />
                    <Reveal delay={0.2}>
                        <Magnetic>
                            <Link to={user ? '/dashboard' : '/register'} className="kx-shimmer inline-flex items-center gap-2 bg-accent text-black hover:bg-sky-300 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                                {user ? 'Open Dashboard' : 'Create Free Account'}
                                <ArrowRight size={20} />
                            </Link>
                        </Magnetic>
                    </Reveal>
                </div>
            </section>

            {/* Detailed Footer */}
            <footer className="relative z-10 bg-black/40 pt-20 pb-10 border-t border-white/[0.08] text-sm">
                <div className="container mx-auto px-6">
                    <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                        {/* Brand / Contact */}
                        <StaggerItem className="flex flex-col gap-6">
                            <Link to="/" className="flex items-center gap-3 group">
                                <img src="/logo.png" alt="Kryonex Logo" className="w-8 h-8 object-contain" />
                                <span className="text-2xl font-extrabold tracking-tight text-white">Kryonex</span>
                            </Link>
                            <p className="text-[rgba(255,255,255,0.45)] leading-relaxed">
                                Advanced trading simulation platform for modern investors. Master the markets risk-free.
                            </p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-[rgba(255,255,255,0.45)]">
                                    <Mail size={16} className="text-accent shrink-0" />
                                    <a href="mailto:vinilnaikdharavath3705@gmail.com" className="kx-underline hover:text-white transition-colors break-all">vinilnaikdharavath3705@gmail.com</a>
                                </div>
                                <div className="flex items-center gap-3 text-[rgba(255,255,255,0.45)]">
                                    <Phone size={16} className="text-accent shrink-0" />
                                    <a href="tel:+919642033763" className="kx-underline hover:text-white transition-colors">+91 9642033763</a>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Features Links */}
                        <StaggerItem>
                            <h3 className="text-white font-bold mb-6">Platform</h3>
                            <ul className="flex flex-col gap-4 text-[rgba(255,255,255,0.45)]">
                                <li><Link to={user ? "/dashboard" : "/login"} className="kx-underline hover:text-accent transition-colors">Dashboard</Link></li>
                                <li><Link to={user ? "/markets" : "/login"} className="kx-underline hover:text-accent transition-colors">Live Markets</Link></li>
                                <li><Link to={user ? "/heatmap" : "/login"} className="kx-underline hover:text-accent transition-colors">Heatmaps</Link></li>
                                <li><Link to={user ? "/trade/BTC" : "/login"} className="kx-underline hover:text-accent transition-colors">Advanced Trade</Link></li>
                            </ul>
                        </StaggerItem>

                        {/* Project / Company */}
                        <StaggerItem>
                            <h3 className="text-white font-bold mb-6">Project</h3>
                            <ul className="flex flex-col gap-4 text-[rgba(255,255,255,0.45)]">
                                <li><Link to="/documentation" className="kx-underline hover:text-accent transition-colors">Documentation</Link></li>
                                <li><Link to="/features" className="kx-underline hover:text-accent transition-colors">Features List</Link></li>
                                <li><Link to="/updates" className="kx-underline hover:text-accent transition-colors">Updates</Link></li>
                            </ul>
                        </StaggerItem>

                        {/* Socials */}
                        <StaggerItem>
                            <h3 className="text-white font-bold mb-6">Connect</h3>
                            <div className="flex gap-4">
                                <Magnetic strength={0.35}>
                                    <a href="https://github.com/Vinilnaik3705" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-accent hover:text-black transition-all text-[rgba(255,255,255,0.45)]">
                                        <Github size={20} />
                                    </a>
                                </Magnetic>
                                <Magnetic strength={0.35}>
                                    <a href="https://www.linkedin.com/in/vinil-naik-76484a281/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-accent hover:text-black transition-all text-[rgba(255,255,255,0.45)]">
                                        <Linkedin size={20} />
                                    </a>
                                </Magnetic>
                                <Magnetic strength={0.35}>
                                    <a href="https://x.com/DV_Naik3705" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-accent hover:text-black transition-all text-[rgba(255,255,255,0.45)]">
                                        <Twitter size={20} />
                                    </a>
                                </Magnetic>
                            </div>
                        </StaggerItem>
                    </Stagger>

                    <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[rgba(255,255,255,0.35)]">
                        <p>© 2026 Vinil Naik. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="/privacy-policy" className="kx-underline hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms-of-service" className="kx-underline hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
