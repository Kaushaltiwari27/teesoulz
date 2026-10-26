'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
}

interface AdminAuthContextType {
  user: any | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// STRICT MASTER WHITELIST: Only the master administrator email can access
export const AUTHORIZED_SUPERADMINS = ['kaushiiii27@gmail.com'];

export function isAuthorizedAdmin(email?: string, role?: string): boolean {
  if (!email) return false;
  const isEmailAllowed = AUTHORIZED_SUPERADMINS.includes(email.toLowerCase().trim());
  const isRoleAdmin = role === 'ADMIN';
  return isEmailAllowed && isRoleAdmin;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<AdminProfile | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, avatar_url')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as AdminProfile;
    } catch {
      return null;
    }
  }, []);

  const verifyAndSetSession = useCallback(async (sessionUser: any | null) => {
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      if (pathname !== '/login') {
        router.replace('/login');
      }
      setIsLoading(false);
      return;
    }

    const p = await fetchProfile(sessionUser.id);

    // Enforce strict single-admin security check
    if (!isAuthorizedAdmin(sessionUser.email, p?.role)) {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      if (pathname !== '/login') {
        router.replace('/login?error=restricted');
      }
      setIsLoading(false);
      return;
    }

    // Authorized
    setUser(sessionUser);
    setProfile(p);
    setIsLoading(false);
  }, [fetchProfile, pathname, router]);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    await verifyAndSetSession(session?.user || null);
  }, [verifyAndSetSession]);

  useEffect(() => {
    const supabase = createClient();

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAndSetSession(session?.user || null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyAndSetSession(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifyAndSetSession]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace('/login');
  };

  const isAdmin = isAuthorizedAdmin(user?.email, profile?.role);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAdmin,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
