import { createClient } from './supabase/client';

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string | null,
  details?: Record<string, any>
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    await supabase.from('activity_logs').insert({
      user_id: session?.user?.id || null,
      user_email: session?.user?.email || 'admin@teesoulz.com',
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (err) {
    // Non-blocking log failure
    console.warn('[ActivityLog] Could not persist log:', err);
  }
}
