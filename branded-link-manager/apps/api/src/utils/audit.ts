import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

interface AuditLogParams {
  workspaceId: string | null;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipHash?: string;
}

export async function auditLog(
  client: PoolClient,
  params: AuditLogParams
): Promise<void> {
  await client.query(
    `INSERT INTO audit_logs (id, workspace_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      uuidv4(),
      params.workspaceId,
      params.userId,
      params.action,
      params.entityType,
      params.entityId,
      params.oldValues ? JSON.stringify(params.oldValues) : null,
      params.newValues ? JSON.stringify(params.newValues) : null,
      params.ipHash || null,
    ]
  );
}
