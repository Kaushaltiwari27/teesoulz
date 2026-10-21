'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ParallaxImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export default function ParallaxImage({
  src,
  alt,
  aspectRatio = 'aspect-[4/5]',
  priority = false,
  className = '',
  imageClassName = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  overlayClassName = '',
  children,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden bg-[#0A0A0A] ${className}`}
      style={{
        clipPath: isRevealed ? 'inset(0% 0% 0% 0%)' : 'inset(8% 8% 8% 8%)',
        transition: 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'clip-path',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
          isRevealed ? 'scale-100' : 'scale-110'
        } hover:scale-105 ${imageClassName}`}
      />
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
      {children}
    </div>
  );
}
