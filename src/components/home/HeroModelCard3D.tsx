'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Eye, Layers, Sparkles, Box, CheckCircle2 } from 'lucide-react';

interface AngleView {
  id: string;
  label: string;
  image: string;
  alt: string;
  title: string;
}

const VIEWS: AngleView[] = [
  {
    id: 'front',
    label: '01 / FRONT FIT',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    alt: 'Noir Heavyweight Front View',
    title: 'Drop-Shoulder Boxy Silhouette',
  },
  {
    id: 'quarter',
    label: '02 / 3D ANGLE',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    alt: 'Noir Heavyweight 3D Silhouette Angle',
    title: 'Architectural Streetwear Drape',
  },
  {
    id: 'back',
    label: '03 / REAR GRAPHIC',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    alt: 'Back Graphic Typography',
    title: 'High-Density Monochrome Graphic',
  },
  {
    id: 'fabric',
    label: '04 / 3D TEXTURE',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
    alt: 'Heavyweight 280 GSM Fabric Texture',
    title: 'Custom-Milled 280 GSM French Terry',
  },
];

interface Hotspot {
  id: string;
  top: string;
  left: string;
  label: string;
  detail: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'collar',
    top: '24%',
    left: '52%',
    label: 'ZERO-SAG RIBBED COLLAR',
    detail: '1.25-inch high-density spandex ribbing that retains structure after 50+ wash cycles.',
  },
  {
    id: 'print',
    top: '42%',
    left: '38%',
    label: '3D SILICONE RELIEF PRINT',
    detail: 'Multi-pass tactile micro-embossed streetwear emblem with chrome sheen.',
  },
  {
    id: 'fabric',
    top: '68%',
    left: '58%',
    label: '280 GSM FRENCH TERRY',
    detail: '100% long-staple combed cotton engineered for all-season climate comfort.',
  },
];

export default function HeroModelCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<string>('front');
  const [wireframeActive, setWireframeActive] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>('print');
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});

  const currentView = VIEWS.find((v) => v.id === activeView) || VIEWS[0];

  // Mouse Move 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    // Realistic glare effect
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.6s ease',
    });
  };

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* 3D Ambient Glow Backing */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-2xl blur-xl opacity-60 animate-pulse pointer-events-none" />

      {/* Main 3D Interactive Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="relative bg-[#0d0d0d] border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group cursor-crosshair select-none"
      >
        {/* Dynamic Specular 3D Glare Sheen */}
        <div
          style={glareStyle}
          className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay transition-opacity"
        />

        {/* Blender Viewport HUD Header Bar */}
        <div className="relative z-20 px-4 py-2.5 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold tracking-wider">3D MODEL VIEWPORT</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-xs text-[#888] hidden sm:inline">50mm f/1.2</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Wireframe Toggle Button */}
            <button
              type="button"
              onClick={() => setWireframeActive(!wireframeActive)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all border ${
                wireframeActive
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-white/5 text-[#B8B8B8] border-white/15 hover:border-white/40'
              }`}
              title="Toggle 3D Wireframe Mesh"
            >
              <Box className="w-3 h-3" />
              <span>{wireframeActive ? 'WIREFRAME ON' : '3D MESH'}</span>
            </button>

            <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[9px] font-bold tracking-widest uppercase">
              CYCLES 3D
            </span>
          </div>
        </div>

        {/* Model Visual Stage */}
        <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#050505]">
          <Image
            src={currentView.image}
            alt={currentView.alt}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority
            className="object-cover object-center filter contrast-105 brightness-95 transition-all duration-700 ease-out group-hover:scale-105"
          />

          {/* Holographic 3D Wireframe Mesh Overlay */}
          {wireframeActive && (
            <div
              className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-70"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
              <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 border border-white/30 text-[10px] font-mono text-white">
                POLYGONS: 48,200 | UV: UNWRAPPED
              </div>
            </div>
          )}

          {/* Studio Vignette & Edge Shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

          {/* Interactive 3D Hotspot Pins */}
          {HOTSPOTS.map((hotspot) => {
            const isSelected = activeHotspot === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{ top: hotspot.top, left: hotspot.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(isSelected ? null : hotspot.id)}
                  onMouseEnter={() => setActiveHotspot(hotspot.id)}
                  className="relative group/pin focus:outline-none"
                  aria-label={hotspot.label}
                >
                  {/* Radar Ripple Effect */}
                  <span className="absolute -inset-2 rounded-full bg-white/30 animate-ping opacity-75" />
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-black/90 border-2 border-white text-white shadow-xl transition-transform hover:scale-125">
                    <Sparkles className="w-3 h-3 text-white" />
                  </span>
                </button>

                {/* 3D Hotspot Callout Tooltip */}
                {isSelected && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 bg-black/95 backdrop-blur-xl border border-white/30 text-white rounded-lg shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#B8B8B8] mb-1">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>{hotspot.label}</span>
                    </div>
                    <p className="text-xs text-white/90 leading-tight">
                      {hotspot.detail}
                    </p>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-white/30 rotate-45" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Floating Model Feature Badges (3D Depth) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/30 text-white text-[11px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              HEAVYWEIGHT 280 GSM
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#D4D4D4] text-[10px] font-mono tracking-wider">
              {currentView.title}
            </span>
          </div>

          {/* Bottom Interactive Angle Selector */}
          <div className="absolute bottom-3 inset-x-3 z-20 bg-black/85 backdrop-blur-md border border-white/15 p-1.5 rounded-lg">
            <div className="grid grid-cols-4 gap-1">
              {VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`py-1.5 px-1 rounded text-[10px] font-mono text-center transition-all ${
                    activeView === view.id
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-[#888888] hover:text-white hover:bg-white/10'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport Meta Footer */}
        <div className="px-4 py-3 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#B8B8B8]" />
            <span className="text-[#B8B8B8] font-mono text-[11px]">
              INTERACTION: TILT MOUSE • TAP HOTSPOTS
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            TEESOULZ LABS 3D
          </span>
        </div>
      </div>
    </div>
  );
}
