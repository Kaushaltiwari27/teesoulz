'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  lines: (string | React.ReactNode)[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
}

export default function TextReveal({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.12,
  duration = 0.9,
  as: Component = 'div',
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={containerRef as any} className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden leading-[1.05]">
          <span
            className={`block will-change-transform ${lineClassName}`}
            style={{
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)',
              opacity: isVisible ? 1 : 0.2,
              transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${
                delay + idx * stagger
              }s, opacity ${duration * 0.8}s ease ${delay + idx * stagger}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
