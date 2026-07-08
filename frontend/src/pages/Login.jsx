import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Github, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Reveal, GlowOrb, Magnetic } from '../components/motion';

export default function Login() {
    const { loginWithGoogle, loginWithGithub, signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }
        setLoading(true);
        const result = await signInWithEmail(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Sign in failed. Please try again.');
        }
    };

    const handleOAuth = async (fn) => {
        setError('');
        try {
            await fn();
        } catch (err) {
            setError(err?.message || 'OAuth sign in failed. This provider may not be enabled.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 kx-grid-bg kx-grid-fade" aria-hidden="true" />
            <GlowOrb className="top-0 left-0 -translate-x-1/2 -translate-y-1/2 kx-float" color="rgba(56,189,248,0.15)" size={520} />
            <GlowOrb className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" color="rgba(34,211,160,0.07)" size={480} />

            <div className="w-full max-w-md relative z-10">
                <Reveal y={0} x={-16}>
                    <Link to="/" className="inline-flex items-center text-text-muted hover:text-text-main transition-all duration-300 mb-8 hover:translate-x-1 group">
                        <ArrowLeft size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Back to Home
                    </Link>
                </Reveal>

                <Reveal y={28} blur>
                    <div className="kx-glass rounded-2xl p-8 shadow-2xl relative overflow-hidden hover:border-accent/30 transition-all duration-500">
                        {/* Top edge subtle glow line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent mb-4 font-bold text-xl tracking-wider kx-float">
                                K
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-text-muted text-sm">Access your trading simulator and dashboard</p>
                        </div>

                        {error && (
                            <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Email / Password */}
                        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">Email</span>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 focus:border-accent/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                                    />
                                </div>
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">Password</span>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 focus:border-accent/60 pl-10 pr-11 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </label>

                            <Magnetic strength={0.12}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="kx-shimmer w-full flex items-center justify-center gap-2 bg-accent hover:bg-sky-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 px-4 font-bold text-black shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-all mt-1"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
                                </button>
                            </Magnetic>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3 text-2xs uppercase tracking-widest text-text-dim">
                            <span className="h-px flex-1 bg-white/[0.08]" />
                            or continue with
                            <span className="h-px flex-1 bg-white/[0.08]" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleOAuth(loginWithGoogle)}
                                className="w-full flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-accent/60 rounded-xl py-3 px-4 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span>Sign in with Google</span>
                            </button>

                            <button
                                onClick={() => handleOAuth(loginWithGithub)}
                                className="w-full flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 rounded-xl py-3 px-4 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                            >
                                <Github className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                <span>Sign in with GitHub</span>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs">
                            <span className="text-text-muted">Don&apos;t have an account? </span>
                            <Link to="/register" className="kx-underline text-accent hover:text-sky-300 font-bold transition-colors">
                                Sign up here
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}
