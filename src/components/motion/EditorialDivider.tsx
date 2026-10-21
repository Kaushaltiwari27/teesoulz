'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EditorialDividerProps {
  index?: string;
  label?: string;
  className?: string;
}

export default function EditorialDivider({
  index,
  label,
  className = '',
}: EditorialDividerProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`w-full py-4 overflow-hidden select-none ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#888888] uppercase mb-2">
        {index && <span>{index}</span>}
        {label && <span className="text-[#666666]">{label}</span>}
      </div>
      <div className="relative w-full h-[1px] bg-[#E5E5E5] dark:bg-[#222222] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-black dark:bg-white h-full"
          style={{
            width: isInView ? '100%' : '0%',
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'width',
          }}
        />
      </div>
    </div>
  );
}
