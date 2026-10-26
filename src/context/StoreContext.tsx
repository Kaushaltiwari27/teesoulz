'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductVariant,
  CartItem,
  WishlistItem,
  ShippingAddress,
  Order,
  OrderStatus,
  UserProfile,
  Coupon,
} from '@/types';
import { STORE_COUPONS, PRODUCTS } from '@/data/mockData';
import { INITIAL_ORDERS } from '@/data/mockOrders';
import { createClient } from '@/lib/supabase/client';

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
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Addresses
  addresses: ShippingAddress[];
  addAddress: (address: Omit<ShippingAddress, 'id'>) => ShippingAddress;
  updateAddress: (address: ShippingAddress) => void;
  deleteAddress: (id: string) => void;

  // Orders
  orders: Order[];
  allOrders: Order[];
  createOrder: (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Promise<Order>;
  getOrderById: (orderNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Products Catalog (Admin & Live Store Sync)
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'> | Product) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;

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
  const [allOrders, setAllOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
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

      const storedAllOrders = localStorage.getItem('teesoulz_all_orders');
      if (storedAllOrders) {
        setAllOrders(JSON.parse(storedAllOrders));
      } else {
        fetch('/api/admin/orders')
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.orders && data.orders.length > 0) setAllOrders(data.orders);
          })
          .catch(() => {});
      }

      const storedProducts = localStorage.getItem('teesoulz_products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        fetch('/api/admin/products')
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.products && data.products.length > 0) setProducts(data.products);
          })
          .catch(() => {});
      }

      const storedCoupon = localStorage.getItem('teesoulz_coupon');
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon));

      const storedRecentlyViewed = localStorage.getItem('teesoulz_recently_viewed');
      if (storedRecentlyViewed) setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    } catch (e) {
      console.error('Failed to parse stored localStorage data', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Listen for cross-component products & orders updates
  useEffect(() => {
    const handleProductsUpdated = (e: Event) => {
      const custom = e as CustomEvent<Product[]>;
      if (custom.detail) setProducts(custom.detail);
    };
    window.addEventListener('teesoulz_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('teesoulz_products_updated', handleProductsUpdated);
  }, []);

  // Listen for Supabase Auth state changes
  useEffect(() => {
    const supabase = createClient();

    const syncUserOrdersAndAddresses = async (userId: string) => {
      try {
        const { data: dbOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (dbOrders && dbOrders.length > 0) {
          const orderIds = dbOrders.map((o) => o.id);
          const { data: dbItems } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);

          const itemsByOrderId: { [orderId: string]: any[] } = {};
          (dbItems || []).forEach((item: any) => {
            if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
            itemsByOrderId[item.order_id].push(item);
          });

          const mappedOrders: Order[] = dbOrders.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            date: new Date(o.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            items: (itemsByOrderId[o.id] || []).map((item: any) => ({
              productId: item.product_id || '',
              productSlug: item.product_slug,
              name: item.product_name,
              size: item.size,
              color: item.color,
              price: (item.unit_price_in_paise || 0) / 100,
              quantity: item.quantity,
              image: item.image_url,
            })),
            subtotal: (o.subtotal_in_paise || 0) / 100,
            discount: (o.discount_in_paise || 0) / 100,
            shippingFee: (o.shipping_fee_in_paise || 0) / 100,
            totalAmount: (o.total_amount_in_paise || 0) / 100,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            shippingAddress: o.shipping_address as unknown as ShippingAddress,
            status: o.status,
            trackingNumber: o.tracking_number || undefined,
            carrier: o.carrier || undefined,
            estimatedDelivery: o.estimated_delivery
              ? new Date(o.estimated_delivery).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '3 - 4 Business Days',
          }));
          setOrders(mappedOrders);
        }

        const { data: dbAddresses } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false });

        if (dbAddresses && dbAddresses.length > 0) {
          const mappedAddresses: ShippingAddress[] = dbAddresses.map((a: any) => ({
            id: a.id,
            fullName: a.full_name,
            phone: a.phone,
            email: a.email,
            streetAddress: a.street_address,
            apartment: a.apartment || undefined,
            city: a.city,
            state: a.state,
            pincode: a.pincode,
            isDefault: a.is_default,
          }));
          setAddresses(mappedAddresses);
        }
      } catch (err) {
        console.error('Error syncing user orders/addresses:', err);
      }
    };

    // Check initial active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone || '',
            avatarUrl: profile.avatar_url || undefined,
            joinedDate: new Date(profile.created_at).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            }),
          });
        }
        await syncUserOrdersAndAddresses(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone || '',
            avatarUrl: profile.avatar_url || undefined,
            joinedDate: new Date(profile.created_at).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            }),
          });
        } else {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Member',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            joinedDate: 'October 2026',
          });
        }
        await syncUserOrdersAndAddresses(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setOrders([]);
        setAddresses(DEFAULT_ADDRESSES);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Listen for cross-component products & orders updates
  useEffect(() => {
    const handleProductsUpdated = (e: Event) => {
      const custom = e as CustomEvent<Product[]>;
      if (custom.detail) setProducts(custom.detail);
    };
    window.addEventListener('teesoulz_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('teesoulz_products_updated', handleProductsUpdated);
  }, []);

  // Persist states
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('teesoulz_recently_viewed', JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed, isHydrated]);
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
  const login = async (email: string, password?: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password || 'Teesoulz@123',
      });

      if (error) {
        addToast('Sign In Failed', error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const profileName = profile?.name || data.user.user_metadata?.name || 'Member';
        addToast('Welcome Back', `Signed in as ${profileName}`, 'success');
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      addToast('Error', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, phone: string, password?: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password || 'Teesoulz@123',
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        addToast('Sign Up Failed', error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || null,
            role: 'CUSTOMER',
          });
        } catch {}
      }

      if (data.session) {
        addToast('Welcome to TEESOULZ', `Account created for ${name.trim()}!`, 'success');
      } else {
        addToast('Account Created', 'Please check your email to verify your account, or sign in.', 'info');
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      addToast('Error', msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    addToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          avatar_url: profile.avatarUrl,
        })
        .eq('id', user.id);
    } catch {}
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
  const createOrder = async (orderPayload: Omit<Order, 'id' | 'orderNumber' | 'date'>): Promise<Order> => {
    const orderNumber = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `BD${Math.floor(20000000 + Math.random() * 80000000)}IN`;
    const carrier = 'Blue Dart Express';

    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      trackingNumber,
      carrier,
      estimatedDelivery: '3 - 4 Business Days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setAllOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber)];
      try {
        localStorage.setItem('teesoulz_all_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Track checked-out items in recently viewed
    if (orderPayload.items && orderPayload.items.length > 0) {
      orderPayload.items.forEach((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productSlug);
        if (prod) {
          addRecentlyViewed(prod);
        }
      });
    }

    clearCart();
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('teesoulz_coupon');
    } catch {}

    // Live Database Sync to Supabase orders & order_items
    try {
      const supabase = createClient();
      const isValidUuid = (val?: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val || '');

      const userId = user?.id && isValidUuid(user.id) ? user.id : null;

      // 1. Insert into public.orders
      const { data: dbOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId,
          subtotal_in_paise: Math.round(orderPayload.subtotal * 100),
          discount_in_paise: Math.round(orderPayload.discount * 100),
          shipping_fee_in_paise: Math.round(orderPayload.shippingFee * 100),
          total_amount_in_paise: Math.round(orderPayload.totalAmount * 100),
          payment_method: orderPayload.paymentMethod,
          payment_status: orderPayload.paymentStatus,
          status: 'Confirmed',
          shipping_address: orderPayload.shippingAddress as unknown as any,
          tracking_number: trackingNumber,
          carrier: carrier,
          estimated_delivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (orderErr) {
        console.error('Failed to sync order to Supabase:', orderErr);
      } else if (dbOrder) {
        newOrder.id = dbOrder.id;

        // 2. Insert line items into public.order_items
        const orderItemsToInsert = orderPayload.items.map((item) => ({
          order_id: dbOrder.id,
          product_id: isValidUuid(item.productId) ? item.productId : null,
          product_name: item.name,
          product_slug: item.productSlug,
          size: item.size,
          color: item.color,
          image_url: item.image,
          unit_price_in_paise: Math.round(item.price * 100),
          quantity: item.quantity,
          total_price_in_paise: Math.round(item.price * item.quantity * 100),
        }));

        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsErr) {
          console.error('Failed to sync order items to Supabase:', itemsErr);
        }

        // 3. If customer is registered, save address into public.addresses
        if (userId) {
          try {
            await supabase.from('addresses').insert({
              user_id: userId,
              full_name: orderPayload.shippingAddress.fullName,
              phone: orderPayload.shippingAddress.phone,
              email: orderPayload.shippingAddress.email,
              street_address: orderPayload.shippingAddress.streetAddress,
              apartment: orderPayload.shippingAddress.apartment || null,
              city: orderPayload.shippingAddress.city,
              state: orderPayload.shippingAddress.state,
              pincode: orderPayload.shippingAddress.pincode,
              is_default: addresses.length === 0,
            });
          } catch {}
        }
      }
    } catch (syncErr) {
      console.error('Error syncing order to Supabase:', syncErr);
    }

    return newOrder;
  };

  const addRecentlyViewed = useCallback((product: Product) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 12);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem('teesoulz_recently_viewed');
    } catch {}
  }, []);

  const getOrderById = (orderNumber: string) => {
    return (
      allOrders.find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber
      ) ||
      orders.find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber
      )
    );
  };

  // Orders Admin Operations
  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string): Promise<void> => {
      setAllOrders((prev) => {
        const updated = prev.map((o) => {
          if (o.id === orderId || o.orderNumber === orderId) {
            return {
              ...o,
              status,
              ...(trackingNumber !== undefined ? { trackingNumber } : {}),
              ...(carrier !== undefined ? { carrier } : {}),
            };
          }
          return o;
        });
        try {
          localStorage.setItem('teesoulz_all_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setOrders((prev) => {
        const updated = prev.map((o) => {
          if (o.id === orderId || o.orderNumber === orderId) {
            return {
              ...o,
              status,
              ...(trackingNumber !== undefined ? { trackingNumber } : {}),
              ...(carrier !== undefined ? { carrier } : {}),
            };
          }
          return o;
        });
        try {
          localStorage.setItem('teesoulz_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      try {
        await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status, trackingNumber, carrier }),
        });
      } catch {}

      addToast('Order Status Updated', `Order #${orderId} marked as ${status}.`, 'success');
    },
    [addToast]
  );

  const deleteOrder = useCallback(
    async (orderId: string): Promise<void> => {
      setAllOrders((prev) => {
        const updated = prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
        try {
          localStorage.setItem('teesoulz_all_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setOrders((prev) => {
        const updated = prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
        try {
          localStorage.setItem('teesoulz_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      addToast('Order Deleted', `Order #${orderId} removed.`, 'info');
    },
    [addToast]
  );

  // Products Admin Operations
  const addProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt'> | Product): Promise<Product> => {
      const slug =
        productData.slug ||
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

      const newProd: Product = {
        ...productData,
        id: (productData as any).id || `ts-${Date.now()}`,
        slug,
        createdAt: (productData as any).createdAt || new Date().toISOString(),
        rating: productData.rating || 5.0,
        reviewCount: productData.reviewCount || 1,
        totalStock:
          (productData.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0) ||
          productData.totalStock ||
          0,
      };

      setProducts((prev) => {
        const updated = [newProd, ...prev.filter((p) => p.id !== newProd.id)];
        try {
          localStorage.setItem('teesoulz_products', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('teesoulz_products_updated', { detail: updated }));
        } catch {}
        return updated;
      });

      try {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd),
        });
      } catch {}

      addToast('Product Added', `${newProd.name} successfully created.`, 'success');
      return newProd;
    },
    [addToast]
  );

  const updateProduct = useCallback(
    async (updatedProduct: Product): Promise<void> => {
      const totalStock =
        (updatedProduct.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0) ||
        updatedProduct.totalStock ||
        0;
      const finalProduct = { ...updatedProduct, totalStock };

      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === finalProduct.id ? finalProduct : p));
        try {
          localStorage.setItem('teesoulz_products', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('teesoulz_products_updated', { detail: updated }));
        } catch {}
        return updated;
      });

      try {
        await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalProduct),
        });
      } catch {}

      addToast('Product Updated', `${finalProduct.name} saved.`, 'success');
    },
    [addToast]
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<void> => {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== productId);
        try {
          localStorage.setItem('teesoulz_products', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('teesoulz_products_updated', { detail: updated }));
        } catch {}
        return updated;
      });

      try {
        await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
      } catch {}

      addToast('Product Deleted', 'Item removed from catalogue.', 'info');
    },
    [addToast]
  );

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
        allOrders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        deleteOrder,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
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
