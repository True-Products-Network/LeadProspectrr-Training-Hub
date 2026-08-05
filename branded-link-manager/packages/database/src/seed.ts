import { pool } from './client';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Starting database seed...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create platform owner
    const platformOwnerId = uuidv4();
    // Note: In production, use proper password hashing
    const passwordHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G'; // 'admin123'

    await client.query(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, status, email_verified_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (email) DO NOTHING
    `, [platformOwnerId, 'admin@example.com', passwordHash, 'Platform', 'Admin', 'active']);

    console.log('Created platform owner');

    // Get Free plan ID
    const planResult = await client.query(`
      SELECT id FROM plans WHERE name = 'Free' LIMIT 1
    `);

    if (planResult.rows.length === 0) {
      throw new Error('Free plan not found');
    }

    const freePlanId = planResult.rows[0].id;

    // Create demo workspace
    const workspaceId = uuidv4();
    await client.query(`
      INSERT INTO workspaces (id, name, slug, owner_user_id, plan_id, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (slug) DO NOTHING
    `, [workspaceId, 'Demo Workspace', 'demo-workspace', platformOwnerId, freePlanId, 'active']);

    console.log('Created demo workspace');

    // Add platform owner as workspace member
    await client.query(`
      INSERT INTO workspace_members (id, workspace_id, user_id, role, status, invited_by, invited_at, accepted_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (workspace_id, user_id) DO NOTHING
    `, [uuidv4(), workspaceId, platformOwnerId, 'workspace_owner', 'active', platformOwnerId]);

    // Create default platform domain
    const domainId = uuidv4();
    await client.query(`
      INSERT INTO domains (id, workspace_id, hostname, type, verification_token, verification_status, dns_status, ssl_status, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (workspace_id, hostname) DO NOTHING
    `, [domainId, workspaceId, 'lnk.local', 'subdomain', 'default-token', 'active', 'verified', 'active', true]);

    // Update workspace default domain
    await client.query(`
      UPDATE workspaces SET default_domain_id = $1 WHERE id = $2
    `, [domainId, workspaceId]);

    console.log('Created default domain');

    // Create sample folder
    const folderId = uuidv4();
    await client.query(`
      INSERT INTO folders (id, workspace_id, name)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [folderId, workspaceId, 'Marketing']);

    // Create sample tag
    const tagId = uuidv4();
    await client.query(`
      INSERT INTO tags (id, workspace_id, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (workspace_id, name) DO NOTHING
    `, [tagId, workspaceId, 'social-media']);

    // Create sample campaign
    const campaignId = uuidv4();
    await client.query(`
      INSERT INTO campaigns (id, workspace_id, name, description, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [campaignId, workspaceId, 'Summer Sale 2026', 'Our biggest summer promotion', 'active', platformOwnerId]);

    // Create sample link
    const linkId = uuidv4();
    await client.query(`
      INSERT INTO links (
        id, workspace_id, domain_id, campaign_id, folder_id,
        title, slug, destination_url, resolved_destination_url,
        redirect_type, status, description, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      linkId, workspaceId, domainId, campaignId, folderId,
      'Summer Sale Landing Page', 'summer-sale',
      'https://example.com/summer-sale-2026?utm_source=shortlink',
      'https://example.com/summer-sale-2026?utm_source=shortlink',
      '302', 'active', 'Main promotional link for summer campaign',
      platformOwnerId
    ]);

    // Add tag to link
    await client.query(`
      INSERT INTO link_tags (id, link_id, tag_id)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [uuidv4(), linkId, tagId]);

    console.log('Created sample link with folder, tag, and campaign');

    await client.query('COMMIT');
    console.log('Database seed completed successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
