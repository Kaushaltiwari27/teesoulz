'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CampaignSlide {
  id?: string;
  title?: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  desktopImage: string;
  mobileImage?: string;
  altText: string;
  position?: 'center' | 'left' | 'right';
}

interface CampaignBannerProps {
  slides?: CampaignSlide[];
  // Single slide backward-compatibility props
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  desktopImage?: string;
  mobileImage?: string;
  altText?: string;
  position?: 'center' | 'left' | 'right';
  autoplayInterval?: number;
}

export default function CampaignBanner({
  slides,
  title,
  subtitle,
  buttonText = 'Shop Now',
  buttonLink = '/shop',
  desktopImage,
  mobileImage,
  altText = 'TEESOULZ Drop',
  position = 'center',
  autoplayInterval = 5000,
}: CampaignBannerProps) {
  // Build slide list (max 5 slides)
  const slideList: CampaignSlide[] = React.useMemo(() => {
    if (slides && slides.length > 0) {
      return slides.slice(0, 5);
    }
    if (desktopImage) {
      return [
        {
          title,
          subtitle,
          buttonText,
          buttonLink,
          desktopImage,
          mobileImage,
          altText,
          position,
        },
      ];
    }
    return [];
  }, [slides, title, subtitle, buttonText, buttonLink, desktopImage, mobileImage, altText, position]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [keyCounter, setKeyCounter] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto-rotate every 5 seconds (5000ms) when multiple slides exist
  useEffect(() => {
    if (slideList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideList.length);
      setKeyCounter((k) => k + 1);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [slideList.length, autoplayInterval, currentSlide]);

  const nextSlide = useCallback(() => {
    if (slideList.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slideList.length);
    setKeyCounter((k) => k + 1);
  }, [slideList.length]);

  const prevSlide = useCallback(() => {
    if (slideList.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length);
    setKeyCounter((k) => k + 1);
  }, [slideList.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setKeyCounter((k) => k + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  if (slideList.length === 0) return null;

  return (
    <section
      aria-label="Campaign Banner Slideshow"
      className="relative w-full bg-white py-2 sm:py-4 select-none"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative block w-full overflow-hidden rounded-[4px] sm:rounded-[8px] bg-black"
        >
          {/* Banner Container */}
          <div className="relative aspect-[4/3] sm:aspect-[16/7] md:aspect-[21/9] min-h-[260px] sm:min-h-0 w-full overflow-hidden">
            {slideList.map((slide, idx) => {
              const isActive = idx === currentSlide;
              const pos = slide.position || 'center';
              const alignClasses =
                pos === 'left'
                  ? 'items-start text-left left-6 sm:left-12'
                  : pos === 'right'
                  ? 'items-end text-right right-6 sm:right-12'
                  : 'items-center text-center inset-x-4 sm:inset-x-6';

              return (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={slide.desktopImage}
                      alt={slide.altText}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      className={`object-cover object-[center_top] transition-transform duration-[6000ms] ease-out will-change-transform ${
                        isActive ? 'scale-[1.02]' : 'scale-100'
                      }`}
                    />

                    {/* Gradient Overlay for high text contrast */}
                    <div className="absolute inset-0 bg-black/40 sm:bg-black/35 transition-colors duration-300" />
                  </div>

                  {/* Content Overlay */}
                  <div className={`absolute bottom-8 sm:bottom-12 z-10 flex flex-col ${alignClasses}`}>
                    {slide.title && (
                      <h3 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md mb-1.5 sm:mb-2 font-sans">
                        {slide.title}
                      </h3>
                    )}
                    {slide.subtitle && (
                      <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium max-w-lg mb-3 sm:mb-4 drop-shadow-sm line-clamp-2 sm:line-clamp-none">
                        {slide.subtitle}
                      </p>
                    )}
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center justify-center px-7 py-2.5 sm:px-9 sm:py-3 text-xs sm:text-sm font-black tracking-wider uppercase text-black bg-white rounded-[4px] shadow-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
                    >
                      <span>{slide.buttonText}</span>
                    </Link>
                  </div>

                  {/* Background Link overlay */}
                  <Link
                    href={slide.buttonLink}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 focus:outline-hidden"
                  />
                </div>
              );
            })}
          </div>

          {/* Left/Right manual navigation arrows */}
          {slideList.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black text-white border border-white/20 items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden touch-manipulation shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black text-white border border-white/20 items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 focus:outline-hidden touch-manipulation shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* 5-Slide Circular/Pill Progress Indicators */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
                {slideList.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <button
                      key={slide.id || idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className="relative h-2 rounded-full transition-all duration-300 focus:outline-hidden touch-manipulation overflow-hidden"
                      style={{
                        width: isActive ? '28px' : '8px',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {isActive && (
                        <span
                          key={`progress-${idx}-${keyCounter}`}
                          className="absolute inset-0 bg-white rounded-full origin-left"
                          style={{
                            animation: `bannerFillProgress ${autoplayInterval}ms linear forwards`,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bannerFillProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
