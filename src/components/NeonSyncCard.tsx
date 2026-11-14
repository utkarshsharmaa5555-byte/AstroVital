'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, RefreshCw, UploadCloud, Server, AlertCircle } from 'lucide-react';
import { AstronautBaseline } from '@/lib/healthIntelligence';
import { MissionProfile } from '@/config/missionProfiles';

interface NeonSyncCardProps {
  mission: MissionProfile;
  astronaut: AstronautBaseline;
  telemetry: Record<string, number>;
}

export function NeonSyncCard({ mission, astronaut, telemetry }: NeonSyncCardProps) {
  const [dbStatus, setDbStatus] = useState<'LOADING' | 'CONNECTED' | 'ERROR'>('LOADING');
  const [latency, setLatency] = useState<number | null>(null);
  const [branchName, setBranchName] = useState<string>('production');
  const [rowCount, setRowCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const fetchDbHealth = async () => {
    try {
      setDbStatus('LOADING');
      const res = await fetch('/api/neon/health');
      const data = await res.json();
      if (res.ok && data.status === 'CONNECTED') {
        setDbStatus('CONNECTED');
        setLatency(data.latencyMs);
        setBranchName(data.branch || 'production');
        setRowCount(data.telemetryRowCount || 0);
      } else {
        setDbStatus('ERROR');
      }
    } catch {
      setDbStatus('ERROR');
    }
  };

  useEffect(() => {
    fetchDbHealth();
  }, []);

  const handleSyncToNeon = async () => {
    try {
      setIsSyncing(true);
      setLastSyncResult(null);

      const packet = {
        astronautId: astronaut.id,
        astronautName: astronaut.name,
        missionId: mission.id,
        gravityLabel: mission.gravityLabel,
        heartRate: telemetry.HEART_RATE,
        hrvSdnn: telemetry.HRV_SDNN,
        bloodPressureSys: telemetry.BLOOD_PRESSURE_SYS,
        sansEdemaIndex: telemetry.SANS_EDEMA_INDEX,
        ocularEar: telemetry.OCULAR_EAR,
        pvtReactionTime: telemetry.PVT_MEAN_REACTION_TIME,
        radiationDose: telemetry.CUMULATIVE_GCR_DOSE || telemetry.CUMULATIVE_DOSE_LUNAR,
        flightStatus: 'NOMINAL',
        simulated: true,
      };

      const res = await fetch('/api/neon/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRowCount((prev) => prev + 1);
        setLastSyncResult(`Packet #${data.record.id} stored to Neon Lakebase Postgres.`);
        setTimeout(() => setLastSyncResult(null), 3500);
      } else {
        setLastSyncResult('Failed to persist packet.');
      }
    } catch {
      setLastSyncResult('Network sync error.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-spacecraft-surface p-3.5 rounded border border-spacecraft-border font-mono text-xs flex flex-col gap-2.5">
      <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white tracking-wide">
            NEON LAKEBASE POSTGRES // TELEMETRY CLOUD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {dbStatus === 'CONNECTED' ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-flight-nominal/15 text-flight-nominal border border-flight-nominal/30 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-flight-nominal animate-ping" />
              ONLINE ({latency}ms)
            </span>
          ) : dbStatus === 'LOADING' ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-spacecraft-card text-gray-400 text-[10px]">
              <RefreshCw className="w-3 h-3 animate-spin" /> PINGING...
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-flight-warning/15 text-flight-warning text-[10px]">
              <AlertCircle className="w-3 h-3" /> OFFLINE
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-300">
        <div>
          <span className="text-gray-400">BRANCH: </span>
          <span className="text-white font-bold">{branchName}</span>
          <span className="text-gray-500 mx-1.5">|</span>
          <span className="text-gray-400">STORAGE: </span>
          <span className="text-emerald-400 font-bold">{rowCount} telemetry rows</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDbHealth}
            className="p-1.5 bg-spacecraft-card hover:bg-spacecraft-border rounded text-gray-300 border border-spacecraft-border"
            title="Refresh database status"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          <button
            onClick={handleSyncToNeon}
            disabled={isSyncing || dbStatus !== 'CONNECTED'}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold rounded text-[11px] transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'SYNCING...' : 'SYNC TELEMETRY TO NEON'}</span>
          </button>
        </div>
      </div>

      {lastSyncResult && (
        <div className="p-1.5 bg-flight-nominal/15 border border-flight-nominal/30 text-flight-nominal text-[10px] rounded flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{lastSyncResult}</span>
        </div>
      )}
    </div>
  );
}
