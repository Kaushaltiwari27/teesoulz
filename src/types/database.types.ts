export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF';
export type ProductGender = 'men' | 'women' | 'unisex';
export type VariantSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type DiscountType = 'percentage' | 'fixed';
export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'COD';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type OrderStatus =
  | 'Processing'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          banner_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          banner_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          banner_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          subtitle: string | null;
          description: string;
          fabric_details: string[];
          fit_type: string;
          care_instructions: string[];
          category_id: string | null;
          gender: ProductGender;
          price_in_paise: number;
          mrp_in_paise: number;
          discount_percent: number;
          images: string[];
          available_colors: Json;
          available_sizes: string[];
          tags: string[];
          is_new_arrival: boolean;
          is_bestseller: boolean;
          is_trending: boolean;
          is_featured: boolean;
          is_published: boolean;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          subtitle?: string | null;
          description: string;
          fabric_details?: string[];
          fit_type: string;
          care_instructions?: string[];
          category_id?: string | null;
          gender?: ProductGender;
          price_in_paise: number;
          mrp_in_paise: number;
          discount_percent?: number;
          images?: string[];
          available_colors?: Json;
          available_sizes?: string[];
          tags?: string[];
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          is_trending?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          subtitle?: string | null;
          description?: string;
          fabric_details?: string[];
          fit_type?: string;
          care_instructions?: string[];
          category_id?: string | null;
          gender?: ProductGender;
          price_in_paise?: number;
          mrp_in_paise?: number;
          discount_percent?: number;
          images?: string[];
          available_colors?: Json;
          available_sizes?: string[];
          tags?: string[];
          is_new_arrival?: boolean;
          is_bestseller?: boolean;
          is_trending?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_collections: {
        Row: {
          product_id: string;
          collection_id: string;
        };
        Insert: {
          product_id: string;
          collection_id: string;
        };
        Update: {
          product_id?: string;
          collection_id?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: VariantSize;
          color: string;
          color_code: string;
          price_in_paise: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: VariantSize;
          color: string;
          color_code: string;
          price_in_paise?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: VariantSize;
          color?: string;
          color_code?: string;
          price_in_paise?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          id: string;
          variant_id: string;
          stock_quantity: number;
          reserved_quantity: number;
          low_stock_threshold: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          variant_id: string;
          stock_quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          variant_id?: string;
          stock_quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          email: string;
          street_address: string;
          apartment: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          email: string;
          street_address: string;
          apartment?: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          email?: string;
          street_address?: string;
          apartment?: string | null;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order_value_in_paise: number;
          description: string;
          is_active: boolean;
          usage_limit: number | null;
          times_used: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order_value_in_paise?: number;
          description: string;
          is_active?: boolean;
          usage_limit?: number | null;
          times_used?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: DiscountType;
          discount_value?: number;
          min_order_value_in_paise?: number;
          description?: string;
          is_active?: boolean;
          usage_limit?: number | null;
          times_used?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          subtotal_in_paise: number;
          discount_in_paise: number;
          shipping_fee_in_paise: number;
          total_amount_in_paise: number;
          coupon_id: string | null;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          payment_id: string | null;
          payment_order_id: string | null;
          status: OrderStatus;
          shipping_address: Json;
          tracking_number: string | null;
          carrier: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          subtotal_in_paise: number;
          discount_in_paise?: number;
          shipping_fee_in_paise?: number;
          total_amount_in_paise: number;
          coupon_id?: string | null;
          payment_method: PaymentMethod;
          payment_status?: PaymentStatus;
          payment_id?: string | null;
          payment_order_id?: string | null;
          status?: OrderStatus;
          shipping_address: Json;
          tracking_number?: string | null;
          carrier?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          subtotal_in_paise?: number;
          discount_in_paise?: number;
          shipping_fee_in_paise?: number;
          total_amount_in_paise?: number;
          coupon_id?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          payment_id?: string | null;
          payment_order_id?: string | null;
          status?: OrderStatus;
          shipping_address?: Json;
          tracking_number?: string | null;
          carrier?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          product_slug: string;
          size: string;
          color: string;
          image_url: string;
          unit_price_in_paise: number;
          quantity: number;
          total_price_in_paise: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          product_slug: string;
          size: string;
          color: string;
          image_url: string;
          unit_price_in_paise: number;
          quantity: number;
          total_price_in_paise: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name?: string;
          product_slug?: string;
          size?: string;
          color?: string;
          image_url?: string;
          unit_price_in_paise?: number;
          quantity?: number;
          total_price_in_paise?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          user_name: string;
          rating: number;
          title: string;
          comment: string;
          verified_purchase: boolean;
          size_purchased: string | null;
          fit_feedback: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          user_name: string;
          rating: number;
          title: string;
          comment: string;
          verified_purchase?: boolean;
          size_purchased?: string | null;
          fit_feedback?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          user_name?: string;
          rating?: number;
          title?: string;
          comment?: string;
          verified_purchase?: boolean;
          size_purchased?: string | null;
          fit_feedback?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      cms_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      product_gender: ProductGender;
      variant_size: VariantSize;
      discount_type: DiscountType;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
