import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

// A reusable hook to apply the exact same GSAP scroll sequence to any 3D car model 
export const useCarAnimation = (isPreviewMode, orbitAngle) => {
    const { camera } = useThree()
    const tl = useRef()

    useLayoutEffect(() => {
        // Set an impressive default 3/4 "game lobby" camera position
        camera.position.set(3, 1.5, 6);

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
                .fromTo(camera.position,
                    { x: 3, y: 1.5, z: 6 },
                    { x: -3, y: 0.5, z: 4, duration: 1 }
                )
                // 2. Wheel View
                .to(camera.position, { x: -2, y: -0.2, z: 2, duration: 1 })
                // 3. Rear Wing View
                .to(camera.position, { x: 0, y: 1.5, z: -5, duration: 1 })
                // 4. Front View Engine
                .to(camera.position, { x: 3, y: 1, z: 5, duration: 1 })
        });

        return () => ctx.revert();
    }, [camera])

    // Effect to toggle scroll control vs preview orbit control
    useLayoutEffect(() => {
        if (tl.current && tl.current.scrollTrigger) {
            if (isPreviewMode) {
                // Disable scrub to hand over control to useFrame
                tl.current.scrollTrigger.disable(false);
                // Store current angle for smooth transition into orbit
                orbitAngle.current = Math.atan2(camera.position.x, camera.position.z);
            } else {
                // Enable scrub back
                tl.current.scrollTrigger.enable(false);

                // Force GSAP to re-apply the camera position for the current scroll progress.
                // We nudge the progress slightly back and forth to bypass GSAP's optimization 
                // that skips rendering if it thinks the progress value hasn't changed.
                const p = tl.current.progress();
                tl.current.progress(p === 1 ? 0.999 : p + 0.001);
                tl.current.progress(p);
            }
        }
    }, [isPreviewMode, camera])

    return tl;
}
