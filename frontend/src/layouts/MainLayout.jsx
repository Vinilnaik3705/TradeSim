import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Wallet, LogOut, Menu, ArrowRightLeft, Star, Settings, Bell, X, Grid2X2 } from 'lucide-react';
import CommandPalette from '../components/ui/CommandPalette';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-tertiary hover:text-text-main'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </Link>
);

const MainLayout = ({ children }) => {
    useKeyboardShortcuts();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

    const { user, logout } = useAuth();
    const { marketType, toggleMarketType, watchlist } = useMarket();
    const { theme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ArrowRightLeft, label: 'Markets', path: '/markets' },
        { icon: Grid2X2, label: 'Heatmap', path: '/heatmap' },
        { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
        { icon: Star, label: `Watchlist (${watchlist.length})`, path: '/watchlist' },
        { icon: Wallet, label: 'Wallet', path: '/wallet' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const notifications = [
        { id: 1, title: 'Bitcoin is up 5%', time: '2m ago', read: false },
        { id: 2, title: 'Trade executed: Buy ETH', time: '1h ago', read: true },
        { id: 3, title: 'New login detected', time: '5h ago', read: true },
    ];

    return (
        <div className="flex min-h-screen bg-primary">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                            TradeSim
                        </h1>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 hover:bg-tertiary rounded-full transition-colors relative"
                            >
                                <Bell size={20} className="text-text-muted hover:text-text-main" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-card" />
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute left-full top-0 ml-2 w-72 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Notifications</span>
                                        <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map(n => (
                                            <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-white/5' : ''}`}>
                                                <p className="text-sm font-bold text-white mb-1">{n.title}</p>
                                                <p className="text-xs text-slate-500">{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-2 bg-white/5 text-center">
                                        <button className="text-xs font-bold text-accent hover:text-white">Mark all as read</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {user && (
                        <div className="mt-4 p-3 bg-tertiary/50 rounded-lg border border-border">
                            <p className="text-xs text-text-muted">Logged in as:</p>
                            <p className="font-bold text-sm truncate text-text-main">{user.name}</p>
                        </div>
                    )}
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname + location.search === item.path}
                        />
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-text-muted hover:text-danger hover:bg-danger/10 w-full rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-card/90 backdrop-blur-md z-30 border-b border-border">
                <div className="p-4 flex justify-between items-center">
                    <span className="font-bold text-lg bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">TradeSim</span>
                    <div className="flex items-center gap-3">
                        <button
                            className="relative"
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        >
                            <Bell size={20} className="text-text-muted" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" />
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-main">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Notifications Dropdown */}
                {isNotificationsOpen && (
                    <div className="absolute right-4 top-16 w-80 max-w-[calc(100vw-2rem)] bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">Notifications</span>
                            <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-white/5' : ''}`}>
                                    <p className="text-sm font-bold text-white mb-1">{n.title}</p>
                                    <p className="text-xs text-slate-500">{n.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 bg-white/5 text-center">
                            <button className="text-xs font-bold text-accent hover:text-white">Mark all as read</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-6 pt-20 md:pt-6 min-h-screen">
                {children}
            </main>

            {/* Mobile Menu Overlay - Improved */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Slide-in Menu */}
                    <div className="fixed inset-y-0 right-0 w-64 bg-card border-l border-border z-50 md:hidden overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-text-main">Menu</h2>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            {user && (
                                <div className="mb-6 p-3 bg-tertiary/50 rounded-lg border border-border">
                                    <p className="text-xs text-text-muted">Logged in as:</p>
                                    <p className="font-bold text-sm truncate text-text-main">{user.name}</p>
                                </div>
                            )}

                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-accent/10 text-accent'
                                            : 'text-text-muted hover:bg-tertiary hover:text-text-main'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <button
                                className="flex items-center space-x-3 px-4 py-3 text-danger hover:bg-danger/10 w-full rounded-lg transition-colors mt-6"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <CommandPalette />
        </div>
    );
};

export default MainLayout;
