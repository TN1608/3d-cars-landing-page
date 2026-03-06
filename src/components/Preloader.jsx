import { useProgress } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export const Preloader = ({ isChangingCar }) => {
    const { active, progress } = useProgress();
    const [show, setShow] = useState(true);
    const containerRef = useRef();
    const progressRef = useRef();
    const barRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        // If we're not active (3D finished) and not manually changing car
        if (!active && !isChangingCar && progress === 100) {
            const tl = gsap.timeline({
                onComplete: () => setShow(false)
            });

            tl.to(textRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            })
                .to(barRef.current, {
                    scaleX: 0,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "-=0.2")
                .to(containerRef.current, {
                    y: "-100%",
                    duration: 1,
                    ease: "power4.inOut"
                }, "-=0.4");
        } else {
            setShow(true);
            gsap.set(containerRef.current, { y: "0%" });
            gsap.set(textRef.current, { y: 0, opacity: 1 });
        }
    }, [active, progress, isChangingCar]);

    if (!show) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center pointer-events-auto"
        >
            <div className="w-64 h-px bg-white/10 relative overflow-hidden">
                <div
                    ref={barRef}
                    className="absolute inset-0 bg-orange-600 origin-left transition-transform duration-300 ease-out"
                    style={{ transform: `scaleX(${progress / 100})` }}
                />
            </div>

            <div ref={textRef} className="mt-8 flex flex-col items-center">
                <h2 className="text-white font-['Orbitron'] tracking-[0.3em] font-black text-xs uppercase">
                    {Math.round(progress)}%
                </h2>
                <p className="text-orange-500/50 font-['Rajdhani'] text-[10px] tracking-[0.5em] mt-2 uppercase animate-pulse">
                    {isChangingCar ? "Calibrating Model" : "Initializing Experience"}
                </p>
            </div>

            <div className="absolute bottom-12 left-12 flex gap-4 opacity-20 text-white">
                <div className="w-12 h-px bg-current" />
                <div className="w-4 h-px bg-current" />
                <div className="w-2 h-px bg-current" />
            </div>
        </div>
    );
};
