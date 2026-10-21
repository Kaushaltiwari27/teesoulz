'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface Slide {
  id: string;
  tag: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  mobileImage: string;
  specs: { label: string; value: string }[];
}

const SLIDES: Slide[] = [
  {
    id: '01',
    tag: 'AUTUMN / WINTER 2026 • DROP 01',
    title: 'NOIR',
    titleHighlight: 'MONOLITH',
    subtitle: 'HEAVYWEIGHT 280 GSM OVERSIZED TEE',
    description:
      'Engineered in custom-milled French Terry with architectural drop-shoulder tailoring. Designed in India for the global streetwear underground.',
    ctaText: 'EXPLORE DROP 01',
    ctaLink: '/collections/noir-monolith',
    secondaryCtaText: 'SHOP OVERSIZED',
    secondaryCtaLink: '/category/oversized-t-shirts',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85',
    mobileImage:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    specs: [
      { label: 'FABRIC', value: '280 GSM COMBED TERRY' },
      { label: 'SILHOUETTE', value: 'BOXY DROP-SHOULDER' },
      { label: 'COLLAR', value: '1.25" ZERO-SAG LYCRA' },
    ],
  },
  {
    id: '02',
    tag: 'ACID GRAPHIC SERIES • DROP 02',
    title: 'CYBER',
    titleHighlight: 'TOKYO',
    subtitle: 'TACTILE PUFF SILICONE PRINTS',
    description:
      'High-density Japanese typography and cyberpunk artwork screen-printed with crack-resistant relief ink on vintage washed black cotton.',
    ctaText: 'EXPLORE GRAPHICS',
    ctaLink: '/collections/cyber-tokyo',
    secondaryCtaText: 'VIEW ALL PRINTS',
    secondaryCtaLink: '/category/graphic-tees',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85',
    mobileImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    specs: [
      { label: 'TECHNIQUE', value: 'HIGH-DENSITY SILICONE PUFF' },
      { label: 'WASH', value: 'MINERAL ACID ENZYME' },
      { label: 'DURABILITY', value: '50+ CYCLES TESTED' },
    ],
  },
  {
    id: '03',
    tag: 'WINTER ARMOUR • DROP 03',
    title: 'ARCHITECTURAL',
    titleHighlight: 'HOODIES',
    subtitle: '400 GSM DOUBLE-FLEECE HEAVYWEIGHT',
    description:
      'Double-layered crossover neck with no drawstrings. Seamless drop shoulders and hidden deep side seam pockets for an uncompromised clean aesthetic.',
    ctaText: 'SHOP HOODIES',
    ctaLink: '/category/hoodies-sweatshirts',
    secondaryCtaText: 'SWEATSHIRTS',
    secondaryCtaLink: '/category/hoodies-sweatshirts',
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2000&q=85',
    mobileImage:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
    specs: [
      { label: 'WEIGHT', value: '400 GSM BRUSHED FLEECE' },
      { label: 'HOOD', value: 'DOUBLE-LAYERED STRUCTURED' },
      { label: 'POCKETS', value: 'SEAMLESS SIDE ENTRY' },
    ],
  },
  {
    id: '04',
    tag: 'RAW MINIMALISM • DROP 04',
    title: 'STREETWEAR',
    titleHighlight: 'ESSENTIALS',
    subtitle: 'UNBRANDED LUXURY HEAVYWEIGHT BASICS',
    description:
      'Pure monochromatic perfection. 240 GSM combed cotton blanks with zero-sag necklines and clean double-needle hems for timeless everyday rotation.',
    ctaText: 'SHOP ESSENTIALS',
    ctaLink: '/shop',
    secondaryCtaText: 'VIEW LOOKBOOK',
    secondaryCtaLink: '/about',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=85',
    mobileImage:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    specs: [
      { label: 'PURITY', value: '100% COMBED COTTON' },
      { label: 'FINISH', value: 'BIO-WASHED SOFT HAND' },
      { label: 'FIT', value: 'BOXY RELAXED SILHOUETTE' },
    ],
  },
];

export default function HeroCampaign() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentSlide = SLIDES[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-play timer (changes automatically every 3 seconds)
  useEffect(() => {
    // Reset and animate progress bar for 3 seconds
    if (progressBarRef.current) {
      gsap.killTweensOf(progressBarRef.current);
      gsap.fromTo(
        progressBarRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 3,
          ease: 'none',
        }
      );
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      clearInterval(timer);
      if (progressBarRef.current) {
        gsap.killTweensOf(progressBarRef.current);
      }
    };
  }, [currentIndex, nextSlide]);

  // GSAP text animations on slide change
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.slide-text-elem',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [currentIndex]);

  return (
    <section
      className="relative w-full bg-[#080808] text-white overflow-hidden border-b border-[#222222]"
    >
      {/* Editorial Split / Layered Container */}
      <div className="relative min-h-[660px] sm:min-h-[780px] lg:min-h-[860px] w-full flex items-center">
        
        {/* Full-Bleed Editorial Model Images (Crossfade Transition) */}
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Desktop Image */}
              <div className="absolute inset-0 hidden sm:block">
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover object-center filter contrast-105 brightness-90 transition-transform duration-10000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>

              {/* Mobile Image */}
              <div className="absolute inset-0 block sm:hidden">
                <Image
                  src={slide.mobileImage}
                  alt={slide.subtitle}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center filter contrast-105 brightness-80"
                />
              </div>

              {/* High-Contrast Gradient Shadows For Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>
          );
        })}

        {/* Top Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: '0%' }}
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 pb-24 sm:pb-20 w-full">
          <div ref={contentRef} className="max-w-2xl space-y-4 sm:space-y-6">
            
            {/* Slide Tag & Live Drop Indicator */}
            <div className="slide-text-elem inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[#D4D4D4] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-xl">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-pulse" />
              <span>{currentSlide.tag}</span>
            </div>

            {/* Subtitle */}
            <div className="slide-text-elem text-[11px] sm:text-sm font-mono tracking-wider sm:tracking-widest text-[#B8B8B8] uppercase">
              {currentSlide.subtitle}
            </div>

            {/* Giant Streetwear Headline */}
            <h1 className="slide-text-elem text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] font-sans break-words">
              {currentSlide.title}
              <br />
              <span className="text-[#888888] font-light italic tracking-normal">
                {currentSlide.titleHighlight}.
              </span>
            </h1>

            {/* Description */}
            <p className="slide-text-elem text-xs sm:text-base text-[#D4D4D4] max-w-lg leading-relaxed font-normal">
              {currentSlide.description}
            </p>

            {/* Dual CTAs */}
            <div className="slide-text-elem pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
              <Link
                href={currentSlide.ctaLink}
                className="bg-white text-black hover:bg-[#E5E5E5] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-white/20"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>

              <Link
                href={currentSlide.secondaryCtaLink}
                className="bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black border border-white/40 hover:border-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center transition-all"
              >
                {currentSlide.secondaryCtaText}
              </Link>
            </div>

            {/* Real Streetwear Specs Bar */}
            <div className="slide-text-elem pt-4 sm:pt-6 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-6 max-w-lg">
              {currentSlide.specs.map((spec, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    {spec.label}
                  </div>
                  <div className="text-[11px] sm:text-sm font-bold text-white font-mono leading-tight">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Editorial Slider Navigation Controls */}
        <div className="absolute bottom-4 sm:bottom-6 right-3 sm:right-8 lg:right-12 z-20 flex items-center gap-2 sm:gap-3 bg-black/80 backdrop-blur-md border border-white/20 p-1.5 sm:p-2 rounded-none">
          {/* Slide Index Counter */}
          <div className="px-2 sm:px-3 text-[11px] sm:text-xs font-mono tracking-widest text-[#B8B8B8] flex items-center gap-1 sm:gap-1.5">
            <span className="text-white font-bold text-xs sm:text-sm">{currentSlide.id}</span>
            <span className="text-white/40">/</span>
            <span>0{SLIDES.length}</span>
          </div>

          {/* Prev Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Slide Thumbnail Strip on Desktop */}
        <div className="hidden lg:flex flex-col gap-2 absolute top-1/2 -translate-y-1/2 right-8 z-20">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`group relative text-right flex items-center gap-3 transition-all ${
                  isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
              >
                <span className="text-[10px] font-mono tracking-wider text-white hidden xl:inline uppercase">
                  {slide.title}
                </span>
                <span
                  className={`block transition-all ${
                    isActive
                      ? 'w-8 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-4 h-1 bg-white/40 group-hover:w-6'
                  }`}
                />
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
