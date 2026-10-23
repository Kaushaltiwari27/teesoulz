'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
    id: 'drift-2',
    title: 'DRIFT 2.0 // NEW IN',
    subtitle: '280 GSM COMPACT YARN OVERSIZED DROP',
    link: '/new-in',
    desktopImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2800&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1080&h=1920&q=90',
  },
  {
    id: 'cyber-tokyo',
    title: 'CYBER TOKYO ARCHIVE',
    subtitle: 'DISCHARGE GRAPHICS & RAW ACID WASH',
    link: '/category/graphic-tees',
    desktopImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2800&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1080&h=1920&q=90',
  },
  {
    id: 'double-fleece',
    title: '400 GSM DOUBLE FLEECE',
    subtitle: 'STRUCTURAL HOODIES & WINTER SWEATSHIRTS',
    link: '/category/hoodies',
    desktopImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=2800&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1080&h=1920&q=90',
  },
  {
    id: 'tactical-bottoms',
    title: 'TACTICAL CARGOS',
    subtitle: 'PARACHUTE BOTTOMS & WIDE-LEG DRAPES',
    link: '/category/bottoms',
    desktopImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2800&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1080&h=1920&q=90',
  },
  {
    id: 'women-capsule',
    title: 'WOMEN STREET CAPSULE',
    subtitle: 'BOXY BOYFRIEND TEES & CROPPED FITS',
    link: '/shop?gender=women',
    desktopImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2800&q=90',
    mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1080&h=1920&q=90',
  },
];

const AUTOPLAY_INTERVAL = 5000; // Exact 5 seconds automatic slide rotation

export default function HeroCampaign() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide rotation every 5 seconds without blocking on mouse hover
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BONKERS_SLIDES.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BONKERS_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BONKERS_SLIDES.length) % BONKERS_SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  return (
    <section
      aria-label="Bonkers Corner Style Automatic 5-Second Hero Slideshow"
      className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
    >
      {/* Slideshow Container:
          Desktop: Full panoramic height (82vh - 86vh)
          Mobile: Full screen story height (82vh)
      */}
      <div className="relative w-full h-[75vh] sm:h-[84vh] lg:h-[88vh] min-h-[460px] sm:min-h-[520px]">
        {BONKERS_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Imagery with Subtle Ken-Burns Scaling */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Desktop High-Res Panoramic Image */}
                <div className="hidden sm:block relative w-full h-full">
                  <Image
                    src={slide.desktopImage}
                    alt={slide.title}
                    fill
                    priority={idx === 0 || idx === 1}
                    sizes="100vw"
                    className={`object-cover object-center transition-transform duration-[6000ms] ease-out will-change-transform ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>

                {/* Mobile High-Res Vertical Story Image */}
                <div className="sm:hidden relative w-full h-full">
                  <Image
                    src={slide.mobileImage}
                    alt={slide.title}
                    fill
                    priority={idx === 0 || idx === 1}
                    sizes="100vw"
                    className={`object-cover object-center transition-transform duration-[6000ms] ease-out will-change-transform ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>

                {/* Bonkers Corner Style Gradient Vignette Overlays for Maximum Contrast */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.75) 100%)',
                  }}
                />
              </div>

              {/* Slide Content: content-bottom-center (Bonkers Corner Exact Alignment) */}
              <div className="absolute inset-x-0 bottom-12 sm:bottom-16 flex flex-col items-center justify-end text-center z-20 px-4">
                <div className="max-w-3xl space-y-3.5">
                  {/* Subtitle Badge */}
                  <span className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#E5E5E5] bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                    {slide.subtitle}
                  </span>

                  {/* Split-text style H1 Heading */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg font-sans">
                    {slide.title}
                  </h2>

                  {/* Solid White Button (Bonkers Corner Style) */}
                  <div className="pt-1.5 sm:pt-2">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center px-6 sm:px-10 py-2.5 sm:py-3.5 bg-white text-black hover:bg-[#EAEAEA] font-black text-xs sm:text-sm uppercase tracking-wider rounded-[8px] sm:rounded-[10px] shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
                      role="button"
                      title="Shop Now"
                    >
                      <span>Shop Now</span>
                    </Link>
                  </div>
                </div>

                {/* Full Slide Link Overlay */}
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

      {/* Manual Left/Right Navigation Arrows - Hidden on extra-small mobile for maximum clean viewport */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black text-white border border-white/30 items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden shadow-lg touch-manipulation"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black text-white border border-white/30 items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden shadow-lg touch-manipulation"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bonkers Corner Style SVG Circular Pagination Dots with 5-Second Timer Progress */}
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

                {/* Active Indicator with 5s countdown SVG progress animation */}
                {isActive && (
                  <circle
                    key={`dot-prog-${idx}`}
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    fill="#ffffff"
                    strokeDasharray="50.26"
                    strokeDashoffset="0"
                    style={{
                      animation: `circleProgress ${AUTOPLAY_INTERVAL}ms linear forwards`,
                    }}
                    transform="rotate(-90 10 10)"
                  />
                )}
              </svg>
            </button>
          );
        })}
      </div>

      {/* Keyframe animation for SVG progress countdown */}
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
