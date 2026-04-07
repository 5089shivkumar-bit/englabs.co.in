import { supabase } from './supabase';

/**
 * LOGS: Administrative actions for security audits.
 * @param action - the operation performed (e.g. 'PRICE_UPDATE')
 * @param entityId - the ID of the affected object (Product/Order)
 * @param metadata - additional context
 */
export async function logAction(action: string, entityId: string, metadata: any = {}) {
  try {
    // Note: Depends on audit_logs table existing in Supabase
    const { error } = await supabase.from('audit_logs').insert([
      {
        action,
        entity_id: entityId,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
        performed_by: 'Authorized Admin'
      }
    ]);
    
    if (error) {
      console.warn("Audit Log ignored (Ensure table 'audit_logs' exists):", error.message);
    }
  } catch (err) {
    console.error("Audit System Failure:", err);
  }
}
