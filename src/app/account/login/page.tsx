'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Lock, ArrowRight, User, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please check your email and password.');
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');

    // Try logging into the demo account
    const demoEmail = 'demo@teesoulz.in';
    const demoPass = 'DemoPass123!';

    const res = await login(demoEmail, demoPass);
    if (res.success) {
      setIsLoading(false);
      router.push('/account');
      return;
    }

    // If demo account doesn't exist yet in Supabase, auto-register it
    const regRes = await register('Demo Member', demoEmail, '+91 98765 43210', demoPass);
    setIsLoading(false);

    if (regRes.success) {
      router.push('/account');
    } else {
      // If error (e.g. rate limit or requires email confirmation)
      setErrorMessage(regRes.error || 'Failed to sign into demo account.');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16 sm:py-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#E5E5E5] p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            CLIENT PORTAL
          </span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[#080808]">
            SIGN IN TO TEESOULZ
          </h1>
          <p className="text-xs text-[#666666]">
            Access your order history, saved addresses, and VIP drop invitations.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#666666] hover:text-black underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E5E5E5]">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDemoLogin}
            className="w-full bg-[#F3F3F3] hover:bg-[#EAEAEA] text-black py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <User className="w-3.5 h-3.5" />
            <span>Instant Demo Account Sign In</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#666666]">
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="font-bold text-black underline underline-offset-2">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
