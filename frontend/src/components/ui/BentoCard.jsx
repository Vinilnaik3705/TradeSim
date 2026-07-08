import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", title, icon: Icon, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: delay, ease: [0.22, 1, 0.36, 1] }}
            className={`kx-card bg-card border border-border rounded-xl p-4 relative overflow-hidden group ${className}`}
        >
            {/* Subtle Gradient Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-accent/[0.04] blur-[80px] rounded-full pointer-events-none group-hover:bg-accent/[0.1] transition-colors duration-500" />

            {/* Top accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header if Title/Icon provided */}
            {(title || Icon) && (
                <div className="flex items-center gap-2.5 mb-5 relative z-10">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-accent/[0.08] text-accent border border-accent/[0.12] transition-transform duration-300 group-hover:scale-110">
                            <Icon size={17} />
                        </div>
                    )}
                    {title && <h3 className="text-sm font-bold text-white">{title}</h3>}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default BentoCard;
