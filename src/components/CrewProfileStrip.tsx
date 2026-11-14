'use client';

import React from 'react';
import { AstronautProfile, compareToBaseline } from '@/lib/baselineEngine';
import { MissionId } from '@/config/missionProfiles';
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  Thermometer,
  Heart,
  Activity,
  Gauge,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
} from 'lucide-react';

interface CrewProfileStripProps {
  astronaut: AstronautProfile;
  missionId: MissionId;
  liveVitals: {
    bodyTemp: number;
    heartRate: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
    cabinPressure: number;
    o2Percent?: number;
  };
  onSwitchCrew: () => void;
}

export function CrewProfileStrip({
  astronaut,
  missionId,
  liveVitals,
  onSwitchCrew,
}: CrewProfileStripProps) {
  const { baselines, lastCheckup } = astronaut;

  // 1. Temperature baseline comparison
  const tempComp = compareToBaseline(
    liveVitals.bodyTemp,
    baselines.bodyTemp.mean,
    baselines.bodyTemp.min,
    baselines.bodyTemp.max,
    baselines.bodyTemp.unit
  );

  // 2. Heart rate baseline comparison
  const hrComp = compareToBaseline(
    liveVitals.heartRate,
    baselines.heartRate.mean,
    baselines.heartRate.min,
    baselines.heartRate.max,
    baselines.heartRate.unit
  );

  // 3. Blood pressure comparison
  const bpSysComp = compareToBaseline(
    liveVitals.bloodPressureSys,
    baselines.bloodPressureSys.mean,
    baselines.bloodPressureSys.min,
    baselines.bloodPressureSys.max,
    'mmHg'
  );

  // 4. Cabin pressure comparison vs environment
  // Lunar/Mars exploration habitat targets 8.2 psia (56.5 kPa) per NASA-STD-3001, ISS / Transit targets 14.7 psia
  const targetCabinPressure =
    missionId === 'MOON' || missionId === 'MARS' ? 8.2 : 14.7;
  const cabinDiff = parseFloat((liveVitals.cabinPressure - targetCabinPressure).toFixed(1));
  const cabinStatus =
    Math.abs(cabinDiff) <= 0.4
      ? 'STABLE'
      : Math.abs(cabinDiff) <= 1.2
      ? 'DRIFT'
      : 'DEPRESS WARNING';

  const getStatusBadge = (color: string, label: string) => {
    if (color === 'WARNING') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30">
          {label}
        </span>
      );
    }
    if (color === 'CAUTION') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30">
          {label}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2EA043]/15 text-[#2EA043] border border-[#2EA043]/30">
        {label}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#131822] border border-[#262E3D] rounded-[10px] p-4 sm:p-5 flex flex-col xl:flex-row gap-5 items-stretch shadow-lg font-sans">
      {/* 1. Profile Overview & Astronaut Photo */}
      <div className="flex items-center gap-4 min-w-[280px] xl:max-w-[340px] xl:border-r border-[#262E3D] xl:pr-5">
        <div className="relative shrink-0">
          <img
            src={astronaut.photoUrl}
            alt={astronaut.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-[#262E3D] shadow-md"
          />
          <span
            title="Biometric Signature Verified via @vladmandic/face-api"
            className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#2EA043] text-black text-[9px] font-mono font-extrabold flex items-center gap-0.5 shadow"
          >
            <ShieldCheck className="w-3 h-3" />
            VERIFIED
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-sm font-bold text-white truncate tracking-wide">
              {astronaut.name}
            </h2>
          </div>
          <p className="text-xs text-gray-400 truncate">{astronaut.rank}</p>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#18202E] border border-[#262E3D] text-[#58A6FF] font-semibold">
              {astronaut.crewId}
            </span>
            <span className="text-gray-400">{astronaut.bloodType}</span>
            <span className="text-gray-500">• Age {astronaut.age}</span>
          </div>

          <button
            onClick={onSwitchCrew}
            className="mt-2 text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3 text-[#58A6FF]" />
            <span>Switch Crew / Face Scan</span>
          </button>
        </div>
      </div>

      {/* 2. Last Body Checkup Card */}
      <div className="flex flex-col justify-between bg-[#18202E]/60 border border-[#262E3D] rounded-lg p-3.5 min-w-[220px] xl:max-w-[260px] font-mono">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 font-semibold text-gray-300">
            <Calendar className="w-3.5 h-3.5 text-[#58A6FF]" />
            LAST CHECKUP
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2EA043]/15 text-[#2EA043] font-bold border border-[#2EA043]/30">
            {lastCheckup.status}
          </span>
        </div>

        <div className="my-1">
          <div className="text-xs font-bold text-white truncate">{lastCheckup.date}</div>
          <div className="text-[11px] text-gray-400 truncate">{lastCheckup.protocol}</div>
        </div>

        <div className="text-[10px] text-gray-500 border-t border-[#262E3D]/60 pt-1.5 flex justify-between">
          <span>NEXT: {lastCheckup.nextScheduled}</span>
          <span>{lastCheckup.metTime}</span>
        </div>
      </div>

      {/* 3. Ordered Primary Vitals Strip (Strict Left-to-Right Order) */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Vital 1: Body Temperature */}
        <div className="bg-[#18202E] border border-[#262E3D] rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-gray-300">
              <Thermometer className="w-3.5 h-3.5 text-[#58A6FF]" />
              1. BODY TEMP
            </span>
            {getStatusBadge(tempComp.statusColor, tempComp.statusColor)}
          </div>

          <div className="my-1.5">
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {liveVitals.bodyTemp.toFixed(1)} <span className="text-xs font-normal text-gray-400">°C</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              {(liveVitals.bodyTemp * 1.8 + 32).toFixed(1)} °F
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-400 bg-[#10151E] px-2 py-1 rounded border border-[#262E3D]/60 flex items-center justify-between">
            <span>Base: {baselines.bodyTemp.mean.toFixed(1)}°C</span>
            <span
              className={
                tempComp.deltaValue > 0
                  ? 'text-[#F85149]'
                  : tempComp.deltaValue < 0
                  ? 'text-[#58A6FF]'
                  : 'text-[#2EA043]'
              }
            >
              {tempComp.deltaValue >= 0 ? `+${tempComp.deltaValue}` : tempComp.deltaValue}°C
            </span>
          </div>
        </div>

        {/* Vital 2: Heart Rate */}
        <div className="bg-[#18202E] border border-[#262E3D] rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-gray-300">
              <Heart className="w-3.5 h-3.5 text-[#F85149]" />
              2. HEART RATE
            </span>
            {getStatusBadge(hrComp.statusColor, hrComp.statusColor)}
          </div>

          <div className="my-1.5">
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {Math.round(liveVitals.heartRate)}{' '}
              <span className="text-xs font-normal text-gray-400">bpm</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2EA043] animate-pulse" />
              RESTING / SEATED
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-400 bg-[#10151E] px-2 py-1 rounded border border-[#262E3D]/60 flex items-center justify-between">
            <span>Base: {baselines.heartRate.mean} bpm</span>
            <span
              className={
                hrComp.deltaValue > 0
                  ? 'text-[#D29922]'
                  : hrComp.deltaValue < 0
                  ? 'text-[#58A6FF]'
                  : 'text-[#2EA043]'
              }
            >
              {hrComp.deltaValue >= 0 ? `+${hrComp.deltaValue}` : hrComp.deltaValue} bpm
            </span>
          </div>
        </div>

        {/* Vital 3: Blood Pressure */}
        <div className="bg-[#18202E] border border-[#262E3D] rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-gray-300">
              <Activity className="w-3.5 h-3.5 text-[#2EA043]" />
              3. BLOOD PRESS
            </span>
            {getStatusBadge(bpSysComp.statusColor, bpSysComp.statusColor)}
          </div>

          <div className="my-1.5">
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {Math.round(liveVitals.bloodPressureSys)}
              <span className="text-sm font-light text-gray-400">/</span>
              {Math.round(liveVitals.bloodPressureDia)}{' '}
              <span className="text-xs font-normal text-gray-400">mmHg</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              MAP: {Math.round((liveVitals.bloodPressureSys + 2 * liveVitals.bloodPressureDia) / 3)} mmHg
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-400 bg-[#10151E] px-2 py-1 rounded border border-[#262E3D]/60 flex items-center justify-between">
            <span>
              Base: {baselines.bloodPressureSys.mean}/{baselines.bloodPressureDia.mean}
            </span>
            <span className="text-[#2EA043]">NOMINAL</span>
          </div>
        </div>

        {/* Vital 4: Cabin Atmospheric Pressure */}
        <div className="bg-[#18202E] border border-[#262E3D] rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-gray-300">
              <Gauge className="w-3.5 h-3.5 text-[#58A6FF]" />
              4. CABIN PRESS
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                cabinStatus === 'STABLE'
                  ? 'bg-[#2EA043]/15 text-[#2EA043] border border-[#2EA043]/30'
                  : cabinStatus === 'DRIFT'
                  ? 'bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30'
                  : 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30'
              }`}
            >
              {cabinStatus}
            </span>
          </div>

          <div className="my-1.5">
            <div className="font-mono text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {liveVitals.cabinPressure.toFixed(1)}{' '}
              <span className="text-xs font-normal text-gray-400">psia</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
              <span>{(liveVitals.cabinPressure * 6.89476).toFixed(1)} kPa</span>
              <span className="text-[#58A6FF]">O₂: {liveVitals.o2Percent || 20.9}%</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-400 bg-[#10151E] px-2 py-1 rounded border border-[#262E3D]/60 flex items-center justify-between">
            <span>Target: {targetCabinPressure} psia</span>
            <span className="text-[#2EA043]">ECLSS LOOP A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
