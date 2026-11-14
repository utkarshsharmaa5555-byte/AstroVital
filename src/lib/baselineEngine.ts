// ASTROVITAL // Baseline Intelligence & Space Equipment Comparison Engine
// NASA-STD-3001 Pre-Flight Personal Baseline Reference Model

export type FlightVerdict =
  | 'Within Personal Envelope'
  | 'Drift Detected — Monitor'
  | 'Threshold Exceeded — Countermeasure Required';

export type StatusColor = 'NOMINAL' | 'CAUTION' | 'WARNING' | 'INFO';

export interface AstronautProfile {
  id: string;
  name: string;
  rank: string;
  callsign: string;
  crewId: string;
  age: number;
  bloodType: string;
  role: string;
  missionAssigned: string;
  photoUrl: string; // Base64 or preset image
  isVerified: boolean;
  lastCheckup: {
    date: string;
    protocol: string;
    status: string;
    nextScheduled: string;
    metTime: string;
  };
  baselines: {
    bodyTemp: { mean: number; min: number; max: number; unit: string };
    heartRate: { mean: number; min: number; max: number; unit: string };
    bloodPressureSys: { mean: number; min: number; max: number; unit: string };
    bloodPressureDia: { mean: number; min: number; max: number; unit: string };
    cabinPressure: { target: number; unit: string };
    bloodGlucose: { mean: number; min: number; max: number; unit: string };
    bloodPotassium: { mean: number; min: number; max: number; unit: string };
    intraocularPressure: { mean: number; min: number; max: number; unit: string };
    sansFluidIndex: { mean: number; max: number; unit: string };
    respiratoryRate: { mean: number; min: number; max: number; unit: string };
    pvtReactionTime: { mean: number; max: number; unit: string };
  };
  faceDescriptor?: number[];
}

export const PRESET_ASTRONAUTS: AstronautProfile[] = [
  {
    id: 'ASTRO-ELENA',
    name: 'CDR. Elena Rostova',
    rank: 'Commander / Aerospace Test Pilot',
    callsign: 'STARGAZER',
    crewId: 'EXP-76-01',
    age: 41,
    bloodType: 'O-Positive (Universal RBC)',
    role: 'Mission Commander & EVA Lead',
    missionAssigned: 'Expedition 76 // Artemis Odyssey',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    lastCheckup: {
      date: 'Nov 11, 2026 (3 Days Ago)',
      protocol: 'CHeCS Periodic Health Evaluation (PHE-04)',
      status: 'FLIGHT CLEARED',
      nextScheduled: 'Nov 25, 2026',
      metTime: 'MET 111:06:30',
    },
    baselines: {
      bodyTemp: { mean: 36.7, min: 36.4, max: 37.2, unit: '°C' },
      heartRate: { mean: 62, min: 52, max: 74, unit: 'bpm' },
      bloodPressureSys: { mean: 114, min: 105, max: 122, unit: 'mmHg' },
      bloodPressureDia: { mean: 72, min: 66, max: 78, unit: 'mmHg' },
      cabinPressure: { target: 14.7, unit: 'psia' },
      bloodGlucose: { mean: 88, min: 75, max: 105, unit: 'mg/dL' },
      bloodPotassium: { mean: 4.2, min: 3.8, max: 4.8, unit: 'mmol/L' },
      intraocularPressure: { mean: 14.5, min: 12.0, max: 17.5, unit: 'mmHg' },
      sansFluidIndex: { mean: 3.5, max: 8.0, unit: '% ratio' },
      respiratoryRate: { mean: 14, min: 12, max: 18, unit: 'breaths/min' },
      pvtReactionTime: { mean: 218, max: 280, unit: 'ms' },
    },
  },
  {
    id: 'ASTRO-MARCUS',
    name: 'FE-1 Dr. Marcus Vance',
    rank: 'Flight Engineer / Planetary Geologist',
    callsign: 'GEO-ONE',
    crewId: 'EXP-76-02',
    age: 38,
    bloodType: 'A-Positive',
    role: 'Flight Engineer & Science Officer',
    missionAssigned: 'Expedition 76 // Artemis Odyssey',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    lastCheckup: {
      date: 'Nov 09, 2026 (5 Days Ago)',
      protocol: 'CHeCS Periodic Health Evaluation (PHE-03)',
      status: 'FLIGHT CLEARED',
      nextScheduled: 'Nov 23, 2026',
      metTime: 'MET 109:14:15',
    },
    baselines: {
      bodyTemp: { mean: 36.6, min: 36.3, max: 37.1, unit: '°C' },
      heartRate: { mean: 58, min: 50, max: 70, unit: 'bpm' },
      bloodPressureSys: { mean: 118, min: 110, max: 126, unit: 'mmHg' },
      bloodPressureDia: { mean: 76, min: 70, max: 82, unit: 'mmHg' },
      cabinPressure: { target: 14.7, unit: 'psia' },
      bloodGlucose: { mean: 92, min: 78, max: 110, unit: 'mg/dL' },
      bloodPotassium: { mean: 4.4, min: 3.9, max: 4.9, unit: 'mmol/L' },
      intraocularPressure: { mean: 15.0, min: 12.5, max: 18.0, unit: 'mmHg' },
      sansFluidIndex: { mean: 3.8, max: 8.5, unit: '% ratio' },
      respiratoryRate: { mean: 13, min: 11, max: 17, unit: 'breaths/min' },
      pvtReactionTime: { mean: 226, max: 290, unit: 'ms' },
    },
  },
];

export interface MetricComparison {
  id: string;
  name: string;
  hardwareDevice: string;
  hardwareDeviceShort: string;
  currentValue: number;
  baselineMean: number;
  baselineMin: number;
  baselineMax: number;
  unit: string;
  deltaValue: number;
  deltaPercent: number;
  verdict: FlightVerdict;
  statusColor: StatusColor;
  clinicalNote: string;
}

export function compareToBaseline(
  current: number,
  mean: number,
  min: number,
  max: number,
  unit: string,
  higherIsBad = true
): {
  deltaValue: number;
  deltaPercent: number;
  verdict: FlightVerdict;
  statusColor: StatusColor;
} {
  const deltaValue = parseFloat((current - mean).toFixed(1));
  const deltaPercent = parseFloat((((current - mean) / (mean || 1)) * 100).toFixed(1));

  let verdict: FlightVerdict = 'Within Personal Envelope';
  let statusColor: StatusColor = 'NOMINAL';

  const isOutOfSafeRange = current < min || current > max;
  const isExtreme = current < min * 0.85 || current > max * 1.25;

  if (isExtreme) {
    verdict = 'Threshold Exceeded — Countermeasure Required';
    statusColor = 'WARNING';
  } else if (isOutOfSafeRange) {
    verdict = 'Drift Detected — Monitor';
    statusColor = 'CAUTION';
  }

  return { deltaValue, deltaPercent, verdict, statusColor };
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  badge: string;
  overrides: {
    bodyTemp: number;
    heartRate: number;
    bloodPressureSys: number;
    bloodPressureDia: number;
    cabinPressure: number;
    bloodGlucose?: number;
    bloodPotassium?: number;
    intraocularPressure?: number;
    sansFluidIndex?: number;
    pvtReactionTime?: number;
    radiationFlux?: number;
    respiratoryRate?: number;
  };
  expectedAction: string;
}

export const JUDGE_DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'nominal_orbit',
    name: 'Nominal Orbit / Habitat',
    description: 'All crew vitals tightly match pre-flight baseline envelope. ECLSS closed-loop nominal.',
    badge: 'NOMINAL',
    overrides: {
      bodyTemp: 36.8,
      heartRate: 64,
      bloodPressureSys: 116,
      bloodPressureDia: 74,
      cabinPressure: 14.7,
      bloodGlucose: 90,
      bloodPotassium: 4.3,
      intraocularPressure: 14.8,
      sansFluidIndex: 4.0,
      pvtReactionTime: 220,
      radiationFlux: 0.04,
      respiratoryRate: 14,
    },
    expectedAction: 'Maintain scheduled flight tasks and standard 2.5-hour ARED physical exercise routine.',
  },
  {
    id: 'post_eva_dehydration',
    name: 'Post-EVA Exertion & Dehydration',
    description: 'Following a 6-hour surface EVA sortie, astronaut exhibits tachycardia, hypovolemia, and thermal heat storage.',
    badge: 'ADVISORY',
    overrides: {
      bodyTemp: 37.6,
      heartRate: 108,
      bloodPressureSys: 102,
      bloodPressureDia: 66,
      cabinPressure: 14.6,
      bloodGlucose: 74,
      bloodPotassium: 3.6,
      intraocularPressure: 15.2,
      sansFluidIndex: 5.1,
      pvtReactionTime: 275,
      radiationFlux: 0.06,
      respiratoryRate: 22,
    },
    expectedAction: 'Immediate fluid replenishment (1.2L oral electrolyte solution) and 45-minute cooling rest protocol.',
  },
  {
    id: 'cabin_pressure_drop',
    name: 'Cabin Pressure Drop + Elevated HR',
    description: 'ECLSS regulator drift causes slow depressurization from 14.7 to 13.4 psia, inducing compensatory tachycardia and hyperventilation.',
    badge: 'CRITICAL ALERT',
    overrides: {
      bodyTemp: 36.9,
      heartRate: 118,
      bloodPressureSys: 132,
      bloodPressureDia: 88,
      cabinPressure: 13.4,
      bloodGlucose: 94,
      bloodPotassium: 4.1,
      intraocularPressure: 18.2,
      sansFluidIndex: 8.5,
      pvtReactionTime: 310,
      radiationFlux: 0.05,
      respiratoryRate: 26,
    },
    expectedAction: 'ECLSS emergency equalization check. Don emergency oxygen masks if pressure drops below 13.0 psia.',
  },
  {
    id: 'spe_radiation_sleep_loss',
    name: 'Solar Radiation Storm + Sleep Deficit',
    description: 'Coronal Mass Ejection proton surge strikes spacecraft during sleep window, causing severe cognitive fatigue and attentional lapses.',
    badge: 'CRITICAL ALERT',
    overrides: {
      bodyTemp: 37.1,
      heartRate: 84,
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      cabinPressure: 14.7,
      bloodGlucose: 102,
      bloodPotassium: 4.0,
      intraocularPressure: 17.5,
      sansFluidIndex: 11.2,
      pvtReactionTime: 410,
      radiationFlux: 3.4,
      respiratoryRate: 18,
    },
    expectedAction: 'All crew retreat into water-wall radiation storm shelter. Ground flight surgeon prescribes 0.5mg Melatonin.',
  },
];
