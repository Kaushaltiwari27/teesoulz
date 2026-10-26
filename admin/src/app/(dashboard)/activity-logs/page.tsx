'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { History, Search, Filter, RefreshCw, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function ActivityLogsPage() {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const loadLogs = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchErr) {
        console.warn('Activity log query:', fetchErr.message);
        setLogs([]);
      } else {
        setLogs(data || []);
      }
    } catch (err: any) {
      error('Failed to load logs', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const q = searchQuery.toLowerCase();
      const action = (l.action || '').toLowerCase();
      const email = (l.user_email || '').toLowerCase();
      const entity = (l.entity_type || '').toLowerCase();

      const matchesSearch = action.includes(q) || email.includes(q);
      const matchesEntity = entityFilter === 'ALL' || entity === entityFilter.toLowerCase();

      return matchesSearch && matchesEntity;
    });
  }, [logs, searchQuery, entityFilter]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Administrative Audit Trail
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time chronological record of admin actions, catalog modifications, and order changes
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Trail</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action name or staff email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
            />
          </div>

          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Entities</option>
            <option value="PRODUCT">Products</option>
            <option value="ORDER">Orders</option>
            <option value="INVENTORY">Inventory</option>
            <option value="CATEGORY">Categories</option>
            <option value="COLLECTION">Collections</option>
            <option value="COUPON">Coupons</option>
            <option value="CMS">CMS / Storefront</option>
            <option value="STORAGE">Media Storage</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Auditing activity logs..." />
        ) : paginatedLogs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No activity recorded yet"
            description="When administrators add garments, adjust stock, or fulfill orders, logs are automatically recorded here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">ACTION</th>
                  <th className="py-3 px-4 font-semibold">ENTITY</th>
                  <th className="py-3 px-4 font-semibold">PERFORMED BY</th>
                  <th className="py-3 px-4 font-semibold">DETAILS</th>
                  <th className="py-3 px-4 font-semibold text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-zinc-900 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="street" size="sm">
                        {log.entity_type}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-700">
                      {log.user_email || 'admin@teesoulz.com'}
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-zinc-400">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
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
          totalItems={filteredLogs.length}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
