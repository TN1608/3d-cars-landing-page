import { Section } from "@/components/fragments/Section.jsx";
import BlurText from "@/components/BlurText.jsx";
import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CARS } from "../constants/cars";

gsap.registerPlugin(ScrollTrigger);

export const Interface = ({ isPreviewMode, setIsPreviewMode, activeCar }) => {
    const performanceRef = useRef(null);
    const performanceContentRef = useRef(null);

    const currentCar = useMemo(() => {
        return CARS.find(c => c.id === activeCar) || CARS[0];
    }, [activeCar]);

    useGSAP(() => {
        // Performance Section Animation
        gsap.fromTo(performanceContentRef.current,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: performanceRef.current,
                    start: "top center",
                    end: "bottom center",
                    toggleActions: "play reverse play reverse",
                }
            }
        );
    }, { dependencies: [activeCar] });

    return (
        <div className="w-full">
            {/* SECTION 0: HERO (Sảnh chờ) */}
            <section className="h-screen w-screen flex flex-col justify-end p-12 md:p-24 pointer-events-none relative z-20">
                <div key={currentCar.id}>
                    <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter italic drop-shadow-lg font-['Orbitron'] text-white">
                        {currentCar.modelCode} <br /> <span className="text-orange-500 uppercase">{currentCar.brand}</span>
                    </h1>
                    <div className="mt-4">
                        <BlurText
                            text="SCROLL TO EXPLORE PRECISION"
                            delay={50}
                            animateBy="words"
                            direction="top"
                            className="text-gray-300 font-['Rajdhani'] font-bold tracking-widest text-xl drop-shadow"
                        />
                    </div>
                </div>

                {/* PREVIEW BUTTON handled in Controls.jsx but kept mirror here for consistent UI if needed */}
                {/* {!isPreviewMode && (
                    <div className="absolute bottom-12 right-12 pointer-events-auto">
                        <button
                            onClick={() => setIsPreviewMode(true)}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-orange-600/20 hover:bg-orange-600 text-orange-500 hover:text-white border border-orange-500/50 transition-all duration-300 backdrop-blur-md rounded-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span className="font-['Orbitron'] tracking-widest font-bold text-sm">ENTER PREVIEW</span>
                        </button>
                    </div>
                )} */}
            </section>

            {/* SECTION 1: AERODYNAMICS */}
            <Section
                subtitle="Airflow Management"
                title="AERO"
                description={currentCar.descriptions.aero}
                alignment="right"
            />

            {/* SECTION 2: WHEELS */}
            <Section
                subtitle="Unsprung Mass"
                title="RACING"
                description={currentCar.descriptions.racing}
                alignment="left"
            />

            {/* SECTION 3: REAR WING */}
            <Section
                subtitle="Downforce"
                title="WINGS"
                description={currentCar.descriptions.wings}
                alignment="right"
            />

            {/* SECTION 4: PERFORMANCE DATA */}
            <section ref={performanceRef} className="h-screen w-full flex items-center justify-center p-12 pointer-events-none">
                <div ref={performanceContentRef} className="bg-black/60 backdrop-blur-xl border border-orange-500/20 p-12 rounded-2xl shadow-[0_0_50px_rgba(255,128,0,0.1)]">
                    <div className="grid grid-cols-2 gap-12 text-center">
                        <div>
                            <p className="text-orange-500 font-['Orbitron'] text-sm tracking-widest mb-2 font-bold uppercase">HORSEPOWER</p>
                            <h3 className="text-6xl font-black text-white font-['Orbitron']">{currentCar.specs.hp}</h3>
                        </div>
                        <div>
                            <p className="text-orange-500 font-['Orbitron'] text-sm tracking-widest mb-2 font-bold uppercase">0-100 KM/H</p>
                            <h3 className="text-6xl font-black text-white font-['Orbitron']">{currentCar.specs.zeroToHundred}</h3>
                        </div>
                        <div className="col-span-2 border-t border-white/10 pt-6 mt-2">
                            <p className="text-gray-300 font-light italic font-['Rajdhani'] text-xl">"{currentCar.specs.tagline}"</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
