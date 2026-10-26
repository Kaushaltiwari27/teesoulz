'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function CustomersPage() {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [profRes, ordRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('id, user_id, total_amount_in_paise, payment_status'),
      ]);

      if (profRes.error) throw profRes.error;

      const allProfiles = profRes.data || [];
      const allOrders = ordRes.data || [];

      // Map orders to profiles
      const enriched = allProfiles.map((p) => {
        const userOrders = allOrders.filter((o) => o.user_id === p.id);
        const paidOrders = userOrders.filter((o) => o.payment_status === 'Paid');
        const lifetimeSpent = paidOrders.reduce((sum, o) => sum + (o.total_amount_in_paise || 0), 0);

        return {
          ...p,
          orderCount: userOrders.length,
          lifetimeSpent: lifetimeSpent / 100,
        };
      });

      setCustomers(enriched);
    } catch (err: any) {
      error('Failed to load customers', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();

      const matchesSearch = name.includes(q) || email.includes(q) || phone.includes(q);
      const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [customers, searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Customer Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Registered customer accounts, contact details and lifetime order statistics
          </p>
        </div>

        <button
          type="button"
          onClick={loadCustomers}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Customers</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email or mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Querying user profiles..." />
        ) : paginatedCustomers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers registered yet"
            description="When users sign up on the storefront, their accounts sync to Supabase profiles automatically."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">CUSTOMER</th>
                  <th className="py-3 px-4 font-semibold">CONTACT INFO</th>
                  <th className="py-3 px-4 font-semibold">ROLE</th>
                  <th className="py-3 px-4 font-semibold">ORDERS</th>
                  <th className="py-3 px-4 font-semibold">LIFETIME SPENT</th>
                  <th className="py-3 px-4 font-semibold text-right">JOINED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-950">{c.name || 'Anonymous User'}</div>
                          <div className="text-[11px] text-zinc-400 font-mono truncate max-w-[150px]">
                            {c.id.slice(0, 12)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          c.role === 'ADMIN'
                            ? 'street'
                            : c.role === 'STAFF'
                            ? 'info'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {c.role}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                      {c.orderCount} orders
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      ₹{c.lifetimeSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-zinc-400">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCustomers.length}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
