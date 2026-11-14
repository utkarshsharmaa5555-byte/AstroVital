import { NextRequest, NextResponse } from 'next/server';
import { logCrewTelemetry, getRecentTelemetryLogs } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const logs = await getRecentTelemetryLogs(limit);
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await logCrewTelemetry(body);
    return NextResponse.json({ success: true, record: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to persist telemetry' },
      { status: 500 }
    );
  }
}
