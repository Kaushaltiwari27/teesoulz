export type ProductCategory =
  | 't-shirts'
  | 'oversized-t-shirts'
  | 'graphic-tees'
  | 'hoodies-sweatshirts'
  | 'bottomwear'
  | 'accessories';

export type ProductGender = 'men' | 'women' | 'unisex';

export interface ProductVariant {
  id: string;
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  colorCode: string;
  stock: number;
  price?: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  sizePurchased?: string;
  fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large' | 'Oversized Fit';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  fabricDetails: string[];
  fitType: 'Oversized Boxy' | 'Relaxed Fit' | 'Regular Fit' | 'Drop Shoulder' | string;
  careInstructions: string[];
  category: ProductCategory;
  gender: ProductGender;
  collections: string[];
  price: number;
  mrp: number;
  discountPercent?: number;
  images: string[];
  variants: ProductVariant[];
  availableColors: { name: string; code: string }[];
  availableSizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  tags: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  totalStock: number;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  mrp: number;
  selectedSize: string;
  selectedColor: string;
  colorCode: string;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Processing' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productSlug: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
}
