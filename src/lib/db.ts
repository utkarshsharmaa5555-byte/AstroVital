// ASTROVITAL // Neon Serverless Postgres Integration
// Driver: @neondatabase/serverless (HTTP transport for Next.js App Router)

import { neon } from '@neondatabase/serverless';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }
  return url;
}

export function getDb() {
  const url = getDatabaseUrl();
  return neon(url);
}

/**
 * Initializes the spaceflight telemetry schema in Neon Postgres
 */
export async function initDatabaseSchema() {
  const sql = getDb();

  // 1. Crew Telemetry Logs Table
  await sql`
    CREATE TABLE IF NOT EXISTS crew_telemetry_logs (
      id SERIAL PRIMARY KEY,
      astronaut_id VARCHAR(64) NOT NULL,
      astronaut_name VARCHAR(128) NOT NULL,
      mission_id VARCHAR(32) NOT NULL,
      gravity_label VARCHAR(64),
      heart_rate NUMERIC,
      hrv_sdnn NUMERIC,
      blood_pressure_sys NUMERIC,
      sans_edema_index NUMERIC,
      ocular_ear NUMERIC,
      pvt_reaction_time NUMERIC,
      radiation_dose NUMERIC,
      flight_status VARCHAR(16) DEFAULT 'NOMINAL',
      simulated BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // 2. CMO Clinical Action Logs Table
  await sql`
    CREATE TABLE IF NOT EXISTS cmo_clinical_actions (
      id SERIAL PRIMARY KEY,
      astronaut_id VARCHAR(64) NOT NULL,
      action_title VARCHAR(255) NOT NULL,
      hardware_ref VARCHAR(128),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  return { success: true, message: 'Neon Postgres schema verified.' };
}

/**
 * Insert a telemetry packet into Neon
 */
export async function logCrewTelemetry(packet: {
  astronautId: string;
  astronautName: string;
  missionId: string;
  gravityLabel: string;
  heartRate?: number;
  hrvSdnn?: number;
  bloodPressureSys?: number;
  sansEdemaIndex?: number;
  ocularEar?: number;
  pvtReactionTime?: number;
  radiationDose?: number;
  flightStatus?: string;
  simulated?: boolean;
}) {
  const sql = getDb();
  await initDatabaseSchema();

  const result = await sql`
    INSERT INTO crew_telemetry_logs (
      astronaut_id,
      astronaut_name,
      mission_id,
      gravity_label,
      heart_rate,
      hrv_sdnn,
      blood_pressure_sys,
      sans_edema_index,
      ocular_ear,
      pvt_reaction_time,
      radiation_dose,
      flight_status,
      simulated
    ) VALUES (
      ${packet.astronautId},
      ${packet.astronautName},
      ${packet.missionId},
      ${packet.gravityLabel},
      ${packet.heartRate ?? null},
      ${packet.hrvSdnn ?? null},
      ${packet.bloodPressureSys ?? null},
      ${packet.sansEdemaIndex ?? null},
      ${packet.ocularEar ?? null},
      ${packet.pvtReactionTime ?? null},
      ${packet.radiationDose ?? null},
      ${packet.flightStatus ?? 'NOMINAL'},
      ${packet.simulated ?? true}
    )
    RETURNING id, created_at;
  `;

  return result[0];
}

/**
 * Query recent telemetry packets
 */
export async function getRecentTelemetryLogs(limit: number = 10) {
  const sql = getDb();
  await initDatabaseSchema();

  const rows = await sql`
    SELECT * FROM crew_telemetry_logs
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;

  return rows;
}
