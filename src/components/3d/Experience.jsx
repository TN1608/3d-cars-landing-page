import { OrbitControls, Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCarAnimation } from '../../hooks/useCarAnimation'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'

import { Model as MclarenGt3 } from './Mclaren_gt3'
import { Model as MclarenW1 } from './Mclaren_w1'
import { Model as MclarenF1 } from './Mclaren_f1_gtr_longtail'
import { Model as BmwM4 } from './Bmw_m4_widebody'

export const Experience = ({ isPreviewMode, activeCar }) => {
    const { camera, scene } = useThree()
    const modelRef = useRef()
    const orbitAngle = useRef(0)

    // Cinematic Idle System State
    const [isIdle, setIsIdle] = useState(true) // Start idle for Hero
    const [currentShot, setCurrentShot] = useState(0)
    const [isAtTop, setIsAtTop] = useState(window.scrollY < 10)
    const lastActivity = useRef(Date.now())
    const controlsRef = useRef()

    const shots = [
        { pos: [8, 2, 8], target: [0, 0.5, 0], fov: 35 },     // Classic 3/4 Front
        { pos: [-9, 1.5, 0], target: [0, 0.4, 0], fov: 30 },  // Side Profile
        { pos: [0, 2, -10], target: [0, 0.6, 0], fov: 40 },   // Rear High
        { pos: [4, 0.2, 5], target: [0, 0.2, 0], fov: 25 },   // Low Front Detail
        { pos: [0, 8, 2], target: [0, 0, 0], fov: 45 },      // Top Down
    ]

    useCarAnimation(isPreviewMode || (isIdle && isAtTop), orbitAngle);

    // Activity & Scroll Detection
    useEffect(() => {
        const handleScroll = () => {
            const top = window.scrollY < 10
            setIsAtTop(top)
            if (!top) {
                lastActivity.current = Date.now()
                setIsIdle(false)
            }
        }

        const handleMove = () => {
            lastActivity.current = Date.now()
            if (isIdle) setIsIdle(false)
        }

        window.addEventListener('scroll', handleScroll)
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mousedown', handleMove)
        window.addEventListener('touchstart', handleMove)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mousedown', handleMove)
            window.removeEventListener('touchstart', handleMove)
        }
    }, [isIdle])

    // Idle Timer & Sequencer
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            // If in Preview OR at Hero top, check for idle
            if (isPreviewMode || isAtTop) {
                if (now - lastActivity.current > 5000 && !isIdle) {
                    setIsIdle(true)
                }
            }
        }, 1000)

        const shotInterval = setInterval(() => {
            if (isIdle) {
                setCurrentShot(prev => (prev + 1) % shots.length)
            }
        }, 8000)

        return () => {
            clearInterval(interval)
            clearInterval(shotInterval)
        }
    }, [isPreviewMode, isAtTop, isIdle])

    useEffect(() => {
        if (isIdle && (isPreviewMode || isAtTop)) {
            const shot = shots[currentShot]
            gsap.to(camera.position, {
                x: shot.pos[0],
                y: shot.pos[1],
                z: shot.pos[2],
                duration: 2.5,
                ease: "power2.inOut"
            })
            gsap.to(camera, {
                fov: shot.fov,
                duration: 2.5,
                onUpdate: () => camera.updateProjectionMatrix()
            })
        }
    }, [currentShot, isIdle, isPreviewMode, isAtTop])

    useFrame((state, delta) => {
        if (!isPreviewMode && !isIdle) {
            if (modelRef.current) {
                modelRef.current.rotation.y = gsap.utils.interpolate(modelRef.current.rotation.y, 0, 0.1);
            }
            camera.lookAt(0, 0.3, 0);
        } else if (isIdle) {
            // Slow cinematic drift 
            const time = state.clock.getElapsedTime()
            camera.position.x += Math.sin(time * 0.15) * 0.003
            camera.position.y += Math.cos(time * 0.15) * 0.001
            camera.lookAt(0, 0.4, 0)
        }
    })

    const onUserInteraction = () => {
        // This function is now largely redundant as activity is tracked globally
        // but can be kept for specific OrbitControls interactions if needed.
        lastActivity.current = Date.now()
        if (isIdle) setIsIdle(false)
    }

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
            {(isPreviewMode || isAtTop) && (
                <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    autoRotate={!isIdle && !isAtTop}
                    autoRotateSpeed={0.5}
                    enableZoom={isPreviewMode}
                    enablePan={false}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 1.75}
                    minDistance={4}
                    maxDistance={15}
                    enableDamping
                    dampingFactor={0.05}
                    onChange={onUserInteraction}
                    onStart={onUserInteraction}
                />
            )}
            {/* ... rest of light and model code stays same ... */}
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
