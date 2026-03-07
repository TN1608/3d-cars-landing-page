import { useLayoutEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useCarAnimation = (isPreviewMode, isIdleCinematicActive) => {
    const { camera } = useThree();
    const tl = useRef();

    // We animate this dummy object instead of the camera directly.
    // This allows Experience.jsx to take control (via orbit controls or cinematic idle)
    // without ScrollTrigger fighting for the exact coordinates.
    const scrollTarget = useRef(new THREE.Vector3(3, 1.5, 6)).current;

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            tl.current = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrubbing
                }
            })

            tl.current
                // 1. Side View
                .fromTo(scrollTarget,
                    { x: 3, y: 1.5, z: 6 },
                    { x: -3, y: 0.5, z: 4, duration: 1 }
                )
                // 2. Wheel View
                .to(scrollTarget, { x: -2, y: -0.2, z: 2, duration: 1 })
                // 3. Rear Wing View
                .to(scrollTarget, { x: 0, y: 1.5, z: -5, duration: 1 })
                // 4. Front View Engine
                .to(scrollTarget, { x: 3, y: 1, z: 5, duration: 1 })
        });

        return () => ctx.revert();
    }, [scrollTarget]);

    // Continuously lerp the actual camera towards the GSAP-controlled scrollTarget,
    // ONLY IF we are not in preview mode and not playing the idle cinematic.
    useFrame((state, delta) => {
        if (!isPreviewMode && !isIdleCinematicActive.current) {
            // Lerp from current position (which might be a cinematic position) 
            // back to the scrollTarget. High speed (4.5) for a snappy return to scroll sync.
            camera.position.lerp(scrollTarget, delta * 4.5);
            camera.lookAt(0, 0.3, 0);
        }
    });

    return tl;
}
