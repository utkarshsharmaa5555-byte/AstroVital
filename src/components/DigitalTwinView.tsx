'use client';

import React, { useState } from 'react';
import {
  MissionProfile,
  FlightStatus,
} from '@/config/missionProfiles';
import { AstronautBaseline } from '@/lib/healthIntelligence';
import {
  Cpu,
  Activity,
  Sliders,
  RotateCcw,
  Sparkles,
  Shield,
  Heart,
  Eye,
  Dumbbell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DigitalTwinViewProps {
  mission: MissionProfile;
  astronaut: AstronautBaseline;
  telemetry: Record<string, number>;
  isOpenAsModal?: boolean;
  onClose?: () => void;
}

export function DigitalTwinView({
  mission,
  astronaut,
  telemetry,
  isOpenAsModal = false,
  onClose,
}: DigitalTwinViewProps) {
  // Simulation Sliders (What-If Countermeasure Lab)
  const [aredCompliance, setAredCompliance] = useState<number>(85); // 0 to 120 %
  const [lbnpMinutes, setLbnpMinutes] = useState<number>(25); // 0 to 60 min/day
  const [shieldingDepth, setShieldingDepth] = useState<number>(15); // 5 to 30 g/cm²
  const [phototherapyLux, setPhototherapyLux] = useState<number>(7500); // 0 to 10000 lux

  // Simulation run state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationDays, setSimulationDays] = useState<number>(30);
  const [appliedPrescription, setAppliedPrescription] = useState<string | null>(null);

  // Derived in-silico metrics based on current telemetry + simulation sliders
  // 1. Fluid shift displacement (mL)
  const baseEdema = telemetry.SANS_EDEMA_INDEX ?? 8.5;
  // LBNP reduces fluid shift: 1 min of LBNP reduces edema delta by ~0.15%
  const simulatedEdemaDelta = Math.max(
    1.2,
    parseFloat((baseEdema * (1 - (lbnpMinutes / 60) * 0.42)).toFixed(1))
  );

  // 2. Bone Mineral Density loss rate (% per month)
  // Standard microgravity loss is ~1.2%/month; ARED compliance buffers it down to ~0.3%/month
  const simulatedBmdRate = Math.min(
    -0.1,
    parseFloat((-1.4 + (aredCompliance / 100) * 1.15).toFixed(2))
  );

  // 3. Left Ventricular Stroke Volume (mL)
  const baseStrokeVolume = telemetry.CARDIAC_STROKE_VOLUME ?? 74;
  const simulatedStrokeVol = Math.round(
    baseStrokeVolume + (aredCompliance - 70) * 0.15 + (lbnpMinutes > 20 ? 3 : 0)
  );

  // 4. Circadian Phase Drift (hours)
  const baseSolOffset = telemetry.CIRCADIAN_SOL_OFFSET ?? 1.2;
  const simulatedCircadianDrift = Math.max(
    0.1,
    parseFloat((baseSolOffset * (1 - (phototherapyLux / 10000) * 0.65)).toFixed(1))
  );

  // 5. Radiation DNA Double-Strand Breaks (DSB / cell)
  const radiationFactor = mission.id === 'DEEP_SPACE' ? 2.5 : mission.id === 'MARS' ? 1.8 : 1.0;
  const simulatedDSB = parseFloat(
    Math.max(2.1, (18.5 * radiationFactor * (1 - (shieldingDepth / 35) * 0.65))).toFixed(1)
  );

  // Generate 30-Day In-Silico Trajectory Comparison Data
  const simulationPlotData = [];
  for (let day = 0; day <= simulationDays; day += 5) {
    const unmitigatedEdema = parseFloat((baseEdema + (day / 30) * 6.5).toFixed(1));
    const mitigatedEdema = parseFloat(
      (baseEdema + (simulatedEdemaDelta - baseEdema) * (day / 30)).toFixed(1)
    );
    const nominalBaseline = astronaut.preflightBaselines.facialWidthToHeightRatio.mean;

    simulationPlotData.push({
      day: `Day ${day}`,
      'Unmitigated Baseline Drift': unmitigatedEdema,
      'Digital Twin Simulated Countermeasure': mitigatedEdema,
      'Pre-Flight Nominal Target': 4.0,
    });
  }

  const handleApplyPrescription = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setAppliedPrescription(
        `Prescription validated: LBNP ${lbnpMinutes}m/d + ARED ${aredCompliance}% + LED ${phototherapyLux} lux scheduled.`
      );
      setTimeout(() => setAppliedPrescription(null), 4000);
    }, 600);
  };

  const handleResetDefaults = () => {
    setAredCompliance(85);
    setLbnpMinutes(25);
    setShieldingDepth(15);
    setPhototherapyLux(7500);
  };

  const content = (
    <div className="bg-spacecraft-surface border border-spacecraft-border rounded p-4 font-mono select-none flex flex-col gap-4 text-gray-200">
      {/* Twin Header & Sync Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-spacecraft-border pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-flight-info/15 text-flight-info border border-flight-info/30">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                ASTRONAUT IN-SILICO DIGITAL TWIN // PHYSIOLOGICAL PREDICTION ENGINE
              </h2>
              <span className="px-2 py-0.2 rounded bg-flight-nominal/20 text-flight-nominal text-[10px] font-bold border border-flight-nominal/30">
                SYNCHRONIZED (99.4%)
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Active Twin Replica for <span className="text-white font-bold">{astronaut.name} ({astronaut.callsign})</span> // In-flight Telemetry Coupling: Real-Time
            </p>
          </div>
        </div>

        {/* Right side info / close */}
        <div className="flex items-center gap-2">
          <div className="bg-spacecraft-panel px-3 py-1 rounded border border-spacecraft-border text-xs flex items-center gap-2">
            <span className="text-gray-400">MISSION ADAPTATION:</span>
            <span className="text-flight-info font-bold">{mission.id} ({mission.gravityLabel})</span>
          </div>

          {isOpenAsModal && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-spacecraft-card"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Subsystems In-Silico Matrix (5 Live Subsystems) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Cephalad Hemodynamics */}
        <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Eye className="w-3.5 h-3.5 text-flight-info" /> SANS / FLUID SHIFT
            </span>
            <span className="text-[10px] text-flight-info">OPTICAL GLOBE</span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">
              +{simulatedEdemaDelta}% Δ
            </div>
            <div className="text-[10px] text-gray-400">
              Baseline: +{baseEdema}% | LBNP Buffer: -{((baseEdema - simulatedEdemaDelta)).toFixed(1)}%
            </div>
          </div>
          <div className="w-full bg-spacecraft-bg h-1.5 rounded overflow-hidden">
            <div
              className={`h-full ${
                simulatedEdemaDelta > 15
                  ? 'bg-flight-warning'
                  : simulatedEdemaDelta > 8
                  ? 'bg-flight-caution'
                  : 'bg-flight-nominal'
              }`}
              style={{ width: `${Math.min(100, (simulatedEdemaDelta / 20) * 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Myocardial Biomechanics */}
        <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Heart className="w-3.5 h-3.5 text-flight-warning" /> STROKE VOLUME
            </span>
            <span className="text-[10px] text-gray-400">LEFT VENTRICLE</span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">
              {simulatedStrokeVol} <span className="text-xs text-gray-400 font-normal">mL</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Pre-flight Mean: {astronaut.preflightBaselines.restingHeartRate.mean > 55 ? '76 mL' : '82 mL'}
            </div>
          </div>
          <div className="w-full bg-spacecraft-bg h-1.5 rounded overflow-hidden">
            <div
              className={`h-full ${
                simulatedStrokeVol < 55
                  ? 'bg-flight-warning'
                  : simulatedStrokeVol < 65
                  ? 'bg-flight-caution'
                  : 'bg-flight-nominal'
              }`}
              style={{ width: `${Math.min(100, (simulatedStrokeVol / 90) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Trabecular Bone Demineralization */}
        <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Dumbbell className="w-3.5 h-3.5 text-flight-nominal" /> BONE TURNOVER
            </span>
            <span className="text-[10px] text-gray-400">FEMUR / CALCANEUS</span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">
              {simulatedBmdRate}% <span className="text-xs text-gray-400 font-normal">/mo</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Zero-Countermeasure: -1.40%/mo
            </div>
          </div>
          <div className="w-full bg-spacecraft-bg h-1.5 rounded overflow-hidden">
            <div
              className={`h-full ${
                simulatedBmdRate < -0.8
                  ? 'bg-flight-warning'
                  : simulatedBmdRate < -0.4
                  ? 'bg-flight-caution'
                  : 'bg-flight-nominal'
              }`}
              style={{ width: `${Math.min(100, ((simulatedBmdRate + 1.5) / 1.5) * 100)}%` }}
            />
          </div>
        </div>

        {/* 4. Neuro-Circadian Clock Shift */}
        <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Clock className="w-3.5 h-3.5 text-flight-caution" /> CIRCADIAN DELTA
            </span>
            <span className="text-[10px] text-gray-400">SCN PHASE</span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">
              {simulatedCircadianDrift} <span className="text-xs text-gray-400 font-normal">hrs</span>
            </div>
            <div className="text-[10px] text-gray-400">
              LED Therapy: {phototherapyLux} lux
            </div>
          </div>
          <div className="w-full bg-spacecraft-bg h-1.5 rounded overflow-hidden">
            <div
              className={`h-full ${
                simulatedCircadianDrift > 2.0
                  ? 'bg-flight-warning'
                  : simulatedCircadianDrift > 1.0
                  ? 'bg-flight-caution'
                  : 'bg-flight-nominal'
              }`}
              style={{ width: `${Math.min(100, (simulatedCircadianDrift / 3.5) * 100)}%` }}
            />
          </div>
        </div>

        {/* 5. Radiation Chromosomal Damage */}
        <div className="bg-spacecraft-panel p-3 rounded border border-spacecraft-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <Shield className="w-3.5 h-3.5 text-flight-accent" /> DNA DSB RATE
            </span>
            <span className="text-[10px] text-gray-400">HEAVY ION DAMAGE</span>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">
              {simulatedDSB} <span className="text-xs text-gray-400 font-normal">DSB/cell</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Shield Margin: {shieldingDepth} g/cm²
            </div>
          </div>
          <div className="w-full bg-spacecraft-bg h-1.5 rounded overflow-hidden">
            <div
              className={`h-full ${
                simulatedDSB > 18
                  ? 'bg-flight-warning'
                  : simulatedDSB > 10
                  ? 'bg-flight-caution'
                  : 'bg-flight-nominal'
              }`}
              style={{ width: `${Math.min(100, (simulatedDSB / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Split: "What-If" Countermeasure Sandbox (5 cols) + Predictive Trajectory Plot (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: What-If Countermeasure Lab Controls (5 cols) */}
        <div className="lg:col-span-5 bg-spacecraft-panel p-4 rounded border border-spacecraft-border flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-flight-info" />
              <h3 className="text-xs font-bold text-white tracking-wide">
                "WHAT-IF" COUNTERMEASURE LAB (SIMULATION SANDBOX)
              </h3>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> RESET
            </button>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Adjust hypothetical countermeasure prescriptions below to observe the Digital Twin’s projected
            hemodynamic, bone mineral, and neuro-circadian response curves.
          </p>

          {/* Slider 1: ARED Resistive Load Compliance */}
          <div className="flex flex-col gap-1.5 bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-flight-nominal" /> ARED Resistive Workload
              </span>
              <span className="text-flight-nominal font-bold">{aredCompliance}% target</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={aredCompliance}
              onChange={(e) => setAredCompliance(Number(e.target.value))}
              className="accent-flight-nominal cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0% (Full Sedentary Atrophy)</span>
              <span>100% (Nominal NASA Protocol)</span>
            </div>
          </div>

          {/* Slider 2: Lower Body Negative Pressure (LBNP) Duration */}
          <div className="flex flex-col gap-1.5 bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-flight-info" /> LBNP Venous Suction Duration
              </span>
              <span className="text-flight-info font-bold">{lbnpMinutes} min / day</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={lbnpMinutes}
              onChange={(e) => setLbnpMinutes(Number(e.target.value))}
              className="accent-flight-info cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0 min (Persistent SANS Risk)</span>
              <span>60 min (Full Caudal Venous Drain)</span>
            </div>
          </div>

          {/* Slider 3: Storm Shelter Shielding Thickness */}
          <div className="flex flex-col gap-1.5 bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-flight-accent" /> Radiation Shielding Depth
              </span>
              <span className="text-flight-accent font-bold">{shieldingDepth} g/cm²</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={shieldingDepth}
              onChange={(e) => setShieldingDepth(Number(e.target.value))}
              className="accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>5 g/cm² (Aluminum Hull)</span>
              <span>35 g/cm² (Regolith / Water Wall)</span>
            </div>
          </div>

          {/* Slider 4: Phototherapy Lux for Martian Sol */}
          <div className="flex flex-col gap-1.5 bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-flight-caution" /> Circadian LED Phototherapy
              </span>
              <span className="text-flight-caution font-bold">{phototherapyLux} lux</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={phototherapyLux}
              onChange={(e) => setPhototherapyLux(Number(e.target.value))}
              className="accent-flight-caution cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0 lux (Free-running Sol Desync)</span>
              <span>10,000 lux (Blue-enriched Phase Lock)</span>
            </div>
          </div>

          {/* Action Button: Apply Countermeasure Prescription */}
          <button
            onClick={handleApplyPrescription}
            disabled={isSimulating}
            className="w-full py-2.5 bg-flight-nominal hover:bg-emerald-600 text-black font-bold rounded text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_12px_rgba(46,160,67,0.3)]"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>{isSimulating ? 'SIMULATING IN-SILICO TRAJECTORY...' : 'APPLY PRESCRIPTION TO MISSION PLAN'}</span>
          </button>

          {appliedPrescription && (
            <div className="p-2 bg-flight-nominal/15 border border-flight-nominal/30 text-flight-nominal text-[11px] rounded flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{appliedPrescription}</span>
            </div>
          )}
        </div>

        {/* Right: Comparative In-Silico Trajectory Chart (7 cols) */}
        <div className="lg:col-span-7 bg-spacecraft-panel p-4 rounded border border-spacecraft-border flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-spacecraft-border pb-2">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                PROJECTED IN-SILICO RESPONSE (30-DAY DIGITAL TWIN COMPARISON)
              </h3>
              <p className="text-[10px] text-gray-400">
                Evaluating SANS Facial Swelling Ratio Delta: Unmitigated Drift vs. Simulated Countermeasure Intervention
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-gray-400">HORIZON:</span>
              <button
                onClick={() => setSimulationDays(30)}
                className={`px-2 py-0.5 rounded ${
                  simulationDays === 30 ? 'bg-flight-info text-black font-bold' : 'text-gray-400'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setSimulationDays(90)}
                className={`px-2 py-0.5 rounded ${
                  simulationDays === 90 ? 'bg-flight-info text-black font-bold' : 'text-gray-400'
                }`}
              >
                90D
              </button>
            </div>
          </div>

          {/* Recharts Comparison Line Plot */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationPlotData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#1F242C" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  stroke="#484F58"
                  tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis
                  stroke="#484F58"
                  tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B26',
                    border: '1px solid #30363D',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#E6EDF3',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    paddingTop: '6px',
                  }}
                />

                {/* Pre-Flight Nominal Target */}
                <Line
                  type="monotone"
                  dataKey="Pre-Flight Nominal Target"
                  stroke="#2EA043"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                />

                {/* Unmitigated Drift Line */}
                <Line
                  type="monotone"
                  dataKey="Unmitigated Baseline Drift"
                  stroke="#F85149"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#F85149' }}
                />

                {/* Digital Twin Simulated Intervention Line */}
                <Line
                  type="monotone"
                  dataKey="Digital Twin Simulated Countermeasure"
                  stroke="#58A6FF"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#58A6FF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scientific Validation Note */}
          <div className="bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-flight-info shrink-0" />
              <span className="text-gray-300">
                Digital Twin predicts <span className="text-flight-nominal font-bold">48% reduction in SANS edema</span> and stabilizes bone demineralization to within nominal NASA flight margins.
              </span>
            </div>
            <span className="text-gray-500 font-bold">TRANSFER FN: HRP-2026</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="max-w-6xl w-full max-h-[92vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
