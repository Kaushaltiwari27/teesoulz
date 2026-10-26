'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Verify role in public.profiles
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileErr || !profile || !['ADMIN', 'STAFF'].includes(profile.role)) {
          await supabase.auth.signOut();
          setErrorMsg('ACCESS RESTRICTED: Account does not have ADMIN or STAFF privileges.');
          setIsLoading(false);
          return;
        }

        // Successfully authorized
        router.replace('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbfbfb] text-zinc-950 font-sans">
      <div className="w-full max-w-md border border-zinc-200/90 rounded-2xl bg-white p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white font-mono font-black text-lg mb-4">
            TS
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              SECURE ADMIN GATEWAY
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
            TEESOULZ CORE
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Sign in with authorized staff credentials to manage the store
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@teesoulz.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-hidden focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-hidden focus:border-black transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-black hover:bg-zinc-800 text-white font-bold text-xs tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>AUTHENTICATE &amp; ENTER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-400">
            Protected by Supabase Auth &bull; PostgreSQL Row Level Security
          </p>
        </div>
      </div>
    </div>
  );
}
