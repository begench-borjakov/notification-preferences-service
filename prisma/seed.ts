import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

const defaultPreferences = [
  {
    notificationType: 'marketing',
    channel: 'email',
    enabled: false,
  },
  {
    notificationType: 'marketing',
    channel: 'sms',
    enabled: false,
  },
  {
    notificationType: 'marketing',
    channel: 'push',
    enabled: false,
  },
  {
    notificationType: 'marketing',
    channel: 'messenger',
    enabled: false,
  },
  {
    notificationType: 'transactional',
    channel: 'email',
    enabled: true,
  },
  {
    notificationType: 'transactional',
    channel: 'sms',
    enabled: true,
  },
  {
    notificationType: 'transactional',
    channel: 'push',
    enabled: true,
  },
  {
    notificationType: 'transactional',
    channel: 'messenger',
    enabled: true,
  },
  {
    notificationType: 'security',
    channel: 'email',
    enabled: true,
  },
  {
    notificationType: 'security',
    channel: 'sms',
    enabled: true,
  },
  {
    notificationType: 'security',
    channel: 'push',
    enabled: true,
  },
  {
    notificationType: 'security',
    channel: 'messenger',
    enabled: true,
  },
];

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed the database');
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const preference of defaultPreferences) {
      await client.query(
        `
          INSERT INTO "default_preferences" (
            "id",
            "notification_type",
            "channel",
            "enabled",
            "created_at",
            "updated_at"
          )
          VALUES (
            $1,
            $2::"NotificationType",
            $3::"Channel",
            $4,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          ON CONFLICT ("notification_type", "channel")
          DO UPDATE SET
            "enabled" = EXCLUDED."enabled",
            "updated_at" = CURRENT_TIMESTAMP
        `,
        [randomUUID(), preference.notificationType, preference.channel, preference.enabled],
      );
    }

    await client.query('COMMIT');

    console.log(`Seeded ${defaultPreferences.length} default preferences`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

void main();
