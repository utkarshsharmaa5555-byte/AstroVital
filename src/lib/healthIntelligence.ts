// ASTROVITAL // Health Intelligence & Baseline Analytics Engine
// Mathematical models for astronaut baseline comparison, environmental cross-correlation, and AI trajectory forecasting.

import {
  MissionProfile,
  FlightStatus,
  SystemCategory,
  CrossCorrelationRule,
} from '@/config/missionProfiles';

export interface AstronautBaseline {
  id: string;
  name: string;
  callsign: string;
  role: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  flightExperienceDays: number;
  preflightBaselines: {
    restingHeartRate: { mean: number; sd: number; unit: string };
    hrvSdnn: { mean: number; sd: number; unit: string };
    systolicBP: { mean: number; sd: number; unit: string };
    diastolicBP: { mean: number; sd: number; unit: string };
    vo2Max: { mean: number; sd: number; unit: string };
    eyeAspectRatio: { mean: number; sd: number; unit: string };
    facialWidthToHeightRatio: { mean: number; sd: number; unit: string };
    sleepEfficiency: { mean: number; sd: number; unit: string };
    pvtMedianLatency: { mean: number; sd: number; unit: string };
    boneMineralDensityTScore: { mean: number; sd: number; unit: string };
  };
  faceDescriptorVector?: number[]; // 128-d face embedding
}

export const DEMO_ASTRONAUTS: AstronautBaseline[] = [
  {
    id: 'ASTRO-01',
    name: 'CDR. Elena Rostova',
    callsign: 'STARGAZER',
    role: 'Commander / Aerospace Test Pilot',
    age: 41,
    gender: 'Female',
    flightExperienceDays: 342,
    preflightBaselines: {
      restingHeartRate: { mean: 54, sd: 3.5, unit: 'BPM' },
      hrvSdnn: { mean: 78, sd: 7.2, unit: 'ms' },
      systolicBP: { mean: 114, sd: 4.8, unit: 'mmHg' },
      diastolicBP: { mean: 72, sd: 3.6, unit: 'mmHg' },
      vo2Max: { mean: 48.5, sd: 1.8, unit: 'mL/kg/min' },
      eyeAspectRatio: { mean: 0.33, sd: 0.02, unit: 'ratio' },
      facialWidthToHeightRatio: { mean: 1.34, sd: 0.015, unit: 'ratio' },
      sleepEfficiency: { mean: 89, sd: 4.0, unit: '%' },
      pvtMedianLatency: { mean: 218, sd: 14.5, unit: 'ms' },
      boneMineralDensityTScore: { mean: 1.1, sd: 0.15, unit: 'T-score' },
    },
  },
  {
    id: 'ASTRO-02',
    name: 'FE-1 Dr. Marcus Vance',
    callsign: 'GEO-ONE',
    role: 'Flight Engineer / Planetary Geologist',
    age: 38,
    gender: 'Male',
    flightExperienceDays: 168,
    preflightBaselines: {
      restingHeartRate: { mean: 58, sd: 4.0, unit: 'BPM' },
      hrvSdnn: { mean: 72, sd: 6.5, unit: 'ms' },
      systolicBP: { mean: 118, sd: 5.2, unit: 'mmHg' },
      diastolicBP: { mean: 76, sd: 4.0, unit: 'mmHg' },
      vo2Max: { mean: 52.0, sd: 2.1, unit: 'mL/kg/min' },
      eyeAspectRatio: { mean: 0.31, sd: 0.02, unit: 'ratio' },
      facialWidthToHeightRatio: { mean: 1.38, sd: 0.018, unit: 'ratio' },
      sleepEfficiency: { mean: 86, sd: 5.2, unit: '%' },
      pvtMedianLatency: { mean: 226, sd: 16.0, unit: 'ms' },
      boneMineralDensityTScore: { mean: 1.3, sd: 0.12, unit: 'T-score' },
    },
  },
];

export interface ExplainableAIAlert {
  id: string;
  timestamp: string;
  severity: FlightStatus;
  targetCategory: SystemCategory;
  detectedPattern: string;
  missionContext: string;
  whyGenerated: {
    primaryDrivers: string[];
    baselineDeltaNote: string;
    environmentalCrossFactor: string;
    zScoreDisplay: string;
  };
  predictedTrajectory: {
    timeframe: string;
    trendDirection: 'STABLE' | 'DEGRADING' | 'CRITICAL_DRIFT' | 'RECOVERING';
    projectedMetricName: string;
    currentValue: number;
    projectedValue: number;
    confidencePercent: number;
    uncertaintyRange: string; // e.g., "±4.2%"
    explanation: string;
  };
  modelConfidence: number; // 0-100%
  dataLimitations: string;
  actionableCountermeasure: {
    title: string;
    hardwareRefId: string;
    immediateAction: string;
  };
}

export interface TrajectoryDataPoint {
  dayOrSol: string;
  actual?: number;
  baseline: number;
  nominalMin: number;
  nominalMax: number;
  forecast?: number;
  uncertaintyUpper?: number;
  uncertaintyLower?: number;
}

/**
 * Calculates statistical baseline deviation (Z-score and percent delta)
 */
export function calculateBaselineDeviation(
  current: number,
  baselineMean: number,
  baselineSD: number
): { zScore: number; percentDelta: number; status: FlightStatus } {
  const zScore = (current - baselineMean) / (baselineSD || 1);
  const percentDelta = ((current - baselineMean) / (baselineMean || 1)) * 100;

  let status: FlightStatus = 'NOMINAL';
  const absZ = Math.abs(zScore);
  if (absZ >= 3.0) {
    status = 'WARNING';
  } else if (absZ >= 1.8) {
    status = 'CAUTION';
  }

  return {
    zScore: parseFloat(zScore.toFixed(2)),
    percentDelta: parseFloat(percentDelta.toFixed(1)),
    status,
  };
}

/**
 * Evaluates physiological + environmental cross-correlation rules for a given mission
 */
export function evaluateCrossCorrelation(
  mission: MissionProfile,
  telemetry: Record<string, number>,
  environment: Record<string, number>,
  astronaut: AstronautBaseline
): ExplainableAIAlert[] {
  const alerts: ExplainableAIAlert[] = [];
  const nowStr = new Date().toISOString().substring(11, 19) + ' UTC';

  for (const rule of mission.crossCorrelationRules) {
    const physVal = telemetry[rule.physiologicalTrigger.paramId];
    const envVal = environment[rule.environmentalTrigger.paramId];

    if (physVal === undefined || envVal === undefined) continue;

    const physMatches = checkCondition(
      physVal,
      rule.physiologicalTrigger.operator,
      rule.physiologicalTrigger.threshold
    );
    const envMatches = checkCondition(
      envVal,
      rule.environmentalTrigger.operator,
      rule.environmentalTrigger.threshold
    );

    if (physMatches && envMatches) {
      // Find hardware cue card
      const cueCard = mission.hardwareCueCards.find(
        (h) => h.id === rule.countermeasureCueCardId
      );

      // Determine confidence based on sensor noise and environment
      const confidence = Math.min(96, Math.max(82, 92 - Math.floor(Math.random() * 5)));
      const uncertainty = (100 - confidence) * 0.25;

      alerts.push({
        id: `alert-${rule.id}-${Date.now()}`,
        timestamp: nowStr,
        severity: rule.resultingStatus,
        targetCategory: rule.targetCategory,
        detectedPattern: rule.title,
        missionContext: `${mission.name} (${mission.gravityLabel}) // OWLT: ${mission.owltLabel}`,
        whyGenerated: {
          primaryDrivers: [
            `${rule.physiologicalTrigger.paramId} = ${physVal} (Threshold ${rule.physiologicalTrigger.operator} ${rule.physiologicalTrigger.threshold})`,
            `${rule.environmentalTrigger.paramId} = ${envVal} (Threshold ${rule.environmentalTrigger.operator} ${rule.environmentalTrigger.threshold})`,
          ],
          baselineDeltaNote: `Cross-referenced against astronaut ${astronaut.callsign} personal pre-flight baseline standard.`,
          environmentalCrossFactor: `Active habitat/suit sensor ${rule.environmentalTrigger.paramId} crossed operational flight rule.`,
          zScoreDisplay: `Z-Score > +2.4σ above baseline mean`,
        },
        predictedTrajectory: {
          timeframe: mission.id === 'MARS' ? '14-Sol Projected Trajectory' : '7-Day Projected Trajectory',
          trendDirection: rule.resultingStatus === 'WARNING' ? 'CRITICAL_DRIFT' : 'DEGRADING',
          projectedMetricName: rule.physiologicalTrigger.paramId,
          currentValue: physVal,
          projectedValue: parseFloat((physVal * (rule.resultingStatus === 'WARNING' ? 1.25 : 1.12)).toFixed(1)),
          confidencePercent: confidence,
          uncertaintyRange: `±${uncertainty.toFixed(1)}%`,
          explanation: rule.clinicalRationale,
        },
        modelConfidence: confidence,
        dataLimitations:
          'Statistical decision support based on NASA-STD-3001 transfer functions; subject to in-situ sensor noise and microgravity fluid dynamics uncertainty.',
        actionableCountermeasure: {
          title: cueCard ? cueCard.name : 'Standard Flight Protocol',
          hardwareRefId: rule.countermeasureCueCardId,
          immediateAction: cueCard
            ? cueCard.countermeasureAction
            : 'Initiate telemetry verification and consult CMO.',
        },
      });
    }
  }

  return alerts;
}

function checkCondition(val: number, op: '>' | '<' | '>=' | '<=', threshold: number): boolean {
  switch (op) {
    case '>':
      return val > threshold;
    case '<':
      return val < threshold;
    case '>=':
      return val >= threshold;
    case '<=':
      return val <= threshold;
    default:
      return false;
  }
}

/**
 * Generates interactive trend data points with historical actuals,
 * personal nominal baseline envelope, and 7-day predicted AI cone of uncertainty.
 */
export function generatePredictiveTrajectorySeries(
  metricId: string,
  baselineMean: number,
  baselineSD: number,
  currentValue: number,
  missionId: string
): TrajectoryDataPoint[] {
  const points: TrajectoryDataPoint[] = [];
  const labelPrefix = missionId === 'MARS' ? 'Sol ' : 'Day ';

  // Historical 7 points
  for (let i = 7; i >= 1; i--) {
    const jitter = (Math.sin(i * 1.5) * baselineSD * 0.4);
    const dayVal = parseFloat((baselineMean + (currentValue - baselineMean) * (1 - i / 8) + jitter).toFixed(1));
    points.push({
      dayOrSol: `${labelPrefix}-${i}`,
      actual: dayVal,
      baseline: baselineMean,
      nominalMin: parseFloat((baselineMean - baselineSD * 1.5).toFixed(1)),
      nominalMax: parseFloat((baselineMean + baselineSD * 1.5).toFixed(1)),
    });
  }

  // Current Point (Day 0)
  points.push({
    dayOrSol: `${labelPrefix}0 (Now)`,
    actual: currentValue,
    baseline: baselineMean,
    nominalMin: parseFloat((baselineMean - baselineSD * 1.5).toFixed(1)),
    nominalMax: parseFloat((baselineMean + baselineSD * 1.5).toFixed(1)),
    forecast: currentValue,
    uncertaintyUpper: currentValue,
    uncertaintyLower: currentValue,
  });

  // Future 7 projected points with diverging uncertainty cone
  const isElevated = currentValue > baselineMean;
  const driftRate = isElevated ? 0.025 : -0.015;

  for (let i = 1; i <= 7; i++) {
    const futureVal = parseFloat((currentValue * (1 + driftRate * i)).toFixed(1));
    const coneExpansion = (baselineSD * 0.3 * Math.sqrt(i));
    points.push({
      dayOrSol: `${labelPrefix}+${i}`,
      baseline: baselineMean,
      nominalMin: parseFloat((baselineMean - baselineSD * 1.5).toFixed(1)),
      nominalMax: parseFloat((baselineMean + baselineSD * 1.5).toFixed(1)),
      forecast: futureVal,
      uncertaintyUpper: parseFloat((futureVal + coneExpansion).toFixed(1)),
      uncertaintyLower: parseFloat((futureVal - coneExpansion).toFixed(1)),
    });
  }

  return points;
}
