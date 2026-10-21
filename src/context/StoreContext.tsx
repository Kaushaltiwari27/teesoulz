'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  WishlistItem,
  ShippingAddress,
  Order,
  UserProfile,
  Coupon,
} from '@/types';
import { STORE_COUPONS } from '@/data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  shippingFee: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Size Guide Modal
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Addresses
  addresses: ShippingAddress[];
  addAddress: (address: Omit<ShippingAddress, 'id'>) => ShippingAddress;
  updateAddress: (address: ShippingAddress) => void;
  deleteAddress: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  getOrderById: (orderNumber: string) => Order | undefined;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_ADDRESSES: ShippingAddress[] = [
  {
    id: 'addr-default-1',
    fullName: 'Yash Sharma',
    phone: '+91 98765 43210',
    email: 'yash@teesoulz.in',
    streetAddress: 'Flat 402, Monolith Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth & Addresses
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(DEFAULT_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Toast helper
  const addToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('teesoulz_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('teesoulz_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedUser = localStorage.getItem('teesoulz_user');
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedAddresses = localStorage.getItem('teesoulz_addresses');
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));

      const storedOrders = localStorage.getItem('teesoulz_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCoupon = localStorage.getItem('teesoulz_coupon');
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon));
    } catch (e) {
      console.error('Failed to parse stored localStorage data', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist states
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('teesoulz_cart', JSON.stringify(cart));
    } catch {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('teesoulz_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) {
        localStorage.setItem('teesoulz_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('teesoulz_user');
      }
    } catch {}
  }, [user, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('teesoulz_addresses', JSON.stringify(addresses));
    } catch {}
  }, [addresses, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('teesoulz_orders', JSON.stringify(orders));
    } catch {}
  }, [orders, isHydrated]);

  // Cart calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Discount calculation
  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      cartDiscount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  // Free shipping above ₹1,499
  const shippingFee = cartSubtotal === 0 || cartSubtotal >= 1499 || appliedCoupon?.code === 'FREESHIP' ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.stock <= 0) {
      addToast('Out of Stock', `${product.name} in size ${variant.size} is currently out of stock.`, 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedSize === variant.size && item.selectedColor === variant.color
      );

      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const newQty = Math.min(item.quantity + quantity, variant.stock);
        const updated = [...prev];
        updated[existingIndex] = { ...item, quantity: newQty };
        return updated;
      }

      const newItem: CartItem = {
        id: `ci-${Date.now()}-${variant.id}`,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        selectedSize: variant.size,
        selectedColor: variant.color,
        colorCode: variant.colorCode,
        image: product.images[0] || '',
        quantity: Math.min(quantity, variant.stock),
        maxStock: variant.stock,
      };
      return [newItem, ...prev];
    });

    addToast('Added to Bag', `${product.name} (${variant.size}) added.`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = STORE_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      addToast('Invalid Coupon', `Code "${code}" is not valid.`, 'error');
      return { success: false, message: 'Invalid coupon code.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      const msg = `Order subtotal must be at least ₹${found.minOrderValue} to use this coupon.`;
      addToast('Minimum Not Met', msg, 'error');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    try {
      localStorage.setItem('teesoulz_coupon', JSON.stringify(found));
    } catch {}
    addToast('Coupon Applied', `Code ${found.code} applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('teesoulz_coupon');
    } catch {}
    addToast('Coupon Removed', 'Coupon code removed.', 'info');
  };

  // Wishlist
  const wishlistCount = wishlist.length;

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      addToast('Removed from Wishlist', `${product.name} was removed.`, 'info');
    } else {
      const item: WishlistItem = {
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.images[0] || '',
        category: product.category,
        inStock: product.totalStock > 0,
      };
      setWishlist((prev) => [item, ...prev]);
      addToast('Saved to Wishlist', `${product.name} saved for later.`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    addToast('Removed from Wishlist', 'Item removed.', 'info');
  };

  // Modals
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Auth
  const login = (email: string) => {
    const newUser: UserProfile = {
      id: 'usr-001',
      name: 'Yash Sharma',
      email: email.trim().toLowerCase(),
      phone: '+91 98765 43210',
      joinedDate: 'October 2026',
    };
    setUser(newUser);
    addToast('Welcome Back', `Logged in as ${newUser.name}`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      joinedDate: 'October 2026',
    };
    setUser(newUser);
    addToast('Account Created', `Welcome to TEESOULZ, ${newUser.name}`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    addToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  // Addresses
  const addAddress = (address: Omit<ShippingAddress, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const newAddr: ShippingAddress = { ...address, id };
    const updated = address.isDefault
      ? addresses.map((a) => ({ ...a, isDefault: false }))
      : [...addresses];
    setAddresses([...updated, newAddr]);
    addToast('Address Saved', 'New delivery address added.', 'success');
    return newAddr;
  };

  const updateAddress = (address: ShippingAddress) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === address.id) return address;
        if (address.isDefault) return { ...a, isDefault: false };
        return a;
      })
    );
    addToast('Address Updated', 'Delivery address updated.', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address Deleted', 'Address removed.', 'info');
  };

  // Orders
  const createOrder = (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const orderNumber = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      trackingNumber: `BD${Math.floor(20000000 + Math.random() * 80000000)}IN`,
      carrier: 'Blue Dart Express',
      estimatedDelivery: '3 - 4 Business Days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('teesoulz_coupon');
    } catch {}

    return newOrder;
  };

  const getOrderById = (orderNumber: string) => {
    return orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber
    );
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        shippingFee,
        cartTotal,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSizeGuideOpen,
        openSizeGuide,
        closeSizeGuide,
        isSearchOpen,
        openSearch,
        closeSearch,
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        orders,
        createOrder,
        getOrderById,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
