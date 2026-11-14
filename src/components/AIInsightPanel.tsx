'use client';

import React from 'react';
import { ExplainableAIAlert } from '@/lib/healthIntelligence';
import {
  Brain,
  AlertTriangle,
  Info,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface AIInsightPanelProps {
  alerts: ExplainableAIAlert[];
  onOpenHardwareCueCard: (cueCardId: string) => void;
  activeRole: 'CREW' | 'CMO';
}

export function AIInsightPanel({
  alerts,
  onOpenHardwareCueCard,
  activeRole,
}: AIInsightPanelProps) {
  return (
    <div className="bg-spacecraft-surface border border-spacecraft-border rounded p-4 font-mono select-none flex flex-col gap-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-spacecraft-border pb-2.5">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-flight-accent" />
          <h3 className="text-xs font-bold text-white tracking-wider">
            EXPLAINABLE AI HEALTH INTELLIGENCE & PREDICTIVE TRAJECTORY ENGINE
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-flight-accent/15 text-flight-accent border border-flight-accent/30 font-semibold">
          NON-DIAGNOSTIC DECISION SUPPORT
        </span>
      </div>

      {/* Alerts Stream */}
      {alerts.length === 0 ? (
        <div className="p-6 rounded bg-spacecraft-panel/60 border border-spacecraft-borderMuted flex flex-col items-center justify-center text-center gap-2">
          <ShieldCheck className="w-8 h-8 text-flight-nominal" />
          <div className="text-xs font-bold text-white">ALL PHYSIOLOGICAL STREAMS NOMINAL</div>
          <p className="text-[11px] text-gray-400 max-w-md">
            Current bio-telemetry aligns with the astronaut’s pre-flight baseline envelope. No multi-variable
            environmental cross-correlation triggers detected.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => {
            const isWarning = alert.severity === 'WARNING';
            const borderCol = isWarning ? 'border-flight-warning' : 'border-flight-caution';
            const textCol = isWarning ? 'text-flight-warning' : 'text-flight-caution';
            const bgGlow = isWarning ? 'bg-flight-warning/10' : 'bg-flight-caution/10';

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded bg-spacecraft-panel border ${borderCol} flex flex-col gap-3 transition-all`}
              >
                {/* Alert Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded mt-0.5 ${bgGlow} ${textCol}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${isWarning ? 'bg-flight-warning text-black' : 'bg-flight-caution text-black'}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-bold text-white">{alert.detectedPattern}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        MISSION CONTEXT: {alert.missionContext} // {alert.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400">AI CONFIDENCE</span>
                    <span className="text-xs font-bold text-flight-info">
                      {alert.modelConfidence}% ({alert.predictedTrajectory.uncertaintyRange})
                    </span>
                  </div>
                </div>

                {/* Section 1: Why This Warning Was Generated (Explainability) */}
                <div className="bg-spacecraft-bg p-3 rounded border border-spacecraft-borderMuted text-xs flex flex-col gap-1.5">
                  <div className="text-gray-300 font-bold flex items-center gap-1.5 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-flight-info" />
                    EXACT MULTI-VARIABLE DRIVERS (WHY THIS WARNING WAS GENERATED):
                  </div>

                  <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-1 pl-1">
                    {alert.whyGenerated.primaryDrivers.map((driver, idx) => (
                      <li key={idx} className="font-mono text-gray-200">
                        {driver}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400 pt-1 border-t border-spacecraft-borderMuted">
                    <span>{alert.whyGenerated.baselineDeltaNote}</span>
                    <span className="text-flight-caution font-bold">
                      {alert.whyGenerated.zScoreDisplay}
                    </span>
                  </div>
                </div>

                {/* Section 2: 7-Day / 30-Day Predictive Trajectory */}
                <div className="bg-spacecraft-bg p-3 rounded border border-spacecraft-borderMuted text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-bold flex items-center gap-1.5 text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5 text-flight-caution" />
                      PREDICTIVE TRAJECTORY // {alert.predictedTrajectory.timeframe.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-flight-warning font-bold">
                      TREND: {alert.predictedTrajectory.trendDirection}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-spacecraft-card p-2 rounded">
                    <div>
                      <span className="text-[10px] text-gray-400">CURRENT OBSERVATION:</span>
                      <div className="text-white font-bold font-mono">
                        {alert.predictedTrajectory.currentValue}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-[10px] text-gray-400">PROJECTED DRIFT (UNINTERRUPTED):</span>
                      <div className="text-flight-warning font-bold font-mono">
                        {alert.predictedTrajectory.projectedValue}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400">UNCERTAINTY CONE:</span>
                      <div className="text-flight-info font-bold font-mono">
                        {alert.predictedTrajectory.uncertaintyRange}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {alert.predictedTrajectory.explanation}
                  </p>
                </div>

                {/* Countermeasure Cue Card Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[10px] text-gray-400 italic max-w-md">
                    * {alert.dataLimitations}
                  </div>

                  <button
                    onClick={() => onOpenHardwareCueCard(alert.actionableCountermeasure.hardwareRefId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-spacecraft-border hover:bg-spacecraft-borderHighlight text-white rounded text-xs font-bold transition-colors"
                  >
                    <span>CUE CARD: {alert.actionableCountermeasure.title}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
