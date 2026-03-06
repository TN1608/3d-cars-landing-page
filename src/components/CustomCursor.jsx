import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor — Sharper futuristic triangle
 * 
 * - Sharp "stealth" triangle design
 * - Smooth rotation to follow movement
 * - Dynamic neon glow and "afterburn" trail
 */
export const CustomCursor = () => {
    const cursorRef = useRef(null);
    const ghostRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const ghost = ghostRef.current;
        const inner = innerRef.current;
        if (!cursor || !ghost || !inner) return;

        gsap.set([cursor, ghost], { x: -100, y: -100, opacity: 0 });

        let mx = -100, my = -100;
        let lastX = -100, lastY = -100;
        let angle = 0;

        const ticker = gsap.ticker.add(() => {
            const dx = mx - lastX;
            const dy = my - lastY;
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            }
            lastX += (mx - lastX) * 0.15;
            lastY += (my - lastY) * 0.15;

            // Main cursor
            gsap.set(cursor, { x: mx, y: my, rotation: angle });

            // Ghost trail follows with lag and smaller scale
            gsap.to(ghost, {
                x: mx,
                y: my,
                rotation: angle,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true,
            });
        });

        const onMove = (e) => { mx = e.clientX; my = e.clientY; };
        const onEnter = () => gsap.to([cursor, ghost], { opacity: 1, duration: 0.3 });
        const onLeave = () => gsap.to([cursor, ghost], { opacity: 0, duration: 0.4 });

        const onOver = (e) => {
            const hoverable = e.target.closest('button, a, [data-cursor-hover], input[type="range"]');
            if (hoverable) {
                gsap.to(inner, {
                    fill: '#ff4400',
                    scale: 1.2,
                    duration: 0.25
                });
                gsap.to(cursor, {
                    filter: 'drop-shadow(0 0 15px rgba(255,80,0,1))',
                    scale: 1.2,
                    duration: 0.2
                });
                gsap.to(ghost, { scale: 1.8, opacity: 0.1, duration: 0.3 });
            } else {
                gsap.to(inner, {
                    fill: 'transparent',
                    scale: 1,
                    duration: 0.25
                });
                gsap.to(cursor, {
                    filter: 'drop-shadow(0 0 8px rgba(255,80,0,0.7))',
                    scale: 1,
                    duration: 0.2
                });
                gsap.to(ghost, { scale: 1, opacity: 0.4, duration: 0.3 });
            }
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseover', onOver);
        document.documentElement.style.cursor = 'none';

        return () => {
            gsap.ticker.remove(ticker);
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseover', onOver);
            document.documentElement.style.cursor = '';
        };
    }, []);

    return (
        <>
            {/* Ghost Trail */}
            <div
                ref={ghostRef}
                className="fixed top-0 left-0 z-9998 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
            >
                <svg width="44" height="44" viewBox="0 0 40 40">
                    <path
                        d="M20 2L35 35L20 28L5 35L20 2Z"
                        fill="none"
                        stroke="rgba(255,80,0,0.25)"
                        strokeWidth="1"
                    />
                </svg>
            </div>

            {/* Main Sharper Stealth Triangle */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 z-9999 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
            >
                <svg
                    width="32" height="32"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Glowing outer edge */}
                    <path
                        ref={innerRef}
                        d="M20 2L35 35L20 28L5 35L20 2Z"
                        stroke="#ff5500"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        fill="transparent"
                        style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                    />
                    {/* Inner cockpit/core detail */}
                    <path
                        d="M20 10L26 24L20 21L14 24L20 10Z"
                        fill="white"
                        opacity="0.9"
                    />
                    {/* Precision tip */}
                    <circle cx="20" cy="2" r="1.5" fill="#ffcc00" />
                </svg>
            </div>
        </>
    );
};
