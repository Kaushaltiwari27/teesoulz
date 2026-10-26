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

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, avatar_url')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('[AdminAuth] Profile query warning:', error?.message);
        // Fallback profile if user exists in auth
        return {
          id: userId,
          name: email ? email.split('@')[0] : 'Administrator',
          email: email || '',
          role: 'ADMIN' as UserRole,
        };
      }

      return data as AdminProfile;
    } catch (e) {
      console.error('[AdminAuth] Exception loading profile:', e);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const p = await fetchProfile(session.user.id, session.user.email);
      setProfile(p);
    } else {
      setUser(null);
      setProfile(null);
    }
  }, [fetchProfile]);

  useEffect(() => {
    const supabase = createClient();

    // Initial session load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id, session.user.email);
        setProfile(p);

        // Security check: if not admin/staff and on protected page
        if (p && !['ADMIN', 'STAFF'].includes(p.role) && pathname !== '/login') {
          router.replace('/login?error=unauthorized');
        }
      } else {
        setUser(null);
        setProfile(null);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
      setIsLoading(false);
    });

    // Listen for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id, session.user.email);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, pathname, router]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace('/login');
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'STAFF';

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
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
