'use client';

import React, { useState, useEffect } from 'react';
import {
  MissionId,
  MISSION_PROFILES,
  FlightStatus,
} from '@/config/missionProfiles';
import { AstronautBaseline, DEMO_ASTRONAUTS } from '@/lib/healthIntelligence';
import {
  Globe,
  Radio,
  Clock,
  ShieldAlert,
  UserCheck,
  Stethoscope,
  Camera,
  PlayCircle,
  Activity,
  Layers,
  Cpu,
  Monitor,
} from 'lucide-react';

interface MissionSelectorBarProps {
  currentMissionId: MissionId;
  onSelectMission: (id: MissionId) => void;
  activeRole: 'CREW' | 'CMO';
  onToggleRole: (role: 'CREW' | 'CMO') => void;
  selectedAstronaut: AstronautBaseline;
  onSelectAstronaut: (astro: AstronautBaseline) => void;
  onInjectScenario: (scenarioId: string) => void;
  onOpenFaceBiometrics: () => void;
  onOpenPVTTest: () => void;
  onOpenDigitalTwin: () => void;
  activeViewTab: 'MISSION_CONTROL' | 'DIGITAL_TWIN';
  onToggleViewTab: (tab: 'MISSION_CONTROL' | 'DIGITAL_TWIN') => void;
  isLiveFaceActive: boolean;
}

export function MissionSelectorBar({
  currentMissionId,
  onSelectMission,
  activeRole,
  onToggleRole,
  selectedAstronaut,
  onSelectAstronaut,
  onInjectScenario,
  onOpenFaceBiometrics,
  onOpenPVTTest,
  onOpenDigitalTwin,
  activeViewTab,
  onToggleViewTab,
  isLiveFaceActive,
}: MissionSelectorBarProps) {
  const currentProfile = MISSION_PROFILES[currentMissionId] || MISSION_PROFILES.ISS;

  // Live ticking MET (Mission Elapsed Time)
  const [metSeconds, setMetSeconds] = useState(142 * 86400 + 14 * 3600 + 22 * 60 + 45);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${days.toString().padStart(3, '0')}:${hours
      .toString()
      .padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-spacecraft-surface border-b border-spacecraft-border text-gray-200 select-none">
      {/* Top Telemetry Flight Ribbon */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-spacecraft-borderMuted text-xs font-mono bg-spacecraft-bg/70 gap-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-wider text-flight-info">
            <Activity className="w-4 h-4 animate-pulse text-flight-nominal" />
            <span className="text-white">ASTROVITAL</span>
            <span className="text-gray-400 font-normal hidden sm:inline">// NASA-STD-3001 OPERATIONAL TELEMETRY ENGINE</span>
          </div>

          <div className="h-3 w-[1px] bg-spacecraft-border hidden md:block" />

          {/* Live Data Provenance Badge */}
          <div className="flex items-center gap-1.5">
            {isLiveFaceActive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-flight-nominal/15 text-flight-nominal border border-flight-nominal/40 font-mono text-[10px] uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-flight-nominal animate-ping" />
                [LIVE WEBCAM BIOMETRIC INPUT]
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-spacecraft-card text-flight-info border border-spacecraft-border font-mono text-[10px] uppercase">
                <Layers className="w-3 h-3 text-flight-info" />
                [SIMULATED TELEMETRY // NASA-STD-3001 REFERENCE MODEL]
              </span>
            )}
          </div>
        </div>

        {/* MET Clock & Comms Latency Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-spacecraft-card px-2.5 py-1 rounded border border-spacecraft-border">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 text-[11px]">MET:</span>
            <span className="text-white font-bold tracking-wider font-mono tabular-nums">
              {formatMET(metSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-spacecraft-card px-2.5 py-1 rounded border border-spacecraft-border text-[11px]">
            <Radio className="w-3.5 h-3.5 text-flight-caution" />
            <span className="text-gray-400">OWLT DELAY:</span>
            <span className="text-flight-caution font-mono font-semibold">
              {currentProfile.owltLabel}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* DIGITAL TWIN BUTTON */}
            <button
              onClick={onOpenDigitalTwin}
              className={`flex items-center gap-1.5 px-2.5 py-1 border rounded text-[11px] transition-all ${
                activeViewTab === 'DIGITAL_TWIN'
                  ? 'bg-flight-accent/25 border-flight-accent text-flight-accent font-bold shadow-[0_0_10px_rgba(163,113,247,0.3)]'
                  : 'bg-spacecraft-panel hover:bg-spacecraft-card border-spacecraft-border text-gray-200'
              }`}
              title="Launch Astronaut Digital Twin & What-If Simulation Sandbox"
            >
              <Cpu className="w-3.5 h-3.5 text-flight-accent animate-pulse" />
              <span>DIGITAL TWIN</span>
            </button>

            <button
              onClick={onOpenFaceBiometrics}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-spacecraft-panel hover:bg-spacecraft-card border border-spacecraft-border rounded text-[11px] text-gray-200 transition-colors"
              title="Open Webcam Biometric Facial Scanner"
            >
              <Camera className="w-3.5 h-3.5 text-flight-info" />
              <span>FACIAL HUD</span>
            </button>

            <button
              onClick={onOpenPVTTest}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-spacecraft-panel hover:bg-spacecraft-card border border-spacecraft-border rounded text-[11px] text-gray-200 transition-colors"
              title="Launch 30-Second Psychomotor Vigilance Test"
            >
              <PlayCircle className="w-3.5 h-3.5 text-flight-nominal" />
              <span>PVT TEST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Control Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Modes & Destination Tabs */}
        <div className="flex items-center gap-3">
          {/* Main View Switcher (Cockpit vs. Digital Twin) */}
          <div className="flex items-center bg-spacecraft-bg p-0.5 rounded border border-spacecraft-border text-xs font-mono">
            <button
              onClick={() => onToggleViewTab('MISSION_CONTROL')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-colors ${
                activeViewTab === 'MISSION_CONTROL'
                  ? 'bg-spacecraft-borderHighlight text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>MISSION CONTROL</span>
            </button>

            <button
              onClick={() => onToggleViewTab('DIGITAL_TWIN')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm transition-colors ${
                activeViewTab === 'DIGITAL_TWIN'
                  ? 'bg-flight-accent text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>DIGITAL TWIN LAB</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-spacecraft-border hidden md:block" />

          {/* Destination Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] text-gray-400 font-mono uppercase mr-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-400" /> PROFILE:
            </span>
            {Object.values(MISSION_PROFILES).map((prof) => {
              const isActive = prof.id === currentMissionId;
              return (
                <button
                  key={prof.id}
                  onClick={() => onSelectMission(prof.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all border ${
                    isActive
                      ? 'bg-flight-info/15 border-flight-info text-flight-info font-bold shadow-[0_0_8px_rgba(88,166,255,0.25)]'
                      : 'bg-spacecraft-card/80 border-spacecraft-border text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  <span>{prof.id}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded font-normal ${
                      isActive ? 'bg-flight-info text-black font-semibold' : 'bg-spacecraft-panel text-gray-400'
                    }`}
                  >
                    {prof.gravityLabel.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center / Right Control Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Astronaut Selector */}
          <div className="flex items-center gap-1.5 bg-spacecraft-card px-2.5 py-1 rounded border border-spacecraft-border">
            <UserCheck className="w-3.5 h-3.5 text-flight-info" />
            <span className="text-[11px] text-gray-400 font-mono">CREW:</span>
            <select
              value={selectedAstronaut.id}
              onChange={(e) => {
                const found = DEMO_ASTRONAUTS.find((a) => a.id === e.target.value);
                if (found) onSelectAstronaut(found);
              }}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              {DEMO_ASTRONAUTS.map((astro) => (
                <option key={astro.id} value={astro.id} className="bg-spacecraft-panel text-white">
                  {astro.name} ({astro.callsign})
                </option>
              ))}
            </select>
          </div>

          {/* Scenario / Hazard Injector */}
          <div className="flex items-center gap-1.5 bg-spacecraft-card px-2.5 py-1 rounded border border-flight-caution/50">
            <ShieldAlert className="w-3.5 h-3.5 text-flight-caution animate-pulse" />
            <span className="text-[11px] text-flight-caution font-mono font-semibold">HAZARD INJECTOR:</span>
            <select
              onChange={(e) => {
                if (e.target.value) onInjectScenario(e.target.value);
              }}
              defaultValue=""
              className="bg-transparent text-gray-200 font-mono text-xs focus:outline-none cursor-pointer max-w-[210px]"
            >
              <option value="" disabled className="bg-spacecraft-panel text-gray-400">
                -- Inject Mission Scenario --
              </option>
              {currentProfile.scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-spacecraft-panel text-white">
                  [{sc.severity}] {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-spacecraft-bg p-0.5 rounded border border-spacecraft-border text-xs font-mono">
            <button
              onClick={() => onToggleRole('CREW')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                activeRole === 'CREW'
                  ? 'bg-spacecraft-borderHighlight text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>SELF-LOG</span>
            </button>
            <button
              onClick={() => onToggleRole('CMO')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                activeRole === 'CMO'
                  ? 'bg-flight-info text-black font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              <span>CMO CONSOLE</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
