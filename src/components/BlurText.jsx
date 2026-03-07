import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlurText = ({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  animationFrom,
  animationTo,
  easing = 'power3.out',
  onAnimationComplete,
}) => {
  const containerRef = useRef(null);
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  useGSAP(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.blur-item');

    const fromVars = {
      filter: 'blur(10px)',
      opacity: 0,
      y: direction === 'top' ? -30 : 30,
      ...animationFrom
    };

    const toVars = {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      ...animationTo,
      duration: 1,
      stagger: delay / 1000,
      ease: easing,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse",
        // markers: true, // Uncomment for debugging
      },
      onComplete: onAnimationComplete
    };

    gsap.fromTo(items, fromVars, toVars);
  }, { dependencies: [text, direction], scope: containerRef });

  return (
    <p ref={containerRef} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => (
        <span
          key={index}
          className="blur-item inline-block will-change-[transform,filter,opacity] whitespace-pre"
        >
          {segment === '' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  );
};

export default BlurText;
