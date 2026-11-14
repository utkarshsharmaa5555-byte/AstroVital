'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MissionId,
  MISSION_PROFILES,
  getMissionProfile,
  FlightStatus,
  SystemCategory,
} from '@/config/missionProfiles';
import {
  AstronautProfile,
  PRESET_ASTRONAUTS,
  JUDGE_DEMO_SCENARIOS,
} from '@/lib/baselineEngine';
import {
  AstronautBaseline,
  evaluateCrossCorrelation,
  calculateBaselineDeviation,
  ExplainableAIAlert,
} from '@/lib/healthIntelligence';

import { BiometricLoginPage } from './BiometricLoginPage';
import { CrewProfileStrip } from './CrewProfileStrip';
import { LiveEquipmentSimulator } from './LiveEquipmentSimulator';
import { AnatomyBodyMap } from './AnatomyBodyMap';
import { AIInsightPanel } from './AIInsightPanel';
import { TrendCharts } from './TrendCharts';
import { PVTReactionTest } from './PVTReactionTest';
import { HardwareCueCardsModal } from './HardwareCueCardsModal';
import { DigitalTwinView } from './DigitalTwinView';
import { NeonSyncCard } from './NeonSyncCard';

import {
  ShieldCheck,
  Activity,
  Heart,
  Wind,
  Zap,
  TrendingUp,
  Brain,
  Clock,
  Radio,
  Layers,
  Cpu,
  Sparkles,
  Database,
  BookOpen,
  UserCheck,
  LogOut,
  Globe,
  ChevronRight,
  Info,
  Lock,
} from 'lucide-react';

type DiagnosticTabId = 'TRENDS' | 'BODY_MAP' | 'AI_INSIGHTS' | 'PVT_TEST';

export function PlanetaryDashboard() {
  // Authentication State: null means show BiometricLoginPage
  const [authenticatedCrew, setAuthenticatedCrew] = useState<AstronautProfile | null>(null);

  // Mission Destination State: ISS | MOON | MARS | DEEP_SPACE
  const [currentMissionId, setCurrentMissionId] = useState<MissionId>('ISS');
  const [activeRole, setActiveRole] = useState<'CREW' | 'CMO'>('CMO');

  // Active Diagnostic Tab: TRENDS | BODY_MAP | AI_INSIGHTS | PVT_TEST
  const [activeTab, setActiveTab] = useState<DiagnosticTabId>('TRENDS');

  // Active Judge Scenario
  const [activeScenarioId, setActiveScenarioId] = useState<string>('nominal_orbit');

  // Modals
  const [isCueCardsOpen, setIsCueCardsOpen] = useState<boolean>(false);
  const [selectedCueCardId, setSelectedCueCardId] = useState<string | null>(null);
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState<boolean>(false);
  const [showNeonPanel, setShowNeonPanel] = useState<boolean>(false);

  // Selected Body Map Category
  const [selectedBodyCategory, setSelectedBodyCategory] = useState<SystemCategory | null>('OCULAR_NEURO');

  // Live ticking MET clock
  const [metSeconds, setMetSeconds] = useState<number>(114 * 86400 + 8 * 3600 + 22 * 60 + 15);

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

  const currentMission = getMissionProfile(currentMissionId);

  // Telemetry values state
  const [telemetryValues, setTelemetryValues] = useState<Record<string, number>>({
    HEART_RATE: 64,
    BODY_TEMP: 36.8,
    BP_SYS: 116,
    BP_DIA: 74,
    CABIN_PRESSURE: 14.7,
    BLOOD_GLUCOSE: 90,
    BLOOD_POTASSIUM: 4.2,
    OCULAR_IOP: 14.8,
    SANS_FLUID_INDEX: 4.0,
    PVT_MEAN_REACTION_TIME: 220,
    RESP_RATE: 14,
    RADIATION_FLUX: 0.04,
    HRV_SDNN: 76,
    O2_PERCENT: 20.9,
    CO2_PP: 2.8,
  });

  const [environmentValues, setEnvironmentValues] = useState<Record<string, number>>({
    CABIN_PRESSURE: 14.7,
    CABIN_CO2: 2.8,
    CABIN_O2: 20.9,
    LUNAR_REGOLITH_DUST: 0.12,
    MARTIAN_DUST_PM10: 0.18,
    SPE_RADIATION_FLUX: 0.05,
  });

  // Handle Scenario Selection
  const handleSelectScenario = useCallback((scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    const scenario = JUDGE_DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setTelemetryValues((prev) => ({
      ...prev,
      HEART_RATE: scenario.overrides.heartRate,
      BODY_TEMP: scenario.overrides.bodyTemp,
      BP_SYS: scenario.overrides.bloodPressureSys,
      BP_DIA: scenario.overrides.bloodPressureDia,
      CABIN_PRESSURE: scenario.overrides.cabinPressure,
      BLOOD_GLUCOSE: scenario.overrides.bloodGlucose ?? prev.BLOOD_GLUCOSE,
      BLOOD_POTASSIUM: scenario.overrides.bloodPotassium ?? prev.BLOOD_POTASSIUM,
      OCULAR_IOP: scenario.overrides.intraocularPressure ?? prev.OCULAR_IOP,
      SANS_FLUID_INDEX: scenario.overrides.sansFluidIndex ?? prev.SANS_FLUID_INDEX,
      PVT_MEAN_REACTION_TIME: scenario.overrides.pvtReactionTime ?? prev.PVT_MEAN_REACTION_TIME,
      RESP_RATE: scenario.overrides.respiratoryRate ?? prev.RESP_RATE,
      RADIATION_FLUX: scenario.overrides.radiationFlux ?? prev.RADIATION_FLUX,
    }));
  }, []);

  // Update mission environment adaptation
  const handleSelectMission = (missionId: MissionId) => {
    setCurrentMissionId(missionId);
    const newMission = getMissionProfile(missionId);

    // Adapt nominal cabin pressure: 14.7 psia for ISS & Deep Space; 8.2 psia for Moon/Mars Exploration
    const targetPressure = missionId === 'MOON' || missionId === 'MARS' ? 8.2 : 14.7;
    setTelemetryValues((prev) => ({
      ...prev,
      CABIN_PRESSURE: targetPressure,
    }));

    setEnvironmentValues((prev) => ({
      ...prev,
      CABIN_PRESSURE: targetPressure,
    }));

    if (newMission.prioritySystems[0]) {
      setSelectedBodyCategory(newMission.prioritySystems[0].category);
    }
  };

  // Convert baseline profile to AstronautBaseline for downstream legacy charts
  const astronautBaseline: AstronautBaseline = useMemo(() => {
    const astro = authenticatedCrew || PRESET_ASTRONAUTS[0];
    return {
      id: astro.id,
      name: astro.name,
      callsign: astro.callsign,
      role: astro.role,
      age: astro.age,
      gender: astro.name.includes('Elena') ? 'Female' : 'Male',
      flightExperienceDays: 342,
      preflightBaselines: {
        restingHeartRate: { mean: astro.baselines.heartRate.mean, sd: 3.5, unit: 'BPM' },
        hrvSdnn: { mean: 78, sd: 7.2, unit: 'ms' },
        systolicBP: { mean: astro.baselines.bloodPressureSys.mean, sd: 4.8, unit: 'mmHg' },
        diastolicBP: { mean: astro.baselines.bloodPressureDia.mean, sd: 3.6, unit: 'mmHg' },
        vo2Max: { mean: 48.5, sd: 1.8, unit: 'mL/kg/min' },
        eyeAspectRatio: { mean: 0.33, sd: 0.02, unit: 'ratio' },
        facialWidthToHeightRatio: { mean: 1.34, sd: 0.015, unit: 'ratio' },
        sleepEfficiency: { mean: 89, sd: 4.0, unit: '%' },
        pvtMedianLatency: { mean: astro.baselines.pvtReactionTime.mean, sd: 14.5, unit: 'ms' },
        boneMineralDensityTScore: { mean: 1.1, sd: 0.15, unit: 'T-score' },
      },
    };
  }, [authenticatedCrew]);

  // AI Alerts derived from cross-variable correlation
  const aiAlerts: ExplainableAIAlert[] = useMemo(() => {
    return evaluateCrossCorrelation(
      currentMission,
      telemetryValues,
      environmentValues,
      astronautBaseline
    );
  }, [currentMission, telemetryValues, environmentValues, astronautBaseline]);

  // Category status map for Body Map
  const categoryStatuses: Record<SystemCategory, FlightStatus> = useMemo(() => {
    const map: Record<SystemCategory, FlightStatus> = {
      OCULAR_NEURO: 'NOMINAL',
      CARDIOVASCULAR: 'NOMINAL',
      RESPIRATORY_DUST: 'NOMINAL',
      MUSCULOSKELETAL: 'NOMINAL',
      METABOLIC_HYDRATION: 'NOMINAL',
      IMMUNE_RADIATION: 'NOMINAL',
    };

    aiAlerts.forEach((a) => {
      if (a.targetCategory && map[a.targetCategory] !== undefined) {
        if (a.severity === 'WARNING') {
          map[a.targetCategory] = 'WARNING';
        } else if (a.severity === 'CAUTION' && map[a.targetCategory] !== 'WARNING') {
          map[a.targetCategory] = 'CAUTION';
        }
      }
    });

    return map;
  }, [aiAlerts]);

  // If user is not yet logged in, render the clean Stage 1 Biometric Login Screen
  if (!authenticatedCrew) {
    return (
      <BiometricLoginPage
        onLogin={(astro) => {
          setAuthenticatedCrew(astro);
          // Apply astronaut's baseline mean defaults
          setTelemetryValues((prev) => ({
            ...prev,
            HEART_RATE: astro.baselines.heartRate.mean,
            BODY_TEMP: astro.baselines.bodyTemp.mean,
            BP_SYS: astro.baselines.bloodPressureSys.mean,
            BP_DIA: astro.baselines.bloodPressureDia.mean,
          }));
        }}
      />
    );
  }

  // Open specific cue card
  const handleOpenCueCard = (cueCardId: string) => {
    setSelectedCueCardId(cueCardId);
    setIsCueCardsOpen(true);
  };

  // Record PVT result into telemetry
  const handleRecordPVT = (avgRT: number, lapses: number, cognitiveScore: number) => {
    setTelemetryValues((prev) => ({
      ...prev,
      PVT_MEAN_REACTION_TIME: avgRT,
      PVT_LAPSES: lapses,
      COGNITIVE_SCORE: cognitiveScore,
    }));
  };

  const destinations: { id: MissionId; label: string; gravity: string; owlt: string }[] = [
    { id: 'ISS', label: 'ISS (Low Earth Orbit)', gravity: '0g Microgravity', owlt: '0.1s Comms Link' },
    { id: 'MOON', label: 'MOON (Artemis Base Camp)', gravity: '1/6g Hypogravity', owlt: '1.3s Comms Delay' },
    { id: 'MARS', label: 'MARS (Surface Habitat)', gravity: '3/8g Gravity', owlt: '14.2m Comms Delay' },
    { id: 'DEEP_SPACE', label: 'DEEP SPACE (Transit Gateway)', gravity: '0g Transit', owlt: '48.5m Comms Delay' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col font-sans selection:bg-[#58A6FF]/30">
      {/* 1. TOP AEROSPACE COMMAND & TELEMETRY CONTROL BAR */}
      <header className="w-full bg-[#131822] border-b border-[#262E3D] px-4 sm:px-6 py-3 select-none sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Logo & Operational Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#0B0E14] border border-[#262E3D] flex items-center justify-center text-[#58A6FF]">
                <Activity className="w-4 h-4 text-[#2EA043] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-wider text-white">ASTROVITAL</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2EA043]/15 text-[#2EA043] border border-[#2EA043]/30 font-bold">
                    NASA-STD-3001
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  MULTI-PLANETARY ASTRONAUT HEALTH INTELLIGENCE
                </div>
              </div>
            </div>

            <div className="h-4 w-[1px] bg-[#262E3D] hidden lg:block" />

            {/* Live Ticking MET */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0E14] border border-[#262E3D] font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span className="text-gray-400 font-semibold">MET:</span>
              <span className="text-white font-bold tabular-nums">{formatMET(metSeconds)}</span>
            </div>

            {/* Data Provenance Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0E14] border border-[#262E3D] font-mono text-[10px] text-[#58A6FF]">
              <Radio className="w-3 h-3 text-[#2EA043] animate-ping" />
              <span>[SIMULATED TELEMETRY // NASA-STD-3001 REFERENCE MODEL]</span>
            </div>
          </div>

          {/* Role Switcher & Auxiliary Tools */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {/* Role Switcher */}
            <div className="flex items-center bg-[#0B0E14] rounded-md border border-[#262E3D] p-0.5">
              <button
                onClick={() => setActiveRole('CREW')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  activeRole === 'CREW'
                    ? 'bg-[#18202E] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CREW SELF-LOG
              </button>
              <button
                onClick={() => setActiveRole('CMO')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  activeRole === 'CMO'
                    ? 'bg-[#58A6FF] text-black font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CMO CONSOLE
              </button>
            </div>

            {/* Digital Twin Modal Button */}
            <button
              onClick={() => setIsDigitalTwinOpen(true)}
              className="px-2.5 py-1.5 rounded bg-[#18202E] hover:bg-[#20293A] border border-[#262E3D] text-[11px] text-gray-200 flex items-center gap-1.5 transition"
            >
              <Cpu className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>DIGITAL TWIN</span>
            </button>

            {/* Hardware Cue Cards Button */}
            <button
              onClick={() => {
                setSelectedCueCardId(null);
                setIsCueCardsOpen(true);
              }}
              className="px-2.5 py-1.5 rounded bg-[#18202E] hover:bg-[#20293A] border border-[#262E3D] text-[11px] text-gray-200 flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D29922]" />
              <span>CUE CARDS</span>
            </button>

            {/* Neon DB Sync Toggle */}
            <button
              onClick={() => setShowNeonPanel(!showNeonPanel)}
              className="px-2.5 py-1.5 rounded bg-[#18202E] hover:bg-[#20293A] border border-[#262E3D] text-[11px] text-emerald-400 flex items-center gap-1.5 transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>NEON DB</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PLANETARY DESTINATION SELECTOR BAR */}
      <nav className="w-full bg-[#0F141E] border-b border-[#262E3D] px-4 sm:px-6 py-2.5 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
            <Globe className="w-4 h-4 text-[#58A6FF]" />
            <span className="font-semibold text-white">MISSION PROFILE:</span>
          </div>

          {/* Destination Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 md:max-w-2xl">
            {destinations.map((dest) => {
              const isSelected = currentMissionId === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => handleSelectMission(dest.id)}
                  className={`px-3 py-2 rounded-[6px] border text-left font-mono transition flex flex-col ${
                    isSelected
                      ? 'bg-[#18202E] border-[#58A6FF] text-white ring-1 ring-[#58A6FF]/40'
                      : 'bg-[#131822] border-[#262E3D] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">
                      {dest.id === 'DEEP_SPACE' ? 'DEEP SPACE' : dest.id}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#58A6FF]' : 'bg-gray-600'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 truncate">{dest.gravity}</div>
                </button>
              );
            })}
          </div>

          {/* Planetary Physics Info Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded bg-[#131822] border border-[#262E3D] font-mono text-[11px] text-gray-300">
            <span className="text-[#58A6FF] font-semibold">
              OWLT COMMS DELAY: {currentMission.owltLabel}
            </span>
            <span className="text-gray-500">•</span>
            <span>PRESSURE TARGET: {currentMissionId === 'MOON' || currentMissionId === 'MARS' ? '8.2' : '14.7'} psia</span>
          </div>
        </div>
      </nav>

      {/* MAIN COCKPIT VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        {/* Optional Neon DB Health & Telemetry Sync Card (Collapsible) */}
        {showNeonPanel && (
          <div className="animate-in fade-in duration-200">
            <NeonSyncCard
              mission={currentMission}
              astronaut={astronautBaseline}
              telemetry={telemetryValues}
            />
          </div>
        )}

        {/* STAGE 2: POST-LOGIN PROFILE OVERVIEW & STRICTLY ORDERED VITALS STRIP */}
        <CrewProfileStrip
          astronaut={authenticatedCrew}
          missionId={currentMissionId}
          liveVitals={{
            bodyTemp: telemetryValues.BODY_TEMP,
            heartRate: telemetryValues.HEART_RATE,
            bloodPressureSys: telemetryValues.BP_SYS,
            bloodPressureDia: telemetryValues.BP_DIA,
            cabinPressure: telemetryValues.CABIN_PRESSURE,
            o2Percent: telemetryValues.O2_PERCENT,
          }}
          onSwitchCrew={() => setAuthenticatedCrew(null)}
        />

        {/* STAGE 3: LIVE SPACE MEDICAL EQUIPMENT SIMULATOR & PRE-FLIGHT BASELINE DIVERGENCE */}
        <LiveEquipmentSimulator
          astronaut={authenticatedCrew}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          telemetry={telemetryValues}
          onOpenHardwareCueCard={handleOpenCueCard}
        />

        {/* STAGE 4: 4 CLEAN DIAGNOSTIC TABS & ENVIRONMENT-ADAPTIVE VIEWS */}
        <div className="w-full flex flex-col gap-4">
          {/* Tab Selection Bar */}
          <div className="flex items-center border-b border-[#262E3D] bg-[#131822] rounded-t-[10px] px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('TRENDS')}
              className={`py-3 px-4 font-mono text-xs font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'TRENDS'
                  ? 'border-[#58A6FF] text-[#58A6FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              1. LIVE BASELINE & TRENDS (RECHARTS)
            </button>

            <button
              onClick={() => setActiveTab('BODY_MAP')}
              className={`py-3 px-4 font-mono text-xs font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'BODY_MAP'
                  ? 'border-[#58A6FF] text-[#58A6FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              2. INTERACTIVE BODY MAP & SELF-EXAM
            </button>

            <button
              onClick={() => setActiveTab('AI_INSIGHTS')}
              className={`py-3 px-4 font-mono text-xs font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'AI_INSIGHTS'
                  ? 'border-[#58A6FF] text-[#58A6FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              3. EXPLAINABLE AI RISK & PREDICTIONS
              {aiAlerts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#F85149]/20 text-[#F85149] text-[10px] font-bold">
                  {aiAlerts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PVT_TEST')}
              className={`py-3 px-4 font-mono text-xs font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'PVT_TEST'
                  ? 'border-[#58A6FF] text-[#58A6FF]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              4. 30-SEC COGNITIVE REACTION TEST (PVT)
            </button>
          </div>

          {/* Active Tab Content Panes */}
          <div className="w-full">
            {activeTab === 'TRENDS' && (
              <TrendCharts
                mission={currentMission}
                selectedAstronaut={astronautBaseline}
                telemetry={telemetryValues}
              />
            )}

            {activeTab === 'BODY_MAP' && (
              <AnatomyBodyMap
                mission={currentMission}
                selectedCategory={selectedBodyCategory}
                onSelectCategory={(cat) => setSelectedBodyCategory(cat)}
                telemetry={telemetryValues}
                categoryStatuses={categoryStatuses}
              />
            )}

            {activeTab === 'AI_INSIGHTS' && (
              <AIInsightPanel
                alerts={aiAlerts}
                onOpenHardwareCueCard={handleOpenCueCard}
                activeRole={activeRole}
              />
            )}

            {activeTab === 'PVT_TEST' && (
              <div className="bg-[#131822] border border-[#262E3D] rounded-b-[10px] p-4 sm:p-6">
                <PVTReactionTest
                  isOpen={true}
                  isModal={false}
                  astronautName={authenticatedCrew.name}
                  onRecordResult={handleRecordPVT}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0F141E] border-t border-[#262E3D] px-6 py-4 mt-8 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-gray-500 gap-2">
          <span>ASTROVITAL // 2026 NASA SPACE APPS CHALLENGE</span>
          <span>FLIGHT CERTIFIED FOR ISS, ARTEMIS LUNAR SURFACE, AND MARS MISSIONS</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Hardware Cue Cards Modal */}
      <HardwareCueCardsModal
        isOpen={isCueCardsOpen}
        onClose={() => setIsCueCardsOpen(false)}
        selectedCueCardId={selectedCueCardId}
        onSelectCueCard={(id) => setSelectedCueCardId(id)}
      />

      {/* 2. Digital Twin What-If Simulator Modal */}
      {isDigitalTwinOpen && (
        <DigitalTwinView
          mission={currentMission}
          astronaut={astronautBaseline}
          telemetry={telemetryValues}
          isOpenAsModal={true}
          onClose={() => setIsDigitalTwinOpen(false)}
        />
      )}
    </div>
  );
}
