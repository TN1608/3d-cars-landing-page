import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARS } from '../constants/cars';
import { PLAYLIST } from '../constants/playlist';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

gsap.registerPlugin(ScrollTrigger);

// SVG vinyl record
const VinylDisc = () => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="32" cy="32" r="31" fill="url(#vinylGrad)" />
        <circle cx="32" cy="32" r="28" stroke="#3a3a3a" strokeWidth="0.6" fill="none" opacity="0.8" />
        <circle cx="32" cy="32" r="25" stroke="#2e2e2e" strokeWidth="0.5" fill="none" opacity="0.7" />
        <circle cx="32" cy="32" r="22" stroke="#3a3a3a" strokeWidth="0.6" fill="none" opacity="0.8" />
        <circle cx="32" cy="32" r="19" stroke="#2e2e2e" strokeWidth="0.5" fill="none" opacity="0.7" />
        <circle cx="32" cy="32" r="16" stroke="#3a3a3a" strokeWidth="0.6" fill="none" opacity="0.8" />
        <circle cx="32" cy="32" r="12" fill="url(#labelGrad)" />
        <circle cx="32" cy="32" r="10" stroke="rgba(255,120,0,0.25)" strokeWidth="0.8" fill="none" />
        <circle cx="32" cy="32" r="2.5" fill="#080808" />
        <ellipse cx="22" cy="18" rx="6" ry="2" fill="white" opacity="0.08" transform="rotate(-30 22 18)" />
        <defs>
            <radialGradient id="vinylGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="60%" stopColor="#111111" />
                <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d05000" />
                <stop offset="100%" stopColor="#6e1a00" />
            </radialGradient>
        </defs>
    </svg>
);

export const Controls = ({ isPreviewMode, setIsPreviewMode, activeCar, setActiveCar, activeTrack, setActiveTrack }) => {
    const [isMuted, setIsMuted] = useState(false); // start unmuted → auto-play
    const [volume, setVolume] = useState(1.0);       // 100% by default
    const bgmRef = useRef(null);
    const engineRef = useRef(null);

    // Create audio on track change
    useEffect(() => {
        const bgm = new Audio(`/sounds/${activeTrack.file}`);
        bgm.loop = true;
        bgm.volume = volume;
        bgm.muted = isMuted;
        bgmRef.current = bgm;

        const eng = new Audio('/sounds/engine.mp3');
        eng.loop = true;
        eng.volume = 0;
        eng.muted = isMuted;
        engineRef.current = eng;

        // Try to play both (will fail if no user interaction yet)
        if (!isMuted) {
            bgm.play().catch(() => { });
            eng.play().catch(() => { });
        }

        return () => {
            bgm.pause(); bgm.src = '';
            eng.pause(); eng.src = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTrack]);

    // Bypass browser auto-play restriction on first click
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!isMuted && bgmRef.current && engineRef.current) {
                bgmRef.current.play().catch(() => { });
                engineRef.current.play().catch(() => { });
            }
            window.removeEventListener('click', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction);
        return () => window.removeEventListener('click', handleFirstInteraction);
    }, [isMuted]);

    // Sync mute state
    useEffect(() => {
        if (!bgmRef.current || !engineRef.current) return;
        bgmRef.current.muted = isMuted;
        engineRef.current.muted = isMuted;
        if (!isMuted) {
            bgmRef.current.play().catch(() => { });
            engineRef.current.play().catch(() => { });
        } else {
            bgmRef.current.pause();
            engineRef.current.pause();
        }
    }, [isMuted]);

    // Sync volume
    useEffect(() => {
        if (bgmRef.current) bgmRef.current.volume = volume;
    }, [volume]);

    // Scroll-based BGM ↔ engine sequenced transition
    useEffect(() => {
        const bgm = bgmRef.current;
        const eng = engineRef.current;

        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: 'bottom-=50 bottom', // Trigger when 50px from the bottom
            onToggle: (self) => {
                if (!bgm || !eng || isMuted) return;

                if (self.isActive) {
                    // SCROLLED TO BOTTOM: Transition to Engine
                    // 1. Fade out BGM (2 seconds)
                    gsap.to(bgm, {
                        volume: 0,
                        duration: 1.5,
                        overwrite: true,
                        onComplete: () => {
                            // Optionally pause BGM if needed, but volume 0 is safer for looping
                        }
                    });

                    // 2. Wait 3-4s total then Fade in Engine
                    // delay 3.5s means 1.5s fade + 2s silence
                    gsap.to(eng, {
                        volume: volume,
                        duration: 1.2,
                        delay: 3.5,
                        overwrite: true,
                    });
                } else {
                    // SCROLLED UP: Transition back to BGM
                    // 1. Fade out Engine quickly
                    gsap.to(eng, {
                        volume: 0,
                        duration: 0.8,
                        overwrite: true
                    });

                    // 2. Fade in BGM immediately
                    gsap.to(bgm, {
                        volume: volume,
                        duration: 1.5,
                        overwrite: true
                    });
                }
            }
        });
        return () => trigger.kill();
    }, [volume, isMuted, activeTrack]);

    const handleNextTrack = () => {
        const idx = PLAYLIST.findIndex(t => t.id === activeTrack.id);
        setActiveTrack(PLAYLIST[(idx + 1) % PLAYLIST.length]);
    };

    const handlePrevTrack = () => {
        const idx = PLAYLIST.findIndex(t => t.id === activeTrack.id);
        setActiveTrack(PLAYLIST[(idx - 1 + PLAYLIST.length) % PLAYLIST.length]);
    };

    return (
        <>
            {/* ══ TOP-RIGHT TOOLBAR ══ */}
            <div className={`fixed top-8 right-8 z-50 flex items-center gap-3
                bg-black/40 backdrop-blur-md pl-3 pr-4 py-2 rounded-full
                border border-white/10 pointer-events-auto shadow-xl
                transition-all duration-500
                ${isPreviewMode ? 'opacity-0 pointer-events-none -translate-y-3' : 'opacity-100 translate-y-0'}`}
            >
                {/* ── Vinyl Disc widget – click to open Popover ── */}
                <Popover>
                    <PopoverTrigger asChild>
                        <div
                            className="flex items-center gap-3 cursor-pointer select-none rounded-full hover:bg-white/5 px-1 py-0.5 transition-colors"
                            title="Click to manage audio"
                        >
                            {/* Spinning disc */}
                            <div className="relative shrink-0">
                                <div className={`w-11 h-11 rounded-full overflow-hidden
                                    drop-shadow-[0_0_8px_rgba(255,100,0,0.55)] transition-all duration-300
                                    ${!isMuted ? 'animate-[spin_3s_linear_infinite]' : ''}`}
                                >
                                    <VinylDisc />
                                </div>
                                {/* Muted badge */}
                                {isMuted && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5">
                                            <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.728-.568A11.1 11.1 0 0 1 2.25 10c0-.83.112-1.633.322-2.396a.75.75 0 0 1 .728-.568H4.7l4.033-3.796a.75.75 0 0 1 .814-.178ZM15.22 7.22a.75.75 0 1 1 1.06 1.06L14.56 10l1.72 1.72a.75.75 0 1 1-1.06 1.06L13.5 11.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L12.44 10l-1.72-1.72a.75.75 0 1 1 1.06-1.06L13.5 8.94l1.72-1.72Z" />
                                        </svg>
                                    </span>
                                )}
                            </div>

                            {/* Track info */}
                            <div className="flex flex-col leading-tight min-w-0 max-w-[140px]">
                                <span className="text-white font-['Orbitron'] font-bold text-[11px] tracking-wide truncate">
                                    {activeTrack.name}
                                </span>
                                <span className="text-orange-400 font-['Rajdhani'] text-[10px] tracking-widest italic truncate">
                                    {activeTrack.source ?? ''} · {isMuted ? 'muted' : 'playing'}
                                </span>
                            </div>
                        </div>
                    </PopoverTrigger>

                    <PopoverContent
                        side="bottom"
                        align="end"
                        sideOffset={12}
                        className="w-52 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4"
                    >
                        {/* Playback controls row */}
                        <div className="flex items-center justify-between gap-2">
                            {/* Prev */}
                            <button
                                onClick={handlePrevTrack}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-all"
                                title="Previous track"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M7.712 4.819A1.5 1.5 0 0 1 10 6.095v2.973c.104-.131.234-.248.389-.344l6.323-3.905A1.5 1.5 0 0 1 19 6.095v7.81a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.505 1.505 0 0 1-.389-.344v2.973a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.5 1.5 0 0 1 0-2.552l6.323-3.905Z" />
                                </svg>
                            </button>
                            {/* Play / Pause (mute toggle) */}
                            <button
                                onClick={() => setIsMuted(m => !m)}
                                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-white shadow-lg transition-colors shrink-0"
                                title={isMuted ? 'Play' : 'Pause'}
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-0.5">
                                        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                                    </svg>
                                )}
                            </button>
                            {/* Next */}
                            <button
                                onClick={handleNextTrack}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-all"
                                title="Next track"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M3 4.819A1.5 1.5 0 0 1 5.288 3.54l6.323 3.905c.155.096.285.213.389.344V4.817a1.5 1.5 0 0 1 2.288-1.278l6.323 3.905a1.5 1.5 0 0 1 0 2.552l-6.323 3.906A1.5 1.5 0 0 1 12 12.625V9.652a1.505 1.505 0 0 1-.389.344L5.288 13.9A1.5 1.5 0 0 1 3 12.625V4.817Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* Sound toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-['Rajdhani'] text-sm tracking-wide">Sound</span>
                            <button
                                onClick={() => setIsMuted(m => !m)}
                                className={`w-9 h-5 rounded-full transition-colors duration-300 relative ${isMuted ? 'bg-gray-700' : 'bg-orange-500'}`}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isMuted ? 'left-0.5' : 'left-[18px]'}`} />
                            </button>
                        </div>

                        {/* Volume slider */}
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-500 shrink-0">
                                <path d="M9.547 3.062A.75.75 0 0 1 10 3.75v12.5a.75.75 0 0 1-1.264.546L4.703 13H3.167a.75.75 0 0 1-.728-.568A11.1 11.1 0 0 1 2.25 10c0-.83.112-1.633.322-2.396a.75.75 0 0 1 .728-.568H4.7l4.033-3.796a.75.75 0 0 1 .814-.178Z" />
                            </svg>
                            <input
                                type="range" min="0" max="1" step="0.01" value={volume}
                                onChange={e => {
                                    const v = parseFloat(e.target.value);
                                    setVolume(v);
                                    if (v > 0 && isMuted) setIsMuted(false);
                                    if (v === 0) setIsMuted(true);
                                }}
                                className="flex-1 h-1 appearance-none accent-orange-500 cursor-pointer rounded-full bg-white/20"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-400 shrink-0">
                                <path d="M10 3.75a.75.75 0 0 0-1.264-.546L4.703 7H3.167a.75.75 0 0 0-.728.568A11.085 11.085 0 0 0 2.25 10c0 .83.112 1.633.322 2.396a.75.75 0 0 0 .728.568H4.7l4.033 3.796A.75.75 0 0 0 10 16.25V3.75ZM15.95 5.05a.75.75 0 1 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 1 0 1.06 1.06 7 7 0 0 0 0-9.899ZM13.829 7.172a.75.75 0 1 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 1 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
                            </svg>
                        </div>

                        <p className="text-center text-orange-400 font-['Orbitron'] text-[10px] tracking-widest">
                            {Math.round(volume * 100)}%
                        </p>
                    </PopoverContent>
                </Popover>


                {/* Divider */}
                <div className="h-6 w-px bg-white/15" />

                {/* Preview Button */}
                <button
                    onClick={() => setIsPreviewMode(true)}
                    className="text-white hover:text-orange-500 transition-colors flex items-center justify-center w-8 h-8 hover:scale-110"
                    title="Enter Preview Mode"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
            </div>

            {/* ══ BOTTOM CENTER CAR SWITCHER ══ */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4
                bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10
                pointer-events-auto shadow-2xl transition-all duration-500
                ${isPreviewMode ? 'opacity-0 pointer-events-none translate-y-5' : 'opacity-100 translate-y-0'}`}
            >
                {CARS.map(car => (
                    <button
                        key={car.id}
                        onClick={() => setActiveCar(car.id)}
                        className={`relative w-28 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 group outline-none
                            ${activeCar === car.id
                                ? 'border-orange-500 scale-110 shadow-[0_0_20px_rgba(255,128,0,0.4)] z-10'
                                : 'border-white/10 hover:border-white/50 opacity-60 hover:opacity-100'}`}
                        title={car.name}
                    >
                        <img src={car.thumbnail} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-1 pt-4">
                            <p className={`text-[10px] text-center font-['Orbitron'] truncate transition-colors
                                ${activeCar === car.id ? 'text-orange-400 font-bold' : 'text-gray-300 group-hover:text-white'}`}>
                                {car.name}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* ══ INTERACTION HINT (Preview Mode Only) ══ */}
            <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-1000 delay-500
                ${isPreviewMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-8 text-white/40 font-['Rajdhani'] text-[9px] tracking-[0.5em] uppercase">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-px bg-white/10" />
                            <span>LMB to Rotate</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-px bg-white/10" />
                            <span>Scroll to Zoom</span>
                        </div>
                    </div>
                    <div className="h-4 w-px bg-linear-to-b from-orange-500/50 to-transparent animate-bounce mt-2" />
                </div>
            </div>
        </>
    );
};
