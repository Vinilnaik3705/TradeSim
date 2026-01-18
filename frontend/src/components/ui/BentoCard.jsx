import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", title, icon: Icon, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={`bg-secondary border border-border rounded-3xl p-6 relative overflow-hidden group ${className}`}
        >
            {/* Subtle Gradient Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />

            {/* Header if Title/Icon provided */}
            {(title || Icon) && (
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    {Icon && (
                        <div className="p-2.5 rounded-xl bg-tertiary text-accent border border-border">
                            <Icon size={20} />
                        </div>
                    )}
                    {title && <h3 className="text-base font-bold text-text-main">{title}</h3>}
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
