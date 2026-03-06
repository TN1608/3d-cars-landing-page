import { Environment, ContactShadows, MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useCarAnimation } from '../../hooks/useCarAnimation'

import { Model as MclarenGt3 } from './Mclaren_gt3'
import { Model as MclarenW1 } from './Mclaren_w1'
import { Model as MclarenF1 } from './Mclaren_f1_gtr_longtail'
import { Model as BmwM4 } from './Bmw_m4_widebody'

export const Experience = ({ isPreviewMode, activeCar }) => {
    const { camera } = useThree()
    const modelRef = useRef()
    const orbitAngle = useRef(0)

    // Reusable hook manages all the GSAP scroll animations
    useCarAnimation(isPreviewMode, orbitAngle);

    useFrame((state, delta) => {
        if (isPreviewMode) {
            // Cinematic Forza-style camera orbit
            orbitAngle.current += delta * 0.3; // Speed of orbit
            const radius = 7;

            const targetX = Math.sin(orbitAngle.current) * radius;
            const targetZ = Math.cos(orbitAngle.current) * radius;
            // Cinematic vertical bobbing
            const targetY = 1.2 + Math.sin(orbitAngle.current * 2) * 0.4;

            camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
        } else {
            // Smoothly lerp car rotation back to 0
            if (modelRef.current) {
                modelRef.current.rotation.y = gsap.utils.interpolate(modelRef.current.rotation.y, 0, 0.1);
            }
        }

        camera.lookAt(0, 0.5, 0);
    })

    const renderCar = () => {
        switch (activeCar) {
            case "mclaren_w1": return <MclarenW1 />;
            case "mclaren_f1_gtr_longtail": return <MclarenF1 scale={0.35} position={[0, -0.6, 0]} />;
            case "bmw_m4_widebody": return <BmwM4 scale={0.4} position={[0, -0.4, 0]} />;
            case "mclaren_gt3":
            default: return <MclarenGt3 />;
        }
    }

    return (
        <>
            {/* Minimal ambient - just enough to see shadowed areas, preserving contrast */}
            <ambientLight intensity={0.05} />

            {/* === KEY LIGHT === Strong single directional light from the upper-left front.
                This is the most important light for making paint look metallic not plastic.
                It creates sharp highlights and long shadows across body panels. */}
            <directionalLight
                position={[-8, 10, 6]}
                intensity={6}
                color="#fff8f0"
                castShadow
                shadow-bias={-0.0002}
                shadow-mapSize={[2048, 2048]}
            />

            {/* === FILL LIGHT === Much weaker from the opposite side to softly
                lift the shadows so you can still see detail in dark areas */}
            <directionalLight
                position={[8, 4, -4]}
                intensity={1.2}
                color="#c8d8ff"
            />

            {/* === RIM / BACK LIGHT === Strong backlight that traces the roofline
                and wing edges, separating the car from the dark background */}
            <spotLight
                position={[0, 6, -10]}
                angle={0.4}
                penumbra={0.8}
                intensity={10}
                color="#00cfff"
                target-position={[0, 0, 0]}
            />

            {/* === HEADLIGHT SIMULATION ===
                Two warm-white point lights near the front of the car,
                low and close, simulating actual DRL / headlight glow */}
            <pointLight position={[0.8, -0.1, 2.8]} intensity={3} color="#ffe8b0" distance={4} decay={2} />
            <pointLight position={[-0.8, -0.1, 2.8]} intensity={3} color="#ffe8b0" distance={4} decay={2} />

            {/* === TAILLIGHT SIMULATION ===
                Two deep-red point lights at the rear */}
            <pointLight position={[0.6, 0.1, -2.6]} intensity={2.5} color="#ff1a00" distance={3} decay={2} />
            <pointLight position={[-0.6, 0.1, -2.6]} intensity={2.5} color="#ff1a00" distance={3} decay={2} />

            {/* Subtle orange accent from the lower right for the Asphalt 9 / Forza look */}
            <pointLight position={[6, -0.5, 4]} intensity={4} color="#ff6600" distance={12} decay={2} />

            {/* High-quality environment for PBR reflections; keep intensity LOW
                so the manual lights dominate (avoids the flat-plastic look) */}
            <Environment preset="warehouse" environmentIntensity={0.25} />

            <Suspense fallback={null}>
                <group ref={modelRef} scale={1.2} position={[0, -0.6, 0]}>
                    <group position={[0, 0.6, 0]}>
                        {renderCar()}
                    </group>
                </group>
            </Suspense>

            {/* Glossy Showroom Floor */}
            <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={15}
                    roughness={0.4}
                    depthScale={1}
                    minDepthThreshold={0.8}
                    maxDepthThreshold={1.2}
                    color="#111111"
                    metalness={0.8}
                />
            </mesh>

            {/* Core Sharp Shadow to firmly ground the car on the reflective floor */}
            <ContactShadows
                position={[0, -0.64, 0]}
                opacity={0.7}
                scale={10}
                blur={1}
                resolution={1024}
                far={1.5}
            />

            {/* Wide Soft Ambient Shadow to blend the harsh edges */}
            <ContactShadows
                position={[0, -0.64, 0]}
                opacity={0.4}
                scale={25}
                blur={4}
                resolution={512}
                far={2.5}
            />
        </>
    )
}
