import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const StaticPage = ({ title, eyebrow, description, sections = [], backTo = '/', backLabel = 'Back to Home' }) => {
    return (
        <div className="min-h-screen bg-background kx-grid-bg text-white">
            <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-10"
                >
                    <Link to={backTo} className="kx-underline inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
                        <ArrowLeft size={18} />
                        {backLabel}
                    </Link>
                    {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-accent/80 font-bold mb-3">{eyebrow}</p>}
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance kx-gradient-text">{title}</h1>
                    {description && <p className="mt-4 text-slate-400 max-w-3xl text-base sm:text-lg leading-relaxed text-pretty">{description}</p>}
                </motion.div>

                <div className="grid gap-6">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.title}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
                            className="kx-card kx-glass rounded-2xl p-6 sm:p-8"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-balance">{section.title}</h2>
                            {Array.isArray(section.body) ? (
                                <div className="space-y-3 text-slate-400 leading-relaxed">
                                    {section.body.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 leading-relaxed">{section.body}</p>
                            )}
                            {section.list && (
                                <ul className="mt-4 space-y-2 text-slate-400 list-disc list-inside">
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </motion.section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaticPage;
