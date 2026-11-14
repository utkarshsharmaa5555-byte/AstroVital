'use client';

import React, { useState } from 'react';
import {
  AstronautProfile,
  JUDGE_DEMO_SCENARIOS,
  FlightVerdict,
  StatusColor,
  compareToBaseline,
} from '@/lib/baselineEngine';
import {
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Activity,
  Droplets,
  Eye,
  Gauge,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export type NASAEquipmentId = 'ALL' | 'HMS_PATCH' | 'PCBA_BLOOD' | 'OCT_SANS' | 'ECLSS_SENSOR';

interface LiveEquipmentSimulatorProps {
  astronaut: AstronautProfile;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  telemetry: Record<string, number>;
  onOpenHardwareCueCard?: (hardwareId: string) => void;
}

export function LiveEquipmentSimulator({
  astronaut,
  activeScenarioId,
  onSelectScenario,
  telemetry,
  onOpenHardwareCueCard,
}: LiveEquipmentSimulatorProps) {
  const [selectedDevice, setSelectedDevice] = useState<NASAEquipmentId>('ALL');

  const activeScenario =
    JUDGE_DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || JUDGE_DEMO_SCENARIOS[0];

  const devices: { id: NASAEquipmentId; name: string; tag: string; icon: any }[] = [
    { id: 'ALL', name: 'All Onboard Hardware', tag: 'INTEGRATED CHECS', icon: Layers },
    { id: 'HMS_PATCH', name: 'HMS Vital Signs Patch/Cuff', tag: 'NASA HMS CHeCS', icon: Activity },
    { id: 'PCBA_BLOOD', name: 'PCBA Blood & Biomarker Analyzer', tag: 'rHEALTH / i-STAT', icon: Droplets },
    { id: 'OCT_SANS', name: 'OCT & Tonometer (SANS Scanner)', tag: 'OCULAR ULTRASOUND', icon: Eye },
    { id: 'ECLSS_SENSOR', name: 'Habitat ECLSS Atmospheric Sensor', tag: 'LIFE SUPPORT SUITE', icon: Gauge },
  ];

  // Map metrics with live values and baselines
  const allMetrics = [
    {
      id: 'HEART_RATE',
      deviceId: 'HMS_PATCH',
      deviceName: 'HMS Vital Signs Patch',
      deviceShort: 'HMS Patch',
      cueCardId: 'ARED_RESISTIVE_EXERCISE',
      name: 'Heart Rate',
      currentValue: telemetry.HEART_RATE ?? 64,
      baselineMean: astronaut.baselines.heartRate.mean,
      baselineMin: astronaut.baselines.heartRate.min,
      baselineMax: astronaut.baselines.heartRate.max,
      unit: 'bpm',
      clinicalNote: 'Continuous ECG optical PPG cuff. Target resting 50–75 bpm.',
    },
    {
      id: 'BODY_TEMP',
      deviceId: 'HMS_PATCH',
      deviceName: 'HMS Vital Signs Patch',
      deviceShort: 'HMS Patch',
      cueCardId: 'LBNP_SUIT_CHAMBER',
      name: 'Core Body Temperature',
      currentValue: telemetry.BODY_TEMP ?? 36.8,
      baselineMean: astronaut.baselines.bodyTemp.mean,
      baselineMin: astronaut.baselines.bodyTemp.min,
      baselineMax: astronaut.baselines.bodyTemp.max,
      unit: '°C',
      clinicalNote: 'Tympanic double-sensor heat flux measurement.',
    },
    {
      id: 'BP_SYS',
      deviceId: 'HMS_PATCH',
      deviceName: 'HMS Vital Signs Patch',
      deviceShort: 'HMS Patch',
      cueCardId: 'ARED_RESISTIVE_EXERCISE',
      name: 'Blood Pressure (Systolic)',
      currentValue: telemetry.BP_SYS ?? 116,
      baselineMean: astronaut.baselines.bloodPressureSys.mean,
      baselineMin: astronaut.baselines.bloodPressureSys.min,
      baselineMax: astronaut.baselines.bloodPressureSys.max,
      unit: 'mmHg',
      clinicalNote: 'Oscillometric automated inflatable flight cuff.',
    },
    {
      id: 'RESP_RATE',
      deviceId: 'HMS_PATCH',
      deviceName: 'HMS Vital Signs Patch',
      deviceShort: 'HMS Patch',
      cueCardId: 'ECLSS_SCRUBBER_OVERRIDE',
      name: 'Respiratory Rate',
      currentValue: telemetry.RESP_RATE ?? 14,
      baselineMean: astronaut.baselines.respiratoryRate.mean,
      baselineMin: astronaut.baselines.respiratoryRate.min,
      baselineMax: astronaut.baselines.respiratoryRate.max,
      unit: 'breaths/min',
      clinicalNote: 'Chest impedance pneumography.',
    },
    {
      id: 'BLOOD_GLUCOSE',
      deviceId: 'PCBA_BLOOD',
      deviceName: 'PCBA Blood Analyzer',
      deviceShort: 'PCBA rHEALTH',
      cueCardId: 'ARED_RESISTIVE_EXERCISE',
      name: 'Blood Glucose',
      currentValue: telemetry.BLOOD_GLUCOSE ?? 90,
      baselineMean: astronaut.baselines.bloodGlucose.mean,
      baselineMin: astronaut.baselines.bloodGlucose.min,
      baselineMax: astronaut.baselines.bloodGlucose.max,
      unit: 'mg/dL',
      clinicalNote: 'Microfluidic capillary blood cartridge test.',
    },
    {
      id: 'BLOOD_POTASSIUM',
      deviceId: 'PCBA_BLOOD',
      deviceName: 'PCBA Blood Analyzer',
      deviceShort: 'PCBA rHEALTH',
      cueCardId: 'LBNP_SUIT_CHAMBER',
      name: 'Serum Potassium (K+)',
      currentValue: telemetry.BLOOD_POTASSIUM ?? 4.2,
      baselineMean: astronaut.baselines.bloodPotassium.mean,
      baselineMin: astronaut.baselines.bloodPotassium.min,
      baselineMax: astronaut.baselines.bloodPotassium.max,
      unit: 'mmol/L',
      clinicalNote: 'Ion-selective electrode assay. Critical for cardiac stability.',
    },
    {
      id: 'OCULAR_IOP',
      deviceId: 'OCT_SANS',
      deviceName: 'OCT & Tonometer',
      deviceShort: 'OCT Tonometer',
      cueCardId: 'SANS_CHOROIDAL_ULTRASOUND',
      name: 'Intraocular Pressure (IOP)',
      currentValue: telemetry.OCULAR_IOP ?? 14.8,
      baselineMean: astronaut.baselines.intraocularPressure.mean,
      baselineMin: astronaut.baselines.intraocularPressure.min,
      baselineMax: astronaut.baselines.intraocularPressure.max,
      unit: 'mmHg',
      clinicalNote: 'Rebound tonometry for SANS risk assessment.',
    },
    {
      id: 'SANS_FLUID_INDEX',
      deviceId: 'OCT_SANS',
      deviceName: 'OCT & Tonometer',
      deviceShort: 'OCT Tonometer',
      cueCardId: 'SANS_CHOROIDAL_ULTRASOUND',
      name: 'Optic Nerve Sheath Fluid Shift',
      currentValue: telemetry.SANS_FLUID_INDEX ?? 4.0,
      baselineMean: astronaut.baselines.sansFluidIndex.mean,
      baselineMin: 1.0,
      baselineMax: astronaut.baselines.sansFluidIndex.max,
      unit: '% ratio',
      clinicalNote: 'Spectral-domain optical coherence tomography of optic nerve head.',
    },
    {
      id: 'CABIN_PRESSURE',
      deviceId: 'ECLSS_SENSOR',
      deviceName: 'Habitat ECLSS Sensor',
      deviceShort: 'ECLSS Suite',
      cueCardId: 'ECLSS_SCRUBBER_OVERRIDE',
      name: 'Cabin Atmospheric Pressure',
      currentValue: telemetry.CABIN_PRESSURE ?? 14.7,
      baselineMean: astronaut.baselines.cabinPressure.target,
      baselineMin: 13.8,
      baselineMax: 15.2,
      unit: 'psia',
      clinicalNote: 'Environmental control closed-loop sensor. Depressurization risk.',
    },
    {
      id: 'RADIATION_FLUX',
      deviceId: 'ECLSS_SENSOR',
      deviceName: 'Habitat ECLSS Sensor',
      deviceShort: 'ECLSS Suite',
      cueCardId: 'RADIATION_STORM_SHELTER',
      name: 'Ambient Radiation Dose Rate',
      currentValue: telemetry.RADIATION_FLUX ?? 0.05,
      baselineMean: 0.04,
      baselineMin: 0.01,
      baselineMax: 0.40,
      unit: 'mSv/day',
      clinicalNote: 'Active silicon dosimeter and Cherenkov counter.',
    },
  ];

  const filteredMetrics =
    selectedDevice === 'ALL'
      ? allMetrics
      : allMetrics.filter((m) => m.deviceId === selectedDevice);

  const getVerdictBadge = (verdict: FlightVerdict, statusColor: StatusColor) => {
    if (statusColor === 'WARNING') {
      return (
        <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30 flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
          {verdict}
        </span>
      );
    }
    if (statusColor === 'CAUTION') {
      return (
        <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#D29922]/15 text-[#D29922] border border-[#D29922]/30 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {verdict}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#2EA043]/15 text-[#2EA043] border border-[#2EA043]/30 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        {verdict}
      </span>
    );
  };

  return (
    <div className="w-full bg-[#131822] border border-[#262E3D] rounded-[10px] p-5 flex flex-col gap-5 shadow-lg font-sans">
      {/* Top Header & Judge Scenario Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262E3D] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#58A6FF]" />
            <h3 className="text-xs font-bold text-white font-mono tracking-wider">
              ONBOARD MEDICAL HARDWARE SIMULATOR & PRE-FLIGHT (L-30D) DIVERGENCE
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time sensor telemetry paired with pre-flight baseline envelopes to detect insidious
            pathology.
          </p>
        </div>

        {/* 4 One-Click Judge Demo Scenarios */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#58A6FF]" />
            JUDGE DEMO:
          </span>
          {JUDGE_DEMO_SCENARIOS.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#58A6FF] text-black border-[#58A6FF] shadow-sm'
                    : 'bg-[#18202E] text-gray-300 border-[#262E3D] hover:border-gray-500 hover:text-white'
                }`}
              >
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Action Banner */}
      <div className="bg-[#18202E]/70 border border-[#262E3D] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-start md:items-center gap-3">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeScenario.badge === 'NOMINAL'
                ? 'bg-[#2EA043]/15 text-[#2EA043] border border-[#2EA043]/30'
                : 'bg-[#F85149]/15 text-[#F85149] border border-[#F85149]/30'
            }`}
          >
            {activeScenario.badge}
          </span>
          <p className="text-gray-300 font-sans text-xs">
            <strong className="text-white font-mono">{activeScenario.name}:</strong>{' '}
            {activeScenario.description}
          </p>
        </div>

        <div className="shrink-0 text-[11px] text-[#58A6FF] flex items-center gap-1 border-t md:border-t-0 md:border-l border-[#262E3D] pt-2 md:pt-0 md:pl-3">
          <span>Action: {activeScenario.expectedAction}</span>
        </div>
      </div>

      {/* Hardware Device Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {devices.map((dev) => {
          const Icon = dev.icon;
          const isSelected = selectedDevice === dev.id;
          return (
            <button
              key={dev.id}
              onClick={() => setSelectedDevice(dev.id)}
              className={`px-3.5 py-2 rounded-md font-mono text-xs font-semibold flex items-center gap-2 transition border ${
                isSelected
                  ? 'bg-[#18202E] text-[#58A6FF] border-[#58A6FF]'
                  : 'bg-[#10151E] text-gray-400 border-[#262E3D] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{dev.name}</span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-[#262E3D]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#0F141E] border-b border-[#262E3D] text-gray-400 font-semibold">
              <th className="py-3 px-4">DIAGNOSTIC METRIC</th>
              <th className="py-3 px-4">NASA HARDWARE</th>
              <th className="py-3 px-4 text-right">LIVE VALUE (TODAY)</th>
              <th className="py-3 px-4 text-right">BASELINE (L-30D)</th>
              <th className="py-3 px-4">DELTA & PROGRESSION</th>
              <th className="py-3 px-4">FLIGHT RULE VERDICT</th>
              <th className="py-3 px-3 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262E3D] bg-[#131822]">
            {filteredMetrics.map((metric) => {
              const comp = compareToBaseline(
                metric.currentValue,
                metric.baselineMean,
                metric.baselineMin,
                metric.baselineMax,
                metric.unit
              );

              // Percentage towards max or min
              const pctOfMean = Math.min(
                160,
                Math.max(40, ((metric.currentValue / (metric.baselineMean || 1)) * 100))
              );

              return (
                <tr key={metric.id} className="hover:bg-[#18202E]/60 transition-colors">
                  {/* Metric Name */}
                  <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                    <div>{metric.name}</div>
                    <div className="text-[10px] text-gray-400 font-normal font-sans">
                      {metric.clinicalNote}
                    </div>
                  </td>

                  {/* Device */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#18202E] text-gray-300 border border-[#262E3D] text-[11px]">
                      {metric.deviceShort}
                    </span>
                  </td>

                  {/* Live Value */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-white whitespace-nowrap">
                    <span className="text-sm">
                      {typeof metric.currentValue === 'number'
                        ? metric.currentValue.toFixed(1)
                        : metric.currentValue}
                    </span>{' '}
                    <span className="text-[11px] text-gray-400 font-normal">{metric.unit}</span>
                  </td>

                  {/* Baseline */}
                  <td className="py-3.5 px-4 text-right text-gray-300 whitespace-nowrap">
                    <div>
                      {metric.baselineMean.toFixed(1)}{' '}
                      <span className="text-[10px] text-gray-500">{metric.unit}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      [{metric.baselineMin.toFixed(1)} – {metric.baselineMax.toFixed(1)}]
                    </div>
                  </td>

                  {/* Delta & Visual Bar */}
                  <td className="py-3.5 px-4 min-w-[160px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span
                        className={
                          comp.statusColor === 'WARNING'
                            ? 'text-[#F85149] font-bold'
                            : comp.statusColor === 'CAUTION'
                            ? 'text-[#D29922] font-bold'
                            : 'text-[#2EA043]'
                        }
                      >
                        {comp.deltaValue >= 0 ? `+${comp.deltaValue}` : comp.deltaValue} {metric.unit}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {comp.deltaPercent >= 0 ? `+${comp.deltaPercent}` : comp.deltaPercent}%
                      </span>
                    </div>
                    {/* Visual Deviation Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#0B0E14] overflow-hidden border border-[#262E3D]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          comp.statusColor === 'WARNING'
                            ? 'bg-[#F85149]'
                            : comp.statusColor === 'CAUTION'
                            ? 'bg-[#D29922]'
                            : 'bg-[#2EA043]'
                        }`}
                        style={{ width: `${Math.min(100, (pctOfMean / 160) * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Verdict */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getVerdictBadge(comp.verdict, comp.statusColor)}
                  </td>

                  {/* Action / Cue Card Button */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onOpenHardwareCueCard && onOpenHardwareCueCard(metric.cueCardId)}
                      title="Open NASA Hardware Operational Cue Card"
                      className="px-2 py-1 rounded bg-[#18202E] hover:bg-[#58A6FF]/20 text-[#58A6FF] border border-[#262E3D] hover:border-[#58A6FF]/40 text-[10px] transition"
                    >
                      CUE CARD
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
