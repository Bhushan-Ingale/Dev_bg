'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger fade in for cards
      gsap.from('.gsap-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Parallax effect
      gsap.to('.parallax-bg', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -100,
        ease: 'none',
      });

      // Number counting animation
      gsap.utils.toArray('.count-number').forEach((number: any) => {
        ScrollTrigger.create({
          trigger: number,
          start: 'top 80%',
          onEnter: () => {
            gsap.from(number, {
              textContent: 0,
              duration: 2,
              snap: { textContent: 1 },
              ease: 'power1.inOut',
            });
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}