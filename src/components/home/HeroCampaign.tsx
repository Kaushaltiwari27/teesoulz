'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  desktopImage: string;
  mobileImage: string;
}

const BONKERS_SLIDES: SlideItem[] = [
  {
    id: 'explore-new-in',
    title: 'EXPLORE NEW IN',
    subtitle: 'AUTUMN / WINTER 2026 HEAVYWEIGHT DROPS',
    link: '/new-in',
    desktopImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2800&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1080&h=1920&q=85',
  },
  {
    id: 'drift-2',
    title: 'DRIFT 2.0',
    subtitle: '280 GSM COMPACT YARN OVERSIZED TEES',
    link: '/category/oversized-t-shirts',
    desktopImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2800&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1080&h=1920&q=85',
  },
  {
    id: 'double-fleece',
    title: '400 GSM DOUBLE FLEECE',
    subtitle: 'STRUCTURAL HOODIES & HEAVY SWEATSHIRTS',
    link: '/category/hoodies',
    desktopImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2800&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1080&h=1920&q=85',
  },
  {
    id: 'tactical-bottoms',
    title: 'TACTICAL CARGOS',
    subtitle: 'PARACHUTE BOTTOMS & WIDE-LEG DRAPES',
    link: '/category/bottoms',
    desktopImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=2800&q=85',
    mobileImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1080&h=1920&q=85',
  },
];

const AUTOPLAY_SPEED = 5000;

export default function HeroCampaign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BONKERS_SLIDES.length);
    setProgressKey((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BONKERS_SLIDES.length) % BONKERS_SLIDES.length);
    setProgressKey((prev) => prev + 1);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgressKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_SPEED);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  return (
    <section
      aria-label="Bonkers Corner Hero Slideshow"
      className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slideshow Container:
          Desktop: 2800/1000 ratio (~2.8:1 aspect) or min-h-[520px] max-h-[82vh]
          Mobile: Full screen story ratio min-h-[580px] h-[85vh]
      */}
      <div className="relative w-full h-[80vh] sm:h-[82vh] lg:h-[86vh] min-h-[520px]">
        {BONKERS_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Imagery */}
              <div className="absolute inset-0">
                {/* Desktop 2800x1000 Image */}
                <div className="hidden sm:block relative w-full h-full">
                  <Image
                    src={slide.desktopImage}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Mobile 1080x1920 Story Image */}
                <div className="sm:hidden relative w-full h-full">
                  <Image
                    src={slide.mobileImage}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Bonkers Corner Style Gradient Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
                  }}
                />
              </div>

              {/* Slide Content: content-bottom-center (Bonkers Corner Exact Alignment) */}
              <div className="absolute inset-x-0 bottom-12 sm:bottom-16 flex flex-col items-center justify-end text-center z-20 px-4">
                <div className="max-w-3xl space-y-3.5">
                  {/* Split-text style H1 Heading */}
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg font-sans">
                    {slide.title}
                  </h2>

                  {/* Button Overflow Container with Solid White Button */}
                  <div className="pt-1">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 bg-white text-black hover:bg-[#EAEAEA] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-[10px] shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                      role="button"
                      title="Shop Now"
                    >
                      <span>Shop Now</span>
                    </Link>
                  </div>
                </div>

                {/* Invisible link overlay covering the slide background */}
                <Link
                  href={slide.link}
                  className="absolute inset-0 -z-10 focus:outline-hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Previous/Next Navigation Chevrons */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black text-white border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black text-white border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bonkers Corner Style SVG Circular Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {BONKERS_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="relative w-5 h-5 flex items-center justify-center group focus:outline-hidden"
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                {/* Background Track Circle */}
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.5"
                  fill="none"
                  className="transition-colors group-hover:stroke-white/80"
                />

                {/* Active Indicator with radial progress stroke */}
                {isActive && (
                  <circle
                    key={`dot-prog-${progressKey}-${idx}`}
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    fill="#ffffff"
                    strokeDasharray="50.26"
                    strokeDashoffset="0"
                    style={{
                      animation: isPaused ? 'none' : `circleProgress ${AUTOPLAY_SPEED}ms linear forwards`,
                    }}
                    transform="rotate(-90 10 10)"
                  />
                )}
              </svg>
            </button>
          );
        })}
      </div>

      {/* Keyframe animation for SVG progress */}
      <style jsx>{`
        @keyframes circleProgress {
          from {
            stroke-dashoffset: 50.26;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
