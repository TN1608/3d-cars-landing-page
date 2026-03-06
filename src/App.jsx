import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from 'react';
import { Experience } from './components/3d/Experience';
import { Interface } from './components/Interface';
import { Controls } from './components/Controls';
import { CustomCursor } from './components/CustomCursor';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CARS } from './constants/cars';
import { PLAYLIST } from './constants/playlist';
import { Preloader } from './components/Preloader';

gsap.registerPlugin(ScrollTrigger);

function App() {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [activeCar, setActiveCar] = useState(CARS[0].id);
    const [activeTrack, setActiveTrack] = useState(PLAYLIST[0]);
    const [isChangingCar, setIsChangingCar] = useState(false);

    useEffect(() => {
        // Handle car change sequence
        const handleCarChange = () => {
            setIsChangingCar(true);

            // Force scroll to top instantly
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Small delay to allow preloader to show before 3D swaps
            setTimeout(() => {
                setIsChangingCar(false);
            }, 1000);
        };

        handleCarChange();
    }, [activeCar]);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        })

        lenis.on('scroll', ScrollTrigger.update)

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)

        // Disable scrolling if preview mode is active
        if (isPreviewMode) {
            lenis.stop()
            document.body.style.overflow = 'hidden'
        } else {
            lenis.start()
            document.body.style.overflow = ''
        }

        return () => {
            lenis.destroy()
            gsap.ticker.remove(lenis.raf)
        }
    }, [isPreviewMode])

    return (
        <main className="relative w-full min-h-screen bg-neutral-950 overflow-x-hidden selection:bg-orange-500 selection:text-white font-[Rajdhani]">
            {/* FIXED 3D CANVAS BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas shadows camera={{ position: [0, 2, 10], fov: 30 }}>
                    <color attach="background" args={['#050505']} />
                    <Experience isPreviewMode={isPreviewMode} activeCar={activeCar} />
                </Canvas>
            </div>

            {/* SCROLLABLE HTML FOREGROUND OVERLAY */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isPreviewMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Interface isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode} activeCar={activeCar} />
            </div>

            {/* TOP-RIGHT TOOLBAR (Hidden in preview mode handled inside the component container) */}
            <Controls
                isPreviewMode={isPreviewMode}
                setIsPreviewMode={setIsPreviewMode}
                activeCar={activeCar}
                setActiveCar={setActiveCar}
                activeTrack={activeTrack}
                setActiveTrack={setActiveTrack}
            />

            {/* PREVIEW EXIT BUTTON (Always visible in Preview Mode) */}
            <div className={`fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-12 transition-all duration-1000 ${isPreviewMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                <button
                    onClick={() => setIsPreviewMode(false)}
                    className="pointer-events-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-['Orbitron'] tracking-widest font-bold text-sm transition-colors border border-red-500/50 backdrop-blur-md"
                >
                    EXIT PREVIEW
                </button>
            </div>

            {/* CUSTOM CURSOR */}
            <CustomCursor />

            {/* PRELOADER */}
            <Preloader isChangingCar={isChangingCar} />
        </main>
    )
}

export default App;