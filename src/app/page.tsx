import React from 'react';
import HomeSectionsClient from '@/components/home/HomeSectionsClient';
import { getProducts } from '@/lib/supabase/products';
import { PRODUCTS } from '@/data/mockData';

export const instant = false;

export default async function HomePage() {
  const liveProducts = await getProducts();
  const products = Array.isArray(liveProducts) && liveProducts.length > 0 ? liveProducts : PRODUCTS;

  return <HomeSectionsClient initialProducts={products} />;
}
