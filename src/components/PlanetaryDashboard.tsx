'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  MissionId,
  MISSION_PROFILES,
  getMissionProfile,
  FlightStatus,
  SystemCategory,
} from '@/config/missionProfiles';
import {
  AstronautBaseline,
  DEMO_ASTRONAUTS,
  evaluateCrossCorrelation,
  calculateBaselineDeviation,
  ExplainableAIAlert,
} from '@/lib/healthIntelligence';
import { MissionSelectorBar } from './MissionSelectorBar';
import { FaceBiometricModal } from './FaceBiometricModal';
import { AnatomyBodyMap } from './AnatomyBodyMap';
import { PVTReactionTest } from './PVTReactionTest';
import { AIInsightPanel } from './AIInsightPanel';
import { TrendCharts } from './TrendCharts';
import { HardwareCueCardsModal } from './HardwareCueCardsModal';
import {
  Activity,
  Heart,
  Wind,
  ShieldAlert,
  Radio,
  Sliders,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  FileText,
  Thermometer,
  Layers,
  ChevronRight,
  Info,
  ExternalLink,
} from 'lucide-react';

export function PlanetaryDashboard() {
  const [currentMissionId, setCurrentMissionId] = useState<MissionId>('ISS');
  const [activeRole, setActiveRole] = useState<'CREW' | 'CMO'>('CMO');
  const [selectedAstronaut, setSelectedAstronaut] = useState<AstronautBaseline>(DEMO_ASTRONAUTS[0]);

  // Modal states
  const [isFaceModalOpen, setIsFaceModalOpen] = useState<boolean>(false);
  const [isPVTModalOpen, setIsPVTModalOpen] = useState<boolean>(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState<boolean>(false);
  const [selectedCueCardId, setSelectedCueCardId] = useState<string | null>(null);

  // Selected anatomical category from Body Map
  const [selectedCategory, setSelectedCategory] = useState<SystemCategory | null>('OCULAR_NEURO');

  // Live face biometric indicators
  const [isLiveFaceActive, setIsLiveFaceActive] = useState<boolean>(false);
  const [liveEAR, setLiveEAR] = useState<number>(0.32);
  const [liveEdemaDelta, setLiveEdemaDelta] = useState<number>(4.2);

  const mission = getMissionProfile(currentMissionId);

  // Active telemetry values (seeded with nominal or scenario defaults)
  const [telemetryValues, setTelemetryValues] = useState<Record<string, number>>({});
  const [environmentValues, setEnvironmentValues] = useState<Record<string, number>>({});

  // Reset telemetry whenever mission profile changes
  useEffect(() => {
    const initialPhys: Record<string, number> = {};
    mission.physiologicalParameters.forEach((p) => {
      initialPhys[p.id] = (p.nominalRange[0] + p.nominalRange[1]) / 2;
    });

    const initialEnv: Record<string, number> = {};
    mission.environmentalParameters.forEach((e) => {
      initialEnv[e.id] = (e.nominalRange[0] + e.nominalRange[1]) / 2;
    });

    setTelemetryValues(initialPhys);
    setEnvironmentValues(initialEnv);
    setSelectedCategory(mission.prioritySystems[0]?.category || 'CARDIOVASCULAR');
  }, [currentMissionId]);

  // Sync face biometrics to telemetry stream if active
  useEffect(() => {
    if (isLiveFaceActive) {
      setTelemetryValues((prev) => ({
        ...prev,
        SANS_EDEMA_INDEX: liveEdemaDelta,
        OCULAR_EAR: liveEAR,
      }));
    }
  }, [liveEAR, liveEdemaDelta, isLiveFaceActive]);

  // Inject a preset mission scenario / anomaly
  const handleInjectScenario = (scenarioId: string) => {
    const scenario = mission.scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setTelemetryValues((prev) => ({
      ...prev,
      ...scenario.overrideTelemetry,
    }));

    setEnvironmentValues((prev) => ({
      ...prev,
      ...scenario.overrideEnvironment,
    }));
  };

  // Evaluate AI cross-correlation rules & alerts
  const aiAlerts = useMemo(() => {
    return evaluateCrossCorrelation(mission, telemetryValues, environmentValues, selectedAstronaut);
  }, [mission, telemetryValues, environmentValues, selectedAstronaut]);

  // Compute flight statuses for each anatomical category
  const categoryStatuses = useMemo(() => {
    const statuses: Record<SystemCategory, FlightStatus> = {
      CARDIOVASCULAR: 'NOMINAL',
      OCULAR_NEURO: 'NOMINAL',
      RESPIRATORY_DUST: 'NOMINAL',
      MUSCULOSKELETAL: 'NOMINAL',
      METABOLIC_HYDRATION: 'NOMINAL',
      IMMUNE_RADIATION: 'NOMINAL',
    };

    // Apply rule alerts
    aiAlerts.forEach((alert) => {
      if (alert.severity === 'WARNING') {
        statuses[alert.targetCategory] = 'WARNING';
      } else if (alert.severity === 'CAUTION' && statuses[alert.targetCategory] !== 'WARNING') {
        statuses[alert.targetCategory] = 'CAUTION';
      }
    });

    // Check individual physiological parameter thresholds
    mission.physiologicalParameters.forEach((p) => {
      const val = telemetryValues[p.id];
      if (val === undefined) return;

      const isWarning = val < p.warningRange[0] || val > p.warningRange[1];
      const isCaution = val < p.cautionRange[0] || val > p.cautionRange[1];

      if (isWarning) {
        statuses[p.category] = 'WARNING';
      } else if (isCaution && statuses[p.category] !== 'WARNING') {
        statuses[p.category] = 'CAUTION';
      }
    });

    return statuses;
  }, [aiAlerts, mission, telemetryValues]);

  // Handle open hardware cue card
  const handleOpenHardwareCueCard = (cueCardId: string) => {
    setSelectedCueCardId(cueCardId);
    setIsHardwareModalOpen(true);
  };

  // Handle PVT test results
  const handleRecordPVTResult = (meanRT: number, lapses: number, cognitiveScore: number) => {
    setTelemetryValues((prev) => ({
      ...prev,
      PVT_MEAN_REACTION_TIME: meanRT,
      PVT_LAPSES: lapses,
    }));
  };

  // Handle new custom astronaut enrollment
  const handleEnrollCustomAstronaut = (name: string, callsign: string, descriptor: number[]) => {
    const newAstro: AstronautBaseline = {
      id: `CUSTOM-${Date.now()}`,
      name,
      callsign,
      role: 'Mission Specialist / Live Biometric Enrolled',
      age: 35,
      gender: 'Other',
      flightExperienceDays: 0,
      preflightBaselines: {
        restingHeartRate: { mean: 60, sd: 4, unit: 'BPM' },
        hrvSdnn: { mean: 70, sd: 6, unit: 'ms' },
        systolicBP: { mean: 115, sd: 5, unit: 'mmHg' },
        diastolicBP: { mean: 75, sd: 4, unit: 'mmHg' },
        vo2Max: { mean: 50, sd: 2, unit: 'mL/kg/min' },
        eyeAspectRatio: { mean: 0.32, sd: 0.02, unit: 'ratio' },
        facialWidthToHeightRatio: { mean: 1.35, sd: 0.02, unit: 'ratio' },
        sleepEfficiency: { mean: 88, sd: 4, unit: '%' },
        pvtMedianLatency: { mean: 220, sd: 15, unit: 'ms' },
        boneMineralDensityTScore: { mean: 1.2, sd: 0.1, unit: 'T-score' },
      },
      faceDescriptorVector: descriptor,
    };
    setSelectedAstronaut(newAstro);
  };

  // Helper for telemetry status badge
  const getParamStatus = (
    val: number,
    nom: [number, number],
    caut: [number, number],
    warn: [number, number]
  ): FlightStatus => {
    if (val < warn[0] || val > warn[1]) return 'WARNING';
    if (val < caut[0] || val > caut[1]) return 'CAUTION';
    return 'NOMINAL';
  };

  return (
    <div className="min-h-screen bg-spacecraft-bg text-gray-200 flex flex-col font-mono selection:bg-flight-info selection:text-black">
      {/* 1. Header & Planetary Mission Selector */}
      <MissionSelectorBar
        currentMissionId={currentMissionId}
        onSelectMission={(id) => setCurrentMissionId(id)}
        activeRole={activeRole}
        onToggleRole={(role) => setActiveRole(role)}
        selectedAstronaut={selectedAstronaut}
        onSelectAstronaut={(astro) => setSelectedAstronaut(astro)}
        onInjectScenario={handleInjectScenario}
        onOpenFaceBiometrics={() => setIsFaceModalOpen(true)}
        onOpenPVTTest={() => setIsPVTModalOpen(true)}
        isLiveFaceActive={isLiveFaceActive}
      />

      {/* Main Mission Control Cockpit */}
      <main className="flex-1 p-4 max-w-[1680px] w-full mx-auto flex flex-col gap-4">
        {/* Mission Status Bar */}
        <div className="bg-spacecraft-surface p-3.5 rounded border border-spacecraft-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">{mission.name}</span>
            <span className="px-2 py-0.5 rounded bg-spacecraft-card text-flight-info border border-spacecraft-border font-semibold">
              {mission.gravityLabel}
            </span>
            <span className="text-gray-400 hidden md:inline">DESTINATION: {mission.destination}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-gray-400">RADIATION ENVIRONMENT:</span>
            <span className="text-flight-caution font-semibold">{mission.radiationProfile}</span>
          </div>
        </div>

        {/* Master Flight Alarm Banner if Warning Active */}
        {aiAlerts.some((a) => a.severity === 'WARNING') && (
          <div className="bg-flight-warning/15 border border-flight-warning p-3 rounded flex items-center justify-between gap-3 animate-pulse-warning">
            <div className="flex items-center gap-2 text-flight-warning">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider">
                  MASTER CAUTION / FLIGHT RULE THRESHOLD BREACHED:
                </span>{' '}
                <span className="text-xs text-white">
                  {aiAlerts.find((a) => a.severity === 'WARNING')?.detectedPattern}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const cueId = aiAlerts.find((a) => a.severity === 'WARNING')?.actionableCountermeasure
                  .hardwareRefId;
                if (cueId) handleOpenHardwareCueCard(cueId);
              }}
              className="px-3 py-1 bg-flight-warning hover:bg-red-600 text-black font-bold rounded text-xs transition-colors shrink-0"
            >
              ENGAGE CUE CARD COUNTERMEASURE
            </button>
          </div>
        )}

        {/* Top Grid: High Priority Physiological Telemetry + Environmental Pods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Active Priority Vitals */}
          {mission.physiologicalParameters.slice(0, 4).map((param) => {
            const val = telemetryValues[param.id] ?? (param.nominalRange[0] + param.nominalRange[1]) / 2;
            const status = getParamStatus(val, param.nominalRange, param.cautionRange, param.warningRange);

            const isWarn = status === 'WARNING';
            const isCaut = status === 'CAUTION';
            const statusBorder = isWarn
              ? 'border-flight-warning'
              : isCaut
              ? 'border-flight-caution'
              : 'border-spacecraft-border';
            const statusText = isWarn
              ? 'text-flight-warning'
              : isCaut
              ? 'text-flight-caution'
              : 'text-flight-nominal';

            return (
              <div
                key={param.id}
                className={`bg-spacecraft-surface p-3.5 rounded border ${statusBorder} flex flex-col justify-between gap-2 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 tracking-tight font-semibold">
                    {param.name}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isWarn
                        ? 'bg-flight-warning text-black'
                        : isCaut
                        ? 'bg-flight-caution text-black'
                        : 'bg-flight-nominal/20 text-flight-nominal'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-mono tabular-nums ${statusText}`}>
                    {val}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{param.unit}</span>
                </div>

                <div className="text-[10px] text-gray-500 border-t border-spacecraft-borderMuted pt-1 flex justify-between">
                  <span>Nominal: {param.nominalRange[0]}–{param.nominalRange[1]} {param.unit}</span>
                  <span className="text-flight-info font-bold">W{param.priorityWeight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle Section: Environmental Pods (NASA-STD-3001 Habitat / Suit Telemetry) */}
        <div className="bg-spacecraft-surface p-4 rounded border border-spacecraft-border flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-flight-info" />
              <h3 className="text-xs font-bold text-white tracking-wide">
                HABITAT & SUIT ENVIRONMENTAL TELEMETRY // NASA-STD-3001 ECLSS ARRAYS
              </h3>
            </div>
            <span className="text-[10px] text-gray-400">
              REAL-TIME HABITAT LIFE SUPPORT FEED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mission.environmentalParameters.map((env) => {
              const val = environmentValues[env.id] ?? (env.nominalRange[0] + env.nominalRange[1]) / 2;
              const status = getParamStatus(val, env.nominalRange, env.cautionRange, env.warningRange);

              const isWarn = status === 'WARNING';
              const isCaut = status === 'CAUTION';
              const borderCol = isWarn
                ? 'border-flight-warning bg-flight-warning/10'
                : isCaut
                ? 'border-flight-caution bg-flight-caution/10'
                : 'border-spacecraft-border bg-spacecraft-panel';

              return (
                <div
                  key={env.id}
                  className={`p-3 rounded border ${borderCol} flex flex-col justify-between gap-1.5`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white">{env.name}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
                        isWarn
                          ? 'bg-flight-warning text-black'
                          : isCaut
                          ? 'bg-flight-caution text-black'
                          : 'bg-flight-nominal/20 text-flight-nominal'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      {val}
                    </span>
                    <span className="text-xs text-gray-400">{env.unit}</span>
                  </div>

                  <div className="text-[10px] text-gray-400 leading-tight">
                    {env.nasaStandardRef}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Operational Split: Anatomy Body Map + AI Insights & Diagnostic Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Anatomical Body Map & Target Inspection (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <AnatomyBodyMap
              mission={mission}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              telemetry={telemetryValues}
              categoryStatuses={categoryStatuses}
            />

            {/* Selected System Focus Card */}
            {selectedCategory && (
              <div className="bg-spacecraft-surface p-4 rounded border border-spacecraft-border flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
                  <span className="text-xs font-bold text-white">
                    INSPECTION TARGET: {selectedCategory.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      categoryStatuses[selectedCategory] === 'WARNING'
                        ? 'bg-flight-warning text-black'
                        : categoryStatuses[selectedCategory] === 'CAUTION'
                        ? 'bg-flight-caution text-black'
                        : 'bg-flight-nominal/20 text-flight-nominal'
                    }`}
                  >
                    STATUS: {categoryStatuses[selectedCategory]}
                  </span>
                </div>

                {/* Filtered telemetry for this anatomical system */}
                <div className="flex flex-col gap-1.5">
                  {mission.physiologicalParameters
                    .filter((p) => p.category === selectedCategory)
                    .map((p) => {
                      const val = telemetryValues[p.id] ?? (p.nominalRange[0] + p.nominalRange[1]) / 2;
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded bg-spacecraft-panel text-xs border border-spacecraft-borderMuted"
                        >
                          <div>
                            <span className="font-semibold text-gray-200">{p.name}</span>
                            <div className="text-[10px] text-gray-400">{p.nasaRef}</div>
                          </div>
                          <div className="flex items-baseline gap-1.5 font-mono">
                            <span className="text-white font-bold">{val}</span>
                            <span className="text-gray-400 text-[10px]">{p.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Relevant Hardware Cue Cards */}
                <div className="pt-1">
                  <button
                    onClick={() => setIsHardwareModalOpen(true)}
                    className="w-full py-2 bg-spacecraft-card hover:bg-spacecraft-border text-flight-info rounded text-xs font-bold border border-spacecraft-border flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VIEW APPLICABLE HARDWARE CUE CARDS</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Explainable AI Health Intelligence & Trend Plots (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <AIInsightPanel
              alerts={aiAlerts}
              onOpenHardwareCueCard={handleOpenHardwareCueCard}
              activeRole={activeRole}
            />

            <TrendCharts
              mission={mission}
              selectedAstronaut={selectedAstronaut}
              telemetry={telemetryValues}
            />
          </div>
        </div>

        {/* Role-Specific Diagnostic / Self-Log Console */}
        {activeRole === 'CREW' ? (
          <div className="bg-spacecraft-surface p-4 rounded border border-spacecraft-border flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
              <span className="text-xs font-bold text-white tracking-wide">
                CREW SELF-LOG // DAILY SUBJECTIVE & SYMPTOM ENTRY
              </span>
              <span className="text-[10px] text-gray-400">
                ASTRONAUT: {selectedAstronaut.name} ({selectedAstronaut.callsign})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col gap-1.5">
                <span className="text-gray-400">HYDRATION INTAKE (L):</span>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="2.4"
                  className="bg-spacecraft-card border border-spacecraft-border rounded px-2 py-1 text-white font-mono"
                />
              </div>
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col gap-1.5">
                <span className="text-gray-400">POST-WORKOUT SORENESS (1-10):</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="3"
                  className="bg-spacecraft-card border border-spacecraft-border rounded px-2 py-1 text-white font-mono"
                />
              </div>
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col gap-1.5">
                <span className="text-gray-400">SUBJECTIVE SLEEP QUALITY (1-5):</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue="4"
                  className="bg-spacecraft-card border border-spacecraft-border rounded px-2 py-1 text-white font-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-spacecraft-surface p-4 rounded border border-spacecraft-border flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
              <span className="text-xs font-bold text-white tracking-wide">
                CMO (CREW MEDICAL OFFICER) DIAGNOSTIC & TELEMETRY SYNC CONSOLE
              </span>
              <span className="text-[10px] text-flight-info">
                DSN SYNC BUFFER: {mission.owltLabel} LATENCY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border">
                <span className="text-gray-400 text-[10px]">PRE-FLIGHT BASELINE COMPARISON</span>
                <div className="text-white font-bold mt-1">
                  Comparing current telemetry vs. L-30d personal mean ± SD
                </div>
              </div>
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border">
                <span className="text-gray-400 text-[10px]">AUTONOMOUS TRIAGE ADVISORY</span>
                <div className="text-flight-nominal font-bold mt-1">
                  No critical surgical or pharmacological intervention required
                </div>
              </div>
              <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border">
                <span className="text-gray-400 text-[10px]">DOWNLINK TELEMETRY BUFFER</span>
                <div className="text-gray-300 font-bold mt-1">
                  14 packets queued for Goldstone DSN pass
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Scientific & Medical Accuracy Guardrail Footer */}
      <footer className="w-full bg-spacecraft-surface border-t border-spacecraft-border px-4 py-3 mt-4 text-[11px] font-mono text-gray-400 select-none">
        <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-flight-info shrink-0" />
            <span>
              ASTROVITAL // 2026 NASA Space Apps Challenge Prototype. Implements reference models from{' '}
              <span className="text-gray-200 font-semibold">NASA-STD-3001</span> and the{' '}
              <span className="text-gray-200 font-semibold">NASA Human Research Program (HRP)</span>.
            </span>
          </div>

          <div className="text-gray-500 text-[10px]">
            NON-DIAGNOSTIC OPERATIONAL TELEMETRY & DECISION SUPPORT ONLY.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FaceBiometricModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        selectedAstronaut={selectedAstronaut}
        onUpdateBiometrics={(ear, edema, match) => {
          setLiveEAR(ear);
          setLiveEdemaDelta(edema);
          setIsLiveFaceActive(true);
        }}
        onEnrollCustomAstronaut={handleEnrollCustomAstronaut}
      />

      <PVTReactionTest
        isOpen={isPVTModalOpen}
        onClose={() => setIsPVTModalOpen(false)}
        astronautName={selectedAstronaut.name}
        onRecordResult={handleRecordPVTResult}
      />

      <HardwareCueCardsModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        selectedCueCardId={selectedCueCardId}
        onSelectCueCard={(id) => setSelectedCueCardId(id)}
      />
    </div>
  );
}
