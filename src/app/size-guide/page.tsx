'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Info, ArrowRight } from 'lucide-react';

const SIZE_CHART = [
  { size: 'XS', chestIn: '40"', chestCm: '101 cm', lengthIn: '27.5"', lengthCm: '70 cm', shoulderIn: '21"', shoulderCm: '53 cm' },
  { size: 'S', chestIn: '42"', chestCm: '106 cm', lengthIn: '28.5"', lengthCm: '72 cm', shoulderIn: '22"', shoulderCm: '56 cm' },
  { size: 'M', chestIn: '44"', chestCm: '112 cm', lengthIn: '29.5"', lengthCm: '75 cm', shoulderIn: '23"', shoulderCm: '58 cm' },
  { size: 'L', chestIn: '46"', chestCm: '117 cm', lengthIn: '30.5"', lengthCm: '77 cm', shoulderIn: '24"', shoulderCm: '61 cm' },
  { size: 'XL', chestIn: '48"', chestCm: '122 cm', lengthIn: '31.5"', lengthCm: '80 cm', shoulderIn: '25"', shoulderCm: '63 cm' },
  { size: 'XXL', chestIn: '50"', chestCm: '127 cm', lengthIn: '32.5"', lengthCm: '82 cm', shoulderIn: '26"', shoulderCm: '66 cm' },
];

export default function MasterSizeGuidePage() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            TAILORING & SPECS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black mt-1">
            STREETWEAR SIZE & FIT GUIDE
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-2 max-w-xl leading-relaxed">
            Every TEESOULZ piece is patterned from scratch to achieve the quintessential streetwear drape. Review our measurements below to choose your ideal silhouette.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-black">Unit Measurement:</span>
            <div className="flex bg-[#E5E5E5] p-1 rounded-xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition-colors ${
                  unit === 'in' ? 'bg-black text-white' : 'text-[#666666] hover:text-black'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition-colors ${
                  unit === 'cm' ? 'bg-black text-white' : 'text-[#666666] hover:text-black'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#555555]">
            <Info className="w-3.5 h-3.5 text-black" />
            <span>Tolerance margin: ±0.5 inches due to manual cutting.</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E5E5E5]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080808] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-bold">Size</th>
                <th className="py-3.5 px-4 font-bold">Chest ({unit})</th>
                <th className="py-3.5 px-4 font-bold">Garment Length ({unit})</th>
                <th className="py-3.5 px-4 font-bold">Shoulder Drop ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-black">{row.size}</td>
                  <td className="py-3.5 px-4 text-[#333333] font-medium">
                    {unit === 'in' ? row.chestIn : row.chestCm}
                  </td>
                  <td className="py-3.5 px-4 text-[#333333] font-medium">
                    {unit === 'in' ? row.lengthIn : row.lengthCm}
                  </td>
                  <td className="py-3.5 px-4 text-[#333333] font-medium">
                    {unit === 'in' ? row.shoulderIn : row.shoulderCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-5 border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">1. CHEST CIRCUMFERENCE</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Place the tape measure under your arms and across the fullest part of your chest. Keep the tape comfortably snug but not constricting.
            </p>
          </div>

          <div className="p-5 border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">2. TOTAL BODY LENGTH</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Measure from the high point of the shoulder seam straight down to the bottom hemline of the tee.
            </p>
          </div>

          <div className="p-5 border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">3. SHOULDER SEAM DROP</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              Our seams drop 2 to 3 inches below standard clavicle seams to create the hallmark streetwear silhouette without restricting arm mobility.
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#080808] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Uncertain about your size?</h4>
            <p className="text-xs text-[#CCCCCC]">We offer 100% free doorstep size exchanges on all orders.</p>
          </div>
          <Link
            href="/shop"
            className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#E5E5E5] transition-colors flex items-center gap-1.5"
          >
            <span>Shop All Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
