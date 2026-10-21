import React, { Suspense } from 'react';
import ShopClient from './ShopClient';

export const metadata = {
  title: 'Shop All Streetwear Drops — TEESOULZ',
  description: 'Explore the full TEESOULZ catalogue: heavyweight oversized t-shirts, graphic tees, loopback hoodies, and utility cargos.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs">Loading catalogue...</div>}>
      <ShopClient />
    </Suspense>
  );
}
