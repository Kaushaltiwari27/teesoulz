'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Heart,
  Share2,
  Ruler,
  Check,
  Truck,
  RotateCcw,
  Star,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useStore } from '@/context/StoreContext';
import ProductGrid from '@/components/product/ProductGrid';
import RecentlyViewedSection from '@/components/home/RecentlyViewedSection';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, openSizeGuide, addToast, addRecentlyViewed } = useStore();

  // Track product in Recently Viewed
  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    fabric: true,
    fit: true,
    care: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isWishlisted = isInWishlist(product.id);

  // Find exact matching variant
  const currentVariant: ProductVariant | undefined =
    product.variants.find(
      (v) => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
    ) || product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart(product, currentVariant, quantity);
    router.push('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    // Delivery calculation
    const days = cleanPin.startsWith('4') || cleanPin.startsWith('1') ? '2–3' : '3–4';
    setPincodeResult(`✓ Express Delivery available to ${cleanPin} in ${days} business days. Free delivery.`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', 'Product link copied to clipboard.', 'success');
    }
  };

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${product.category}`} className="hover:text-black capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-[#E5E5E5]">
          {/* Left: Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden group">
              <Image
                key={activeImageIndex}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
              />

              {/* Discount Badge */}
              {product.discountPercent && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-widest">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] bg-[#F3F3F3] border-2 transition-all duration-300 overflow-hidden ${
                      activeImageIndex === idx ? 'border-black ring-1 ring-black opacity-100' : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Buy Box Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category, Rating, Share */}
              <div className="flex items-center justify-between text-xs text-[#777777]">
                <span className="font-bold uppercase tracking-widest text-[#080808]">
                  {product.category.replace('-', ' ')} • {product.gender.toUpperCase()}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-black font-semibold">
                    <Star className="w-3.5 h-3.5 fill-black" />
                    <span>{product.rating}</span>
                    <span className="text-[#888888]">({product.reviewCount})</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="hover:text-black p-1"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#080808]">
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="text-xs sm:text-sm text-[#666666] font-medium mt-1">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-[#E5E5E5]">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#080808]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-base text-[#888888] line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({product.discountPercent}% OFF)
                  </span>
                )}
              </div>

              {/* Color Swatches */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#333333] mb-2">
                  <span>Color: <strong className="text-black">{selectedColor}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color.name
                          ? 'border-black ring-2 ring-black/20'
                          : 'border-[#CCCCCC] hover:border-black'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={`w-4 h-4 ${
                            color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === '#f5f5f5'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector with Size Guide Link */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#333333] mb-2">
                  <span>Select Size</span>
                  <button
                    type="button"
                    onClick={openSizeGuide}
                    className="text-[#555555] hover:text-black underline flex items-center gap-1 font-semibold"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((sz) => {
                    const variant = product.variants.find(
                      (v) => v.size === sz && (!selectedColor || v.color === selectedColor)
                    );
                    const stock = variant ? variant.stock : 0;
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={stock <= 0}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 sm:w-14 h-11 sm:h-12 text-xs font-bold uppercase border transition-all ${
                          isSelected
                            ? 'bg-[#080808] text-white border-[#080808]'
                            : stock > 0
                            ? 'bg-white text-[#111111] border-[#CCCCCC] hover:border-black'
                            : 'bg-[#F3F3F3] text-[#B8B8B8] border-transparent line-through cursor-not-allowed'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Live Stock Availability Feedback */}
                <div className="mt-2 text-xs">
                  {currentVariant && currentVariant.stock > 0 ? (
                    currentVariant.stock <= 5 ? (
                      <p className="text-amber-600 font-semibold">
                        ⚡ High demand: Only {currentVariant.stock} left in size {selectedSize}
                      </p>
                    ) : (
                      <p className="text-green-700 font-medium">
                        ✓ In Stock — Ready to dispatch from Mumbai warehouse
                      </p>
                    )
                  ) : (
                    <p className="text-red-600 font-semibold">
                      ✕ Size {selectedSize} is currently sold out.
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#333333]">Quantity:</span>
                <div className="flex items-center border border-[#CCCCCC]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-xs hover:bg-[#F3F3F3] font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(currentVariant?.stock || 5, q + 1))}
                    className="px-3 py-1.5 text-xs hover:bg-[#F3F3F3] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-[#080808] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  >
                    {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-4 border transition-colors ${
                      isWishlisted
                        ? 'border-red-600 text-red-600 bg-red-50'
                        : 'border-[#CCCCCC] text-black hover:bg-[#F3F3F3]'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-[#111111] hover:bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40"
                >
                  Buy Now with 1-Click
                </button>
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery & PIN Code Check</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN (e.g. 400050)"
                    className="flex-1 bg-white border border-[#CCCCCC] px-3 py-2 text-xs focus:border-black focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-[#080808] text-white text-xs font-bold uppercase px-4 py-2 hover:bg-black transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeResult && (
                  <p className="text-xs font-medium text-green-700 mt-1">{pincodeResult}</p>
                )}
              </div>

              {/* Guarantee Bar */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#555555]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-black flex-shrink-0" />
                  <span>Free Express Delivery above ₹1,499</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                  <span>7-Day Easy Doorstep Exchange</span>
                </div>
              </div>
            </div>

            {/* Accordions for Specifications */}
            <div className="pt-8 border-t border-[#E5E5E5] divide-y divide-[#E5E5E5] text-xs">
              {/* Fabric & Specs */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
                >
                  <span>Fabric & Material Specifications</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.fabric ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fabric && (
                  <div className="pb-4 space-y-1.5 text-[#555555]">
                    {product.fabricDetails.map((f, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                        <span>{f}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Fit & Silhouette */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
                >
                  <span>Fit & Tailoring Profile</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.fit ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fit && (
                  <div className="pb-4 space-y-2 text-[#555555]">
                    <p>
                      <strong>Fit Type:</strong> {product.fitType}
                    </p>
                    <p>
                      Cut intentionally wide through the chest with exaggerated dropped shoulders. Fits true to our streetwear oversized sizing. We recommend ordering your usual size for the intended drape.
                    </p>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
                >
                  <span>Wash Care & Longevity</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.care ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.care && (
                  <div className="pb-4 space-y-1.5 text-[#555555]">
                    {product.careInstructions.map((c, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
                        <span>{c}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-black text-left"
                >
                  <span>Shipping & Returns Policy</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.shipping ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="pb-4 space-y-2 text-[#555555]">
                    <p>
                      All orders are dispatched from our Mumbai hub within 24 hours via Blue Dart or Delhivery Express.
                    </p>
                    <p>
                      We offer a 7-day hassle-free doorstep exchange policy. If you need a different size, our courier partner will collect the piece from your doorstep and deliver the replacement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="py-16 border-b border-[#E5E5E5]">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold uppercase tracking-tight text-black">
                    Verified Customer Reviews ({product.reviewCount})
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-black">{product.rating} out of 5</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 divide-y divide-[#E5E5E5]">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-black">{rev.userName}</h4>
                      <span className="text-[11px] text-[#888888]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-black text-black" />
                      ))}
                    </div>
                    <h5 className="text-xs font-bold text-black">&ldquo;{rev.title}&rdquo;</h5>
                    <p className="text-xs text-[#555555] leading-relaxed">{rev.comment}</p>
                    {rev.fitFeedback && (
                      <span className="inline-block text-[10px] bg-[#F3F3F3] text-[#444444] px-2 py-0.5 rounded font-medium">
                        Fit: {rev.fitFeedback}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 pb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-black mb-8">
              COMPLETE THE DRAPE: RELATED STYLES
            </h3>
            <ProductGrid products={relatedProducts} />
          </div>
        )}

        {/* Recently Viewed Section on PDP */}
        <div className="pb-28 lg:pb-12">
          <RecentlyViewedSection
            excludeProductId={product.id}
            title="Recently Viewed"
            subtitle="Styles you explored earlier in your session"
            limit={4}
          />
        </div>
      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-40 lg:hidden flex items-center justify-between gap-3 shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-black font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] text-[#888888] line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">
            Size {selectedSize} • {selectedColor}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 max-w-[200px] bg-[#080808] text-white py-3 px-4 text-xs font-black uppercase tracking-[0.15em] hover:bg-black transition-all disabled:opacity-40 shadow-md"
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
}
