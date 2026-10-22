'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CampaignBannerProps {
  title?: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  desktopImage: string;
  mobileImage?: string;
  altText: string;
  position?: 'center' | 'left' | 'right';
}

export default function CampaignBanner({
  title,
  subtitle,
  buttonText,
  buttonLink,
  desktopImage,
  mobileImage,
  altText,
  position = 'center',
}: CampaignBannerProps) {
  const alignClasses =
    position === 'left'
      ? 'items-start text-left left-6 sm:left-12'
      : position === 'right'
      ? 'items-end text-right right-6 sm:right-12'
      : 'items-center text-center inset-x-6';

  return (
    <section className="w-full bg-[#111111] py-2 sm:py-4">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <Link
          href={buttonLink}
          className="group relative block w-full overflow-hidden rounded-[4px] sm:rounded-[8px]"
        >
          {/* Banner Container */}
          <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full overflow-hidden bg-black">
            {/* Desktop Image */}
            <Image
              src={desktopImage}
              alt={altText}
              fill
              sizes="100vw"
              className="object-cover object-center transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />

            {/* Content Overlay */}
            <div className={`absolute bottom-6 sm:bottom-10 z-10 flex flex-col ${alignClasses}`}>
              {title && (
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md mb-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-base text-gray-200 font-medium max-w-lg mb-4 drop-shadow-sm">
                  {subtitle}
                </p>
              )}
              <span className="inline-flex items-center justify-center px-7 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white border border-white rounded-[4px] bg-black/30 backdrop-blur-xs transition-all duration-300 group-hover:bg-white group-hover:text-black">
                {buttonText}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
