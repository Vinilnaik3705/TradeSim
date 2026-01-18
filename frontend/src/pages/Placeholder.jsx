import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 text-blue-500 animate-pulse">
                <Construction size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {title || 'Coming Soon'}
            </h1>
            <p className="text-slate-400 text-lg max-w-md mb-8">
                We are currently working hard on this page. Stay tuned for updates!
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Home
            </Link>
        </div>
    );
};

export default Placeholder;
