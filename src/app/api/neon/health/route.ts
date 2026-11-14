import { NextResponse } from 'next/server';
import { getDb, initDatabaseSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    const sql = getDb();
    await initDatabaseSchema();

    const queryResult = await sql`
      SELECT 
        NOW() as current_time, 
        current_database() as db_name, 
        version() as pg_version,
        (SELECT COUNT(*) FROM crew_telemetry_logs) as telemetry_rows_count;
    `;

    const latencyMs = Date.now() - startTime;
    const row = queryResult[0];

    return NextResponse.json({
      status: 'CONNECTED',
      database: row.db_name,
      version: row.pg_version,
      telemetryRowCount: Number(row.telemetry_rows_count || 0),
      latencyMs,
      branch: process.env.NEON_BRANCH || 'production',
      branchId: process.env.NEON_BRANCH_ID || 'unknown',
      timestamp: row.current_time,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'DISCONNECTED',
        error: error.message || 'Database connection error',
        latencyMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
