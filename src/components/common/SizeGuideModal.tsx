'use client';

import React, { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const SIZE_CHART = [
  { size: 'XS', chestIn: '40"', chestCm: '101 cm', lengthIn: '27.5"', lengthCm: '70 cm', shoulderIn: '21"', shoulderCm: '53 cm' },
  { size: 'S', chestIn: '42"', chestCm: '106 cm', lengthIn: '28.5"', lengthCm: '72 cm', shoulderIn: '22"', shoulderCm: '56 cm' },
  { size: 'M', chestIn: '44"', chestCm: '112 cm', lengthIn: '29.5"', lengthCm: '75 cm', shoulderIn: '23"', shoulderCm: '58 cm' },
  { size: 'L', chestIn: '46"', chestCm: '117 cm', lengthIn: '30.5"', lengthCm: '77 cm', shoulderIn: '24"', shoulderCm: '61 cm' },
  { size: 'XL', chestIn: '48"', chestCm: '122 cm', lengthIn: '31.5"', lengthCm: '80 cm', shoulderIn: '25"', shoulderCm: '63 cm' },
  { size: 'XXL', chestIn: '50"', chestCm: '127 cm', lengthIn: '32.5"', lengthCm: '82 cm', shoulderIn: '26"', shoulderCm: '66 cm' },
];

export default function SizeGuideModal() {
  const { isSizeGuideOpen, closeSizeGuide } = useStore();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto sm:my-16 bg-white sm:shadow-2xl z-10 transition-all p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-black" />
            <h3 className="text-base font-bold uppercase tracking-tight text-[#080808]">
              Streetwear Size & Fit Guide
            </h3>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-1 text-[#666666] hover:text-black rounded-full"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit toggle & Fit notes */}
        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#F3F3F3] p-1 rounded-sm w-fit">
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

          <div className="text-xs text-[#555555] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-black flex-shrink-0" />
            <span>Garments are tailored intentionally in an <strong>Oversized Drop-Shoulder</strong> cut.</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E5E5E5] mt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080808] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Size</th>
                <th className="py-3 px-4 font-bold">Chest ({unit})</th>
                <th className="py-3 px-4 font-bold">Length ({unit})</th>
                <th className="py-3 px-4 font-bold">Shoulder Drop ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-4 font-bold text-black">{row.size}</td>
                  <td className="py-3 px-4 text-[#333333]">
                    {unit === 'in' ? row.chestIn : row.chestCm}
                  </td>
                  <td className="py-3 px-4 text-[#333333]">
                    {unit === 'in' ? row.lengthIn : row.lengthCm}
                  </td>
                  <td className="py-3 px-4 text-[#333333]">
                    {unit === 'in' ? row.shoulderIn : row.shoulderCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure guidance */}
        <div className="mt-6 bg-[#FAFAFA] border border-[#E5E5E5] p-4 text-xs space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-black text-[11px]">
            How to Measure For The Perfect Drape:
          </h4>
          <p className="text-[#555555]">
            <strong>1. Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal under your armpits.
          </p>
          <p className="text-[#555555]">
            <strong>2. Length:</strong> Measure from the highest point of the shoulder down to the desired hemline.
          </p>
          <p className="text-[#555555]">
            <strong>3. Sizing Advice:</strong> If you prefer the authentic slouchy, relaxed streetwear boxy fit, order your regular true size. If you want a tighter or conventional fit, size down by one.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={closeSizeGuide}
            className="bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-black transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
