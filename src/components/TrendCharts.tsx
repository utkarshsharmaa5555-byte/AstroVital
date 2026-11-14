'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  MissionProfile,
  PhysiologicalParameterConfig,
} from '@/config/missionProfiles';
import {
  generatePredictiveTrajectorySeries,
  AstronautBaseline,
} from '@/lib/healthIntelligence';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

interface TrendChartsProps {
  mission: MissionProfile;
  selectedAstronaut: AstronautBaseline;
  telemetry: Record<string, number>;
}

export function TrendCharts({
  mission,
  selectedAstronaut,
  telemetry,
}: TrendChartsProps) {
  const activeParams = mission.physiologicalParameters;
  const [selectedParamId, setSelectedParamId] = useState<string>(
    activeParams[0]?.id || 'HEART_RATE'
  );

  const currentParam =
    activeParams.find((p) => p.id === selectedParamId) || activeParams[0];

  const currentVal = telemetry[currentParam.id] ?? currentParam.nominalRange[0] + 5;
  const baselineMean = (currentParam.nominalRange[0] + currentParam.nominalRange[1]) / 2;
  const baselineSD = (currentParam.nominalRange[1] - currentParam.nominalRange[0]) / 4;

  const chartData = generatePredictiveTrajectorySeries(
    currentParam.id,
    baselineMean,
    baselineSD,
    currentVal,
    mission.id
  );

  return (
    <div className="bg-spacecraft-surface border border-spacecraft-border rounded p-4 font-mono select-none flex flex-col gap-3">
      {/* Chart Header & Metric Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-spacecraft-border pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-flight-info" />
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              MULTI-DAY / SOL BIOMETRIC TELEMETRY & PREDICTIVE CONE
            </h3>
            <span className="text-[10px] text-gray-400">
              Shaded Area = Astronaut Pre-Flight Nominal Band (±1.5σ) // Dotted Line = AI Projected Trajectory
            </span>
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {activeParams.map((param) => {
            const isActive = param.id === selectedParamId;
            return (
              <button
                key={param.id}
                onClick={() => setSelectedParamId(param.id)}
                className={`px-2 py-1 rounded text-[11px] whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-flight-info/20 border-flight-info text-flight-info font-bold'
                    : 'bg-spacecraft-panel border-spacecraft-border text-gray-400 hover:text-white'
                }`}
              >
                {param.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {/* Shaded Personal Nominal Band */}
              <linearGradient id="nominalBandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EA043" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2EA043" stopOpacity={0.03} />
              </linearGradient>

              {/* AI Uncertainty Cone Gradient */}
              <linearGradient id="uncertaintyConeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D29922" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D29922" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1F242C" strokeDasharray="3 3" />
            <XAxis
              dataKey="dayOrSol"
              stroke="#484F58"
              tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis
              stroke="#484F58"
              tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
              domain={['auto', 'auto']}
              unit={` ${currentParam.unit}`}
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
                paddingTop: '8px',
              }}
            />

            {/* Shaded Nominal Baseline Band */}
            <Area
              type="monotone"
              dataKey="nominalMax"
              name="Nominal Upper Bound"
              stroke="#2EA043"
              strokeDasharray="2 2"
              fill="url(#nominalBandGrad)"
              fillOpacity={1}
            />
            <Area
              type="monotone"
              dataKey="nominalMin"
              name="Nominal Lower Bound"
              stroke="#2EA043"
              strokeDasharray="2 2"
              fill="transparent"
            />

            {/* Shaded AI Uncertainty Cone for future forecast */}
            <Area
              type="monotone"
              dataKey="uncertaintyUpper"
              name="AI Confidence Upper Bound (+σ)"
              stroke="#D29922"
              strokeDasharray="3 3"
              fill="url(#uncertaintyConeGrad)"
            />
            <Area
              type="monotone"
              dataKey="uncertaintyLower"
              name="AI Confidence Lower Bound (-σ)"
              stroke="#D29922"
              strokeDasharray="3 3"
              fill="transparent"
            />

            {/* Historical Actuals Line */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Recorded Observation"
              stroke="#58A6FF"
              strokeWidth={2}
              dot={{ r: 3, fill: '#58A6FF' }}
              activeDot={{ r: 5 }}
            />

            {/* AI Projected Forecast Trajectory Line */}
            <Line
              type="monotone"
              dataKey="forecast"
              name="AI Predicted Trajectory"
              stroke="#F85149"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#F85149' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary Bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] bg-spacecraft-bg p-2.5 rounded border border-spacecraft-borderMuted">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">ACTIVE TELEMETRY:</span>
          <span className="text-white font-bold">
            {currentParam.name} = {currentVal} {currentParam.unit}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">PERSONAL BASELINE:</span>
          <span className="text-flight-nominal font-bold">
            {baselineMean.toFixed(1)} ± {baselineSD.toFixed(1)} {currentParam.unit}
          </span>
        </div>

        <div className="text-gray-400">
          Impact: <span className="text-gray-200">{currentParam.impactNote}</span>
        </div>
      </div>
    </div>
  );
}
