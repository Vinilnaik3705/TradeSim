'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Kryonex Motion System
   Reusable animation primitives. Pure presentation — no logic.
   ───────────────────────────────────────────────────────────── */

export const EASE = [0.22, 1, 0.36, 1];

/* ── Reveal: scroll-triggered entrance ── */
export const Reveal = ({
    children,
    delay = 0,
    duration = 0.7,
    y = 24,
    x = 0,
    blur = false,
    once = true,
    className = '',
    as = 'div',
    ...rest
}) => {
    const prefersReduced = useReducedMotion();
    const Comp = motion[as] || motion.div;
    if (prefersReduced) return <Comp className={className} {...rest}>{children}</Comp>;
    return (
        <Comp
            initial={{ opacity: 0, y, x, filter: blur ? 'blur(8px)' : 'none' }}
            whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
            viewport={{ once, margin: '-40px' }}
            transition={{ duration, delay, ease: EASE }}
            className={className}
            {...rest}
        >
            {children}
        </Comp>
    );
};

/* ── Stagger: container that staggers its children ── */
export const Stagger = ({ children, delay = 0, gap = 0.08, className = '', ...rest }) => (
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
            hidden: {},
            show: { transition: { staggerChildren: gap, delayChildren: delay } },
        }}
        className={className}
        {...rest}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, y = 20, className = '', ...rest }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
        }}
        className={className}
        {...rest}
    >
        {children}
    </motion.div>
);

/* ── TextReveal: staggered per-word text entrance ── */
export const TextReveal = ({ text, className = '', delay = 0, as: Tag = 'span' }) => {
    const words = String(text).split(' ');
    return (
        <Tag className={className} aria-label={text}>
            <motion.span
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
                className="inline"
                aria-hidden="true"
            >
                {words.map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden align-bottom">
                        <motion.span
                            className="inline-block"
                            variants={{
                                hidden: { y: '110%', opacity: 0 },
                                show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
                            }}
                        >
                            {word}{i < words.length - 1 ? '\u00A0' : ''}
                        </motion.span>
                    </span>
                ))}
            </motion.span>
        </Tag>
    );
};

/* ── AnimatedCounter: count-up number when scrolled into view ── */
export const AnimatedCounter = ({ value, format, duration = 1.4, className = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-20px' });
    const [display, setDisplay] = useState(0);
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        if (!inView) return;
        if (prefersReduced) { setDisplay(value); return; }
        let raf;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setDisplay(value * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value, duration, prefersReduced]);

    return (
        <span ref={ref} className={className}>
            {format ? format(display) : Math.round(display).toLocaleString()}
        </span>
    );
};

/* ── Magnetic: element follows cursor slightly on hover ── */
export const Magnetic = ({ children, strength = 0.25, className = '' }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
    const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });
    const prefersReduced = useReducedMotion();

    const onMove = (e) => {
        if (prefersReduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
    };
    const onLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ x: sx, y: sy }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── TiltCard: subtle 3D tilt on hover ── */
export const TiltCard = ({ children, max = 6, className = '', ...rest }) => {
    const ref = useRef(null);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 180, damping: 18 });
    const sry = useSpring(ry, { stiffness: 180, damping: 18 });
    const prefersReduced = useReducedMotion();

    const onMove = (e) => {
        if (prefersReduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * max);
        rx.set(-py * max);
    };
    const onLeave = () => { rx.set(0); ry.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

/* ── Marquee: infinite horizontal scroll strip ── */
export const Marquee = ({ children, speed = 30, reverse = false, className = '', pauseOnHover = true }) => {
    const prefersReduced = useReducedMotion();
    if (prefersReduced) {
        return <div className={`overflow-x-auto ${className}`}><div className="flex gap-8 w-max">{children}</div></div>;
    }
    return (
        <div className={`overflow-hidden ${className}`} style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
            <div
                className={`flex w-max gap-8 kx-marquee ${pauseOnHover ? 'kx-marquee-pausable' : ''}`}
                style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
            >
                <div className="flex gap-8 shrink-0">{children}</div>
                <div className="flex gap-8 shrink-0" aria-hidden="true">{children}</div>
            </div>
        </div>
    );
};

/* ── PageTransition: route enter/exit wrapper ── */
export const PageTransition = ({ children, className = '' }) => {
    const prefersReduced = useReducedMotion();
    if (prefersReduced) return <div className={className}>{children}</div>;
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: EASE }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── HoverLift: card hover lift with glow ── */
export const HoverLift = ({ children, className = '', ...rest }) => (
    <motion.div
        whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE } }}
        className={className}
        {...rest}
    >
        {children}
    </motion.div>
);

/* ── GlowOrb: ambient background glow (decorative) ── */
export const GlowOrb = ({ className = '', color = 'rgba(56,189,248,0.12)', size = 500 }) => (
    <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full blur-[120px] ${className}`}
        style={{ width: size, height: size, background: color }}
    />
);
