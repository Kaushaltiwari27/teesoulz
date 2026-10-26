'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
    if (!name || !email || !password) return;

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await register(name, email, phone, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMessage(res.error || 'Failed to create account. Please try again.');
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
            NEW MEMBERSHIP
          </span>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[#080808]">
            CREATE AN ACCOUNT
          </h1>
          <p className="text-xs text-[#666666]">
            Join the TEESOULZ club for early drop access and order management.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yash Sharma"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yash@example.com"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              disabled={isLoading}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#666666]">
          Already have an account?{' '}
          <Link href="/account/login" className="font-bold text-black underline underline-offset-2">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
