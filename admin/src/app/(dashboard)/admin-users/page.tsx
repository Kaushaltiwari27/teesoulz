'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Mail,
  Calendar,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminUsersPage() {
  const { success, error } = useToast();
  const { profile: currentProfile } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // Role Edit Modal
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'STAFF' | 'CUSTOMER'>('STAFF');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAdminUsers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['ADMIN', 'STAFF'])
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;
      setAdminUsers(data || []);
    } catch (err: any) {
      error('Failed to load team', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (currentProfile?.role !== 'ADMIN') {
      error('Permission denied', 'Only Super Administrators can modify team roles.');
      return;
    }

    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { error: upErr } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', editingUser.id);

      if (upErr) throw upErr;

      await logActivity('ADMIN_ROLE_UPDATED', 'profile', editingUser.id, {
        targetUser: editingUser.email,
        newRole: selectedRole,
      });

      success('Role updated', `${editingUser.email} is now ${selectedRole}.`);
      setEditingUser(null);
      loadAdminUsers();
    } catch (err: any) {
      error('Failed to update role', err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Administrative Team &amp; Privileges
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Authorized personnel permitted to access this portal via Supabase Auth
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminUsers}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Team</span>
        </button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Auditing security permissions..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">STAFF MEMBER</th>
                  <th className="py-3 px-4 font-semibold">EMAIL ADDRESS</th>
                  <th className="py-3 px-4 font-semibold">ROLE</th>
                  <th className="py-3 px-4 font-semibold">USER ID</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {adminUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-zinc-950">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span>{u.name || 'Admin User'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-700">
                      {u.email}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={u.role === 'ADMIN' ? 'street' : 'neutral'}
                        size="sm"
                        dot
                      >
                        {u.role}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                      {u.id.slice(0, 16)}...
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setSelectedRole(u.role);
                        }}
                        className="px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                      >
                        Adjust Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Adjust Role Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Adjust Team Role"
        description={`Configure role for ${editingUser?.email}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Select Security Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold bg-white text-zinc-950"
            >
              <option value="ADMIN">ADMIN — Full CRUD &amp; Administrative Permissions</option>
              <option value="STAFF">STAFF — Catalog, Inventory &amp; Order Processing</option>
              <option value="CUSTOMER">CUSTOMER — Revoke Administrative Access</option>
            </select>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Role adjustments immediately change PostgreSQL RLS authorization on next database request.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Apply Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
