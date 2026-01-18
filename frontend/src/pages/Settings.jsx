import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { User, Shield, Bell, Moon, Sun, Smartphone, Key } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        marketing: false,
        security: true,
        trades: true
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <MainLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">Settings</h2>
                    <p className="text-text-muted mt-1 text-sm">Manage your account preferences and security</p>
                </div>

                {/* Profile Section */}
                <BentoCard title="Profile Information" icon={User}>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                            JD
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">John Doe</h3>
                            <p className="text-slate-500">john.doe@example.com</p>
                            <button className="text-accent text-sm font-bold mt-2 hover:text-white transition-colors">
                                Change Avatar
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase">Display Name</label>
                            <input type="text" value="John Doe" className="w-full bg-tertiary border border-border rounded-lg px-4 py-3 text-base text-text-main focus:outline-none focus:border-accent" readOnly />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase">Email Address</label>
                            <input type="email" value="john.doe@example.com" className="w-full bg-tertiary border border-border rounded-lg px-4 py-3 text-base text-text-main focus:outline-none focus:border-accent" readOnly />
                        </div>
                    </div>
                </BentoCard>

                {/* Preferences */}
                <BentoCard title="App Preferences" icon={Sun}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-tertiary rounded-lg text-text-main">
                                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                </div>
                                <div>
                                    <p className="font-bold text-base text-text-main">Theme Mode</p>
                                    <p className="text-sm text-text-muted">Select your preferred interface theme</p>
                                </div>
                            </div>
                            <div className="flex bg-tertiary rounded-lg p-1 border border-border">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-card text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-card text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-white">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-base text-white">Notifications</p>
                                    <p className="text-sm text-slate-400">Manage what alerts you receive</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.trades}
                                        onChange={() => toggleNotification('trades')}
                                        className="form-checkbox bg-black border-white/20 text-accent rounded focus:ring-accent"
                                    />
                                    <span className="text-sm text-slate-300">Trade Confirmations</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.security}
                                        onChange={() => toggleNotification('security')}
                                        className="form-checkbox bg-black border-white/20 text-accent rounded focus:ring-accent"
                                    />
                                    <span className="text-sm text-slate-300">Security Alerts</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* Security */}
                <BentoCard title="Security" icon={Shield}>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-accent group-hover:text-white transition-colors">
                                    <Key size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-base text-white">Change Password</p>
                                    <p className="text-sm text-slate-400">Update your account password</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-slate-300">Last changed 30d ago</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-success group-hover:text-white transition-colors">
                                    <Smartphone size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-base text-white">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-400">Secure your account with 2FA</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold bg-success/10 text-success px-2 py-1 rounded">Enabled</span>
                        </button>
                    </div>
                </BentoCard>
            </div>
        </MainLayout>
    );
}
