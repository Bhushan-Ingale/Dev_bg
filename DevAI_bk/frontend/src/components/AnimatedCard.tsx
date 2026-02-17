'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tilt?: boolean;
}

export default function AnimatedCard({ children, className = '', delay = 0, tilt = true }: AnimatedCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const cardContent = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );

  if (tilt) {
    return (
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1500}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffde22"
      >
        {cardContent}
      </Tilt>
    );
  }

  return cardContent;
}