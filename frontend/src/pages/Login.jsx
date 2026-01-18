import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock, Loader } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative z-10">
                <Link to="/" className="inline-flex items-center text-text-muted hover:text-text-main transition-colors mb-6">
                    <ArrowLeft size={20} className="mr-2" /> Back to Home
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back</h1>
                    <p className="text-text-muted">Sign in to continue your trading journey</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-xl mb-6 text-sm flex items-center">
                        <span className="font-bold mr-2">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-border rounded-xl pl-12 pr-4 py-3 text-text-main focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-muted/50"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-border rounded-xl pl-12 pr-4 py-3 text-text-main focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-muted/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-text-muted text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-accent hover:text-white font-bold transition-colors">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
