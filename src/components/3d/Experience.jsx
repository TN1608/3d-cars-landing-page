import { OrbitControls, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCarAnimation } from '../../hooks/useCarAnimation'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'

import { Model as MclarenGt3 } from './Mclaren_gt3'
import { Model as MclarenW1 } from './Mclaren_w1'
import { Model as MclarenF1 } from './Mclaren_f1_gtr_longtail'
import { Model as BmwM4 } from './Bmw_m4_widebody'

export const Experience = ({ isPreviewMode, activeCar }) => {
    const { camera } = useThree()
    const modelRef = useRef()
    const [isAtTop, setIsAtTop] = useState(true);
    const isIdleCinematicActive = useRef(true);
    const cinematicTl = useRef(null);

    // Track scroll position to toggle cinematic mode
    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reusable hook manages all the GSAP scroll animations
    // We pass our active ref so it knows not to fight the camera
    useCarAnimation(isPreviewMode, isIdleCinematicActive);

    // Cinematic Idle Camera System
    useEffect(() => {
        isIdleCinematicActive.current = isAtTop && !isPreviewMode;

        if (isIdleCinematicActive.current) {
            let ctx = gsap.context(() => {
                cinematicTl.current = gsap.timeline({ repeat: -1 });

                // Define cinematic shots (Forza style)
                const shots = [
                    // Shot 1: Wide Orbit (Hero)
                    {
                        start: { x: 4, y: 1.5, z: 7 },
                        end: { x: 5, y: 1.0, z: 5 },
                        dur: 12,
                        ease: "power1.inOut"
                    },
                    // Shot 2: Low Wheel Creep (Aggressive)
                    {
                        start: { x: -3.5, y: -0.2, z: 4 },
                        end: { x: -2.5, y: -0.2, z: 3 },
                        dur: 6,
                        ease: "linear"
                    },
                    // Shot 3: High Rear Over-Shoulder
                    {
                        start: { x: -2, y: 3, z: -6 },
                        end: { x: 0, y: 2, z: -7 },
                        dur: 7,
                        ease: "sine.inOut"
                    },
                    // Shot 4: Fast Profile Pan
                    {
                        start: { x: 6, y: 0.5, z: 1 },
                        end: { x: -4, y: 0.5, z: -1 },
                        dur: 5,
                        ease: "power2.out"
                    }
                ];

                shots.forEach((shot, index) => {
                    // Hard cut to start position
                    cinematicTl.current.set(camera.position, shot.start);
                    // Slow creep to end position
                    cinematicTl.current.to(camera.position, {
                        x: shot.end.x,
                        y: shot.end.y,
                        z: shot.end.z,
                        duration: shot.dur,
                        ease: shot.ease
                    });
                });
            });
            return () => {
                if (cinematicTl.current) cinematicTl.current.kill();
                ctx.revert();
            };
        } else {
            // Kill cinematic timeline if user scrolls or enters preview
            if (cinematicTl.current) {
                cinematicTl.current.kill();
            }
        }
    }, [isAtTop, isPreviewMode, camera]);

    useFrame((state, delta) => {
        if (!isPreviewMode) {
            if (modelRef.current) {
                modelRef.current.rotation.y = gsap.utils.interpolate(modelRef.current.rotation.y, 0, 0.1);
            }
            // Always look at the car during cinematic or scroll
            camera.lookAt(0, 0.3, 0);
        }
    })

    const renderCar = () => {
        switch (activeCar) {
            case "mclaren_w1": return <MclarenW1 />;
            case "mclaren_f1_gtr_longtail": return <MclarenF1 scale={0.18} position={[0, -0.6, 0]} />;
            case "bmw_m4_widebody": return <BmwM4 scale={0.22} position={[0, -0.4, 0]} />;
            case "mclaren_gt3":
            default: return <MclarenGt3 scale={0.85} />;
        }
    }

    return (
        <>
            {isPreviewMode && (
                <OrbitControls
                    makeDefault
                    autoRotate
                    autoRotateSpeed={0.5}
                    enableZoom={true}
                    enablePan={false}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75}
                    minDistance={5}
                    maxDistance={15}
                    enableDamping
                    dampingFactor={0.05}
                />
            )}
            {/* === CINEMATIC STUDIO LIGHTING === */}
            <ambientLight intensity={0.01} />

            {/* STAGE LIGHTING (Top Down Spotlight) */}
            <spotLight
                position={[0, 15, 0]}
                angle={0.6}
                penumbra={0.5}
                intensity={180}
                color="#ffffff"
                castShadow
            />

            {/* Top Softbox (Fills the scene) */}
            <spotLight
                position={[0, 12, 0]}
                angle={1.2}
                penumbra={1}
                intensity={50}
                color="#ffffff"
            />

            {/* Main Key Light (Sharp front-oblique highlight) */}
            <directionalLight
                position={[-12, 10, 10]}
                intensity={6}
                color="#ffffff"
                castShadow
                shadow-bias={-0.0001}
                shadow-mapSize={[2048, 2048]}
            />

            {/* Subtle Blue/Cool Fill (Opposite side) */}
            <directionalLight
                position={[10, 4, -5]}
                intensity={1.5}
                color="#c4d9ff"
            />

            {/* Rim Highlight (White/Cool) */}
            <spotLight
                position={[0, 6, -10]}
                angle={0.5}
                penumbra={0.8}
                intensity={40}
                color="#ffffff"
            />

            {/* Headlight simulation points */}
            <pointLight position={[0.8, -0.1, 2.8]} intensity={4} color="#ffe8b0" distance={5} decay={2} />
            <pointLight position={[-0.8, -0.1, 2.8]} intensity={4} color="#ffe8b0" distance={5} decay={2} />

            {/* Taillight simulation points */}
            <pointLight position={[0.6, 0.1, -2.6]} intensity={3} color="#ff1a00" distance={4} decay={2} />
            <pointLight position={[-0.6, 0.1, -2.6]} intensity={3} color="#ff1a00" distance={4} decay={2} />

            {/* Subtle floor accent */}
            <pointLight position={[0, -0.6, 2]} intensity={2} color="#ffffff" distance={6} decay={2} />

            <Environment preset="night" environmentIntensity={0.1} />

            <Suspense fallback={null}>
                <group ref={modelRef} scale={1.0} position={[0, -0.6, 0]}>
                    <group position={[0, 0.6, 0]}>
                        {renderCar()}
                    </group>
                </group>
            </Suspense>

            {/* Advanced Showroom Floor */}
            <mesh position={[0, -0.655, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={0.6}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.5}
                />
            </mesh>

            {/* Contact Shadows for grounding */}
            <ContactShadows
                position={[0, -0.65, 0]}
                opacity={0.9}
                scale={15}
                blur={1.8}
                far={1.5}
                resolution={1024}
                color="#000000"
            />

            {/* POST PROCESSING BLOOM & TONEMAPPING */}
            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={1}
                    mipmapBlur
                    intensity={1.0}
                    radius={0.4}
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <ToneMapping mode={THREE.ACESFilmicToneMapping} />
            </EffectComposer>
        </>
    )
}
