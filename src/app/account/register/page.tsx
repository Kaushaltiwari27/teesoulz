'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    router.push('/account');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    register(name, email, phone);
    router.push('/account');
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yash Sharma"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yash@example.com"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-white border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
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
