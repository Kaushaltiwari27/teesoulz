'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Lock, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    router.push('/account');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    router.push('/account');
  };

  const handleDemoLogin = () => {
    login('yash@teesoulz.in');
    router.push('/account');
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-[#F3F3F3] hover:bg-[#EAEAEA] text-black py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
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
