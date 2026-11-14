// ASTROVITAL // Multi-Planetary Mission-Adaptive Crew Health & Telemetry System
// NASA-STD-3001 Aerospace Telemetry & Mission Profile Registry

export type MissionId = 'ISS' | 'MOON' | 'MARS' | 'DEEP_SPACE' | string;

export type FlightStatus = 'NOMINAL' | 'CAUTION' | 'WARNING' | 'INFO';

export type SystemCategory =
  | 'CARDIOVASCULAR'
  | 'OCULAR_NEURO'
  | 'RESPIRATORY_DUST'
  | 'MUSCULOSKELETAL'
  | 'METABOLIC_HYDRATION'
  | 'IMMUNE_RADIATION';

export type HardwareStatus = 'ESTABLISHED_FLIGHT_HARDWARE' | 'AUTONOMOUS_EXPLORATION_CONCEPT';

export interface PhysiologicalParameterConfig {
  id: string;
  name: string;
  category: SystemCategory;
  unit: string;
  nominalRange: [number, number];
  cautionRange: [number, number];
  warningRange: [number, number];
  priorityWeight: number; // 1-10 priority weighting in this mission
  sampleIntervalSec: number;
  nasaRef: string;
  description: string;
  impactNote: string;
}

export interface EnvironmentalParameterConfig {
  id: string;
  name: string;
  unit: string;
  nominalRange: [number, number];
  cautionRange: [number, number];
  warningRange: [number, number];
  nasaStandardRef: string;
  description: string;
  dangerDescription: string;
}

export interface CrossCorrelationRule {
  id: string;
  title: string;
  targetCategory: SystemCategory;
  conditionDescription: string;
  physiologicalTrigger: {
    paramId: string;
    operator: '>' | '<' | '>=' | '<=';
    threshold: number;
  };
  environmentalTrigger: {
    paramId: string;
    operator: '>' | '<' | '>=' | '<=';
    threshold: number;
  };
  resultingStatus: FlightStatus;
  clinicalRationale: string;
  countermeasureCueCardId: string;
}

export interface HardwareCueCard {
  id: string;
  name: string;
  acronym: string;
  status: HardwareStatus;
  missionRelevance: string[];
  plainEnglishDescription: string;
  clinicalPurpose: string;
  stepByStepProtocol: string[];
  countermeasureAction: string;
  nasaStandardRef: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  missionId: MissionId;
  description: string;
  severity: FlightStatus;
  overrideTelemetry: Record<string, number>;
  overrideEnvironment: Record<string, number>;
  expectedDiagnosisSupport: string;
}

export interface MissionProfile {
  id: MissionId;
  name: string;
  code: string;
  destination: string;
  orbitOrLocation: string;
  gravityLabel: string;
  gravityG: number;
  owltLabel: string; // One-Way Light Time
  owltSeconds: number; // For comms simulation
  radiationProfile: string;
  summary: string;
  primaryRiskFactors: string[];
  prioritySystems: {
    category: SystemCategory;
    priorityWeight: number; // 1-10
    rationale: string;
  }[];
  physiologicalParameters: PhysiologicalParameterConfig[];
  environmentalParameters: EnvironmentalParameterConfig[];
  crossCorrelationRules: CrossCorrelationRule[];
  hardwareCueCards: HardwareCueCard[];
  scenarios: ScenarioDefinition[];
}

// -------------------------------------------------------------
// HARDWARE CUE CARDS (NASA-STD-3001 & Exploration Medical Capabilities)
// -------------------------------------------------------------
export const GLOBAL_HARDWARE_CATALOG: HardwareCueCard[] = [
  {
    id: 'TEMPUS_PRO_HMS',
    name: 'Tempus Pro Vital Signs Monitor (Health Maintenance System)',
    acronym: 'HMS-TP',
    status: 'ESTABLISHED_FLIGHT_HARDWARE',
    missionRelevance: ['ISS', 'MOON', 'MARS', 'DEEP_SPACE'],
    plainEnglishDescription:
      'A ruggedized, military-grade vital signs monitor with multi-lead ECG, pulse oximetry (SpO2), non-invasive blood pressure (NIBP), end-tidal CO2 (EtCO2), and surface temperature.',
    clinicalPurpose:
      'Continuous hemodynamic and respiratory telemetry capture during routine evaluations, acute medical events, or post-EVA stabilization.',
    stepByStepProtocol: [
      '1. Power on Tempus Pro unit by pressing green toggle for 2 seconds.',
      '2. Attach 4-lead or 12-lead ECG harness to astronaut chest using conductive aerospace gel pads.',
      '3. Slip optical SpO2 sensor onto non-dominant index finger; ensure perfusion index > 1.2.',
      '4. Secure NIBP cuff 2cm above left antecubital fossa; initiate single measurement cycle.',
      '5. Confirm ASTROVITAL telemetry bridge auto-syncs packet via cabin Bluetooth/Wi-Fi array.',
    ],
    countermeasureAction: 'Calibrate hemodynamic drift and initiate real-time logging.',
    nasaStandardRef: 'NASA-STD-3001 Vol 2, Sec 11.2 (Clinical Care Capability)',
  },
  {
    id: 'PCBA_BLOOD_ANALYZER',
    name: 'Portable Clinical Blood Analyzer (i-STAT / PCBA)',
    acronym: 'PCBA',
    status: 'ESTABLISHED_FLIGHT_HARDWARE',
    missionRelevance: ['ISS', 'MOON', 'MARS', 'DEEP_SPACE'],
    plainEnglishDescription:
      'A handheld cartridge-based laboratory device that tests fingerstick capillary blood drops in under 2 minutes for electrolytes, troponin, blood gases, lactate, and hematocrit.',
    clinicalPurpose:
      'Rapid detection of microgravity fluid/electrolyte imbalances, metabolic acidosis, dehydration, or myocardial strain.',
    stepByStepProtocol: [
      '1. Wipe astronaut finger with sterile alcohol prep pad; allow 15 seconds to air dry.',
      '2. Use spring-loaded safety lancet to puncture lateral aspect of fingertip.',
      '3. Collect 95 µL blood via heparinized capillary tube without creating bubbles.',
      '4. Dispense sample into test cartridge reservoir; immediately close cartridge snap flap.',
      '5. Insert cartridge into PCBA handheld; wait 120 seconds for biosensor electrochemical readout.',
    ],
    countermeasureAction: 'Guide targeted oral rehydration salts or potassium supplementation.',
    nasaStandardRef: 'NASA-STD-3001 Vol 2, Sec 11.3 (Pathology & Diagnostics)',
  },
  {
    id: 'ARED_RESISTIVE_DEVICE',
    name: 'Advanced Resistive Exercise Device',
    acronym: 'ARED',
    status: 'ESTABLISHED_FLIGHT_HARDWARE',
    missionRelevance: ['ISS', 'MOON', 'MARS', 'DEEP_SPACE'],
    plainEnglishDescription:
      'Vacuum-cylinder based exercise station providing up to 600 lbs of linear resistance for squats, deadlifts, and heel raises to prevent musculoskeletal atrophy.',
    clinicalPurpose:
      'Mechanical loading countermeasure against microgravity-induced bone mineral density (BMD) loss (1.5%/month) and postural muscle sarcopenia.',
    stepByStepProtocol: [
      '1. Verify vacuum canister pressure differential is balanced within 0.2 psi.',
      '2. Adjust shoulder pad height and collar bar locking pins to astronaut torso length.',
      '3. Attach telemetry harness to capture repetition tempo and peak ground reaction force.',
      '4. Complete 4 sets of 8 repetitions at 75-80% 1-Repetition Maximum with 90s recovery.',
      '5. Log post-workout muscle sore scale (1-10) in ASTROVITAL Crew Self-Log.',
    ],
    countermeasureAction: 'Enforce daily 2.5-hour scheduled countermeasure prescription.',
    nasaStandardRef: 'NASA-STD-3001 Vol 2, Sec 7.2 (Exercise Countermeasure Facilities)',
  },
  {
    id: 'SPACEFLIGHT_OCT_TONOMETER',
    name: 'Portable Optical Coherence Tomography & Rebound Tonometer',
    acronym: 'OCT-TONO',
    status: 'ESTABLISHED_FLIGHT_HARDWARE',
    missionRelevance: ['ISS', 'MOON', 'MARS', 'DEEP_SPACE'],
    plainEnglishDescription:
      'High-resolution non-invasive optical scanner of the ocular fundus, combined with a gentle rebound probe measuring intraocular pressure (IOP) in millimeters of mercury.',
    clinicalPurpose:
      'Monitoring and early interception of Spaceflight-Associated Neuro-ocular Syndrome (SANS), optic disc edema, choroidal folds, and hyperopic refractive shift.',
    stepByStepProtocol: [
      '1. Dim cabin lighting to optimize pupillary dilation without mydriatic drops.',
      '2. Position OCT handheld alignment cup against orbital ridge.',
      '3. Instruct crew member to fixate on interior green cross reticle.',
      '4. Capture volumetric peripapillary retinal nerve fiber layer (RNFL) scan of both eyes.',
      '5. Apply rebound tonometer disposable probe tip; perform 5 gentle taps to register IOP.',
    ],
    countermeasureAction: 'Deploy Lower Body Negative Pressure (LBNP) or chlorsand eyewear.',
    nasaStandardRef: 'NASA-STD-3001 Vol 2, Sec 11.2.3 (Ophthalmologic Monitoring)',
  },
  {
    id: 'LUNAR_REGOLITH_SCRUBBER_MONITOR',
    name: 'Aerosol Particulate Mass Monitor & Electrostatic Dust Mitigator',
    acronym: 'APMM-EDM',
    status: 'ESTABLISHED_FLIGHT_HARDWARE',
    missionRelevance: ['MOON', 'MARS'],
    plainEnglishDescription:
      'Optical particle counter detecting sub-10 µm sharp silicate dust grains brought in from EVA spacesuits, coupled with high-efficiency cyclone filtration.',
    clinicalPurpose:
      'Ensuring cabin respirable lunar dust concentration remains below the NASA-STD-3001 safety ceiling of 0.3 mg/m³ Time-Weighted Average (TWA) to prevent lunar hay fever, pulmonary fibrosis, and corneal irritation.',
    stepByStepProtocol: [
      '1. Verify airlock cycling scrub cycle completed prior to inner hatch unsealing.',
      '2. Review APMM particulate counter display (channels: PM1.0, PM2.5, PM10).',
      '3. If particulate count > 0.3 mg/m³, keep xEMU suits in airlock washdown zone.',
      '4. Don personal respirators (P100 equivalent) if cabin threshold is breached.',
      '5. Engage secondary magnetic/electrostatic vacuum scrubbers for 45 minutes.',
    ],
    countermeasureAction: 'Airlock containment hold and crew airway saline flush.',
    nasaStandardRef: 'NASA-STD-3001 Vol 2, Sec 6.4 (Respirable Particulate Limits)',
  },
  {
    id: 'EXPLORATION_AUTONOMOUS_MEDICINE_SUITE',
    name: 'ExMC Autonomous Clinical Diagnostic & Triage System (AI-CDS)',
    acronym: 'ExMC-CDS',
    status: 'AUTONOMOUS_EXPLORATION_CONCEPT',
    missionRelevance: ['MARS', 'DEEP_SPACE'],
    plainEnglishDescription:
      'An autonomous edge-computed clinical decision system with on-board medical knowledge base, ultrasound image guidance, surgical robotics, and probabilistic triage when Earth communication has a 20+ minute delay.',
    clinicalPurpose:
      'Enables non-physician crew members to diagnose and stabilize life-threatening medical events without synchronous Mission Control assistance.',
    stepByStepProtocol: [
      '1. Select symptom cluster on ASTROVITAL CMO Diagnostic Console.',
      '2. Connect smart ultrasound probe; follow on-screen bounding boxes for organ acquisition.',
      '3. Review Bayesian differential diagnosis generated from baseline deltas and sensor data.',
      '4. Execute recommended step-by-step cue card procedure with video walk-through.',
      '5. Queue telemetry summary packet to Earth Deep Space Network (DSN) uplink buffer.',
    ],
    countermeasureAction: 'Autonomous medical triage and protocolized clinical intervention.',
    nasaStandardRef: 'NASA Exploration Medical Capabilities (ExMC) Roadmap 2026',
  },
];

// -------------------------------------------------------------
// 1. ISS (LOW EARTH ORBIT // MICROGRAVITY)
// -------------------------------------------------------------
export const ISS_MISSION_PROFILE: MissionProfile = {
  id: 'ISS',
  name: 'International Space Station (LEO)',
  code: 'EXPEDITION-75',
  destination: 'Low Earth Orbit (408 km Altitude)',
  orbitOrLocation: '51.6° Inclination LEO',
  gravityLabel: '0.00g Microgravity',
  gravityG: 0.0,
  owltLabel: '~0.12s (Real-Time MCC-H)',
  owltSeconds: 0.12,
  radiationProfile: 'Van Allen Belt Shielded // Moderate LEO (0.4–0.8 mSv/day)',
  summary:
    'Microgravity orbital platform with real-time ground communication. Primary physiological stressors include cephalad fluid redistribution, neuromuscular deconditioning, sleep disruption from 90-minute orbital sunrises, and Spaceflight-Associated Neuro-ocular Syndrome (SANS).',
  primaryRiskFactors: [
    'Cephalad Fluid Redistribution & SANS (Retinal Nerve Fiber Layer Edema)',
    'Bone Mineral Density Loss (1.0–1.5% monthly in weight-bearing bones)',
    'Post-flight Orthostatic Intolerance (Baroreflex resetting)',
    'Circadian Rhythm Disruption (16 day/night cycles per 24 hours)',
  ],
  prioritySystems: [
    {
      category: 'OCULAR_NEURO',
      priorityWeight: 10,
      rationale:
        'Cephalad fluid shift causes venous congestion, flattening of posterior globe, and optic nerve sheath expansion (SANS).',
    },
    {
      category: 'CARDIOVASCULAR',
      priorityWeight: 9,
      rationale:
        'Plasma volume contraction (15-20%) within 72 hours; baroreceptor resetting requires daily monitoring.',
    },
    {
      category: 'MUSCULOSKELETAL',
      priorityWeight: 8,
      rationale:
        'Daily ARED and T2 treadmill compliance is essential to mitigate soleus and gastrocnemius muscle atrophy.',
    },
    {
      category: 'RESPIRATORY_DUST',
      priorityWeight: 6,
      rationale:
        'ppCO2 pocketing in microgravity modules creates carbon dioxide headaches if ventilation velocity drops.',
    },
    {
      category: 'METABOLIC_HYDRATION',
      priorityWeight: 7,
      rationale:
        'Thirst mechanism blunting and negative calcium balance require precise nutritional tracking.',
    },
    {
      category: 'IMMUNE_RADIATION',
      priorityWeight: 5,
      rationale:
        'Reactivation of latent herpesviruses (EBV, CMV) secondary to operational stress and modest LEO radiation.',
    },
  ],
  physiologicalParameters: [
    {
      id: 'HEART_RATE',
      name: 'Resting Heart Rate',
      category: 'CARDIOVASCULAR',
      unit: 'BPM',
      nominalRange: [50, 78],
      cautionRange: [79, 95],
      warningRange: [96, 140],
      priorityWeight: 9,
      sampleIntervalSec: 1,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.1',
      description: 'Resting cardiac frequency reflecting cardiovascular deconditioning.',
      impactNote: 'Elevated baseline indicates autonomic strain or fluid volume deficit.',
    },
    {
      id: 'HRV_SDNN',
      name: 'Heart Rate Variability (SDNN)',
      category: 'CARDIOVASCULAR',
      unit: 'ms',
      nominalRange: [45, 95],
      cautionRange: [30, 44],
      warningRange: [15, 29],
      priorityWeight: 9,
      sampleIntervalSec: 5,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.2',
      description: 'Standard deviation of NN intervals; primary autonomic biomarker.',
      impactNote: 'Low HRV signals elevated sympathetic stress, poor sleep recovery, or infection.',
    },
    {
      id: 'BLOOD_PRESSURE_SYS',
      name: 'Systolic Blood Pressure',
      category: 'CARDIOVASCULAR',
      unit: 'mmHg',
      nominalRange: [105, 125],
      cautionRange: [126, 140],
      warningRange: [141, 165],
      priorityWeight: 8,
      sampleIntervalSec: 60,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.3',
      description: 'Systemic peak arterial pressure.',
      impactNote: 'Fluid shift elevates upper-body vascular resistance early in mission.',
    },
    {
      id: 'SANS_EDEMA_INDEX',
      name: 'Facial Fluid Shift / SANS Index',
      category: 'OCULAR_NEURO',
      unit: 'Ratio Delta %',
      nominalRange: [0, 8],
      cautionRange: [9, 16],
      warningRange: [17, 30],
      priorityWeight: 10,
      sampleIntervalSec: 10,
      nasaRef: 'NASA HRP SANS Research Roadmap',
      description: 'Computer-vision derived facial width-to-height swelling and venous distension.',
      impactNote: 'High values correlate directly with optic disc swelling and choroidal folds.',
    },
    {
      id: 'OCULAR_EAR',
      name: 'Eye Aspect Ratio (EAR) / Blink Duration',
      category: 'OCULAR_NEURO',
      unit: 'Score (0-1)',
      nominalRange: [0.28, 0.40],
      cautionRange: [0.20, 0.27],
      warningRange: [0.10, 0.19],
      priorityWeight: 8,
      sampleIntervalSec: 2,
      nasaRef: 'NASA HRP Behavioral Health & Performance',
      description: 'Palpebral fissure height vs width; objective drowsiness index.',
      impactNote: 'Drooping eyelids indicate severe sleep architecture disruption.',
    },
    {
      id: 'ARED_LOAD_COMPLIANCE',
      name: 'ARED Daily Resistive Load',
      category: 'MUSCULOSKELETAL',
      unit: 'kJ Work',
      nominalRange: [180, 260],
      cautionRange: [120, 179],
      warningRange: [0, 119],
      priorityWeight: 9,
      sampleIntervalSec: 300,
      nasaRef: 'NASA-STD-3001 Vol 2 §7.2',
      description: 'Total mechanical force-displacement work performed on ARED.',
      impactNote: 'Sub-target work accelerates lumbar spine and calcaneus demineralization.',
    },
    {
      id: 'SPO2',
      name: 'Blood Oxygen Saturation',
      category: 'RESPIRATORY_DUST',
      unit: '%',
      nominalRange: [96, 100],
      cautionRange: [93, 95],
      warningRange: [85, 92],
      priorityWeight: 8,
      sampleIntervalSec: 1,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.4',
      description: 'Arterial oxygen saturation via pulse oximetry.',
      impactNote: 'Hypoxia impairs cognitive processing during complex station EVAs.',
    },
    {
      id: 'SLEEP_EFFICIENCY',
      name: 'Actigraphy Sleep Efficiency',
      category: 'METABOLIC_HYDRATION',
      unit: '%',
      nominalRange: [82, 98],
      cautionRange: [68, 81],
      warningRange: [40, 67],
      priorityWeight: 7,
      sampleIntervalSec: 3600,
      nasaRef: 'NASA-STD-3001 Vol 1 §4.1',
      description: 'Sleep duration relative to time in crew quarters sleep restraint.',
      impactNote: 'Chronic short sleep impairs psychomotor vigilance and team communication.',
    },
  ],
  environmentalParameters: [
    {
      id: 'CABIN_PPCO2',
      name: 'Cabin Carbon Dioxide (ppCO2)',
      unit: 'mmHg',
      nominalRange: [1.5, 3.0],
      cautionRange: [3.1, 4.5],
      warningRange: [4.6, 8.0],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.2.2 (Max 3.0 mmHg nominal)',
      description: 'Partial pressure of carbon dioxide in habitable modules.',
      dangerDescription:
        'Microgravity eliminates thermal buoyancy convection, forming localized CO2 clouds around sleeping crew, inducing hypercapnic headaches and visual disturbance.',
    },
    {
      id: 'CABIN_PRESSURE',
      name: 'Cabin Atmospheric Pressure',
      unit: 'psi',
      nominalRange: [14.4, 14.9],
      cautionRange: [13.8, 14.3],
      warningRange: [10.5, 13.7],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.2.1 (14.7 ± 0.3 psi standard)',
      description: 'Total barometric pressure inside the pressurized volume.',
      dangerDescription: 'Rapid decompression risk; barotrauma and hypoxemia.',
    },
    {
      id: 'CABIN_O2_PCT',
      name: 'Atmospheric O2 Percentage',
      unit: '%',
      nominalRange: [20.5, 21.5],
      cautionRange: [19.0, 20.4],
      warningRange: [16.0, 18.9],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.2.2',
      description: 'Oxygen concentration in air mix.',
      dangerDescription: 'Hypoxia risk below 19.5%; flammability danger above 24.1%.',
    },
    {
      id: 'ACOUSTIC_NOISE',
      name: 'Hab Module Acoustic Noise',
      unit: 'dBA',
      nominalRange: [42, 54],
      cautionRange: [55, 62],
      warningRange: [63, 75],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.6 (NC-40 Sleep / NC-50 Work)',
      description: 'Continuous background noise generated by avionics fans and pumps.',
      dangerDescription: 'Long-term hearing threshold shifts and chronic stress.',
    },
  ],
  crossCorrelationRules: [
    {
      id: 'ISS_RULE_SANS_CO2',
      title: 'Cephalad Fluid Shift + Elevated Module ppCO2',
      targetCategory: 'OCULAR_NEURO',
      conditionDescription: 'SANS Edema Index > 14% AND Cabin ppCO2 > 3.2 mmHg',
      physiologicalTrigger: { paramId: 'SANS_EDEMA_INDEX', operator: '>', threshold: 14 },
      environmentalTrigger: { paramId: 'CABIN_PPCO2', operator: '>', threshold: 3.2 },
      resultingStatus: 'WARNING',
      clinicalRationale:
        'Microgravity cephalad venous stasis combined with hypercapnic cerebral vasodilation compounds intracranial pressure, accelerating optic disc edema progression.',
      countermeasureCueCardId: 'SPACEFLIGHT_OCT_TONOMETER',
    },
    {
      id: 'ISS_RULE_SLEEP_DEBT_HRV',
      title: 'Circadian Desynchrony & Autonomic Strain',
      targetCategory: 'CARDIOVASCULAR',
      conditionDescription: 'HRV SDNN < 35 ms AND Sleep Efficiency < 70%',
      physiologicalTrigger: { paramId: 'HRV_SDNN', operator: '<', threshold: 35 },
      environmentalTrigger: { paramId: 'ACOUSTIC_NOISE', operator: '>', threshold: 56 },
      resultingStatus: 'CAUTION',
      clinicalRationale:
        'Acoustic noise pollution combined with circadian lighting phase shifts has suppressed parasympathetic tone, reducing cognitive resilience.',
      countermeasureCueCardId: 'TEMPUS_PRO_HMS',
    },
  ],
  hardwareCueCards: GLOBAL_HARDWARE_CATALOG.filter(h => h.missionRelevance.includes('ISS')),
  scenarios: [
    {
      id: 'nominal_iss',
      name: 'Nominal Station Operations (Flight Day 42)',
      missionId: 'ISS',
      description: 'All crew vitals within personal nominal baselines. ECLSS scrubbers nominal.',
      severity: 'NOMINAL',
      overrideTelemetry: {
        HEART_RATE: 62,
        HRV_SDNN: 68,
        BLOOD_PRESSURE_SYS: 116,
        SANS_EDEMA_INDEX: 4,
        OCULAR_EAR: 0.34,
        ARED_LOAD_COMPLIANCE: 220,
        SPO2: 98,
        SLEEP_EFFICIENCY: 88,
      },
      overrideEnvironment: {
        CABIN_PPCO2: 2.2,
        CABIN_PRESSURE: 14.7,
        CABIN_O2_PCT: 20.9,
        ACOUSTIC_NOISE: 48,
      },
      expectedDiagnosisSupport:
        'Nominal physiological status. Maintain standard 2.5-hour countermeasure workout.',
    },
    {
      id: 'sans_fluid_shift',
      name: 'Acute Cephalad Fluid Shift & SANS Optic Elevation',
      missionId: 'ISS',
      description:
        'Astronaut displays noticeable facial puffiness, mild blurred vision, and elevated facial edema index with rising cabin CO2.',
      severity: 'WARNING',
      overrideTelemetry: {
        HEART_RATE: 78,
        HRV_SDNN: 38,
        BLOOD_PRESSURE_SYS: 132,
        SANS_EDEMA_INDEX: 18.5,
        OCULAR_EAR: 0.23,
        ARED_LOAD_COMPLIANCE: 145,
        SPO2: 97,
        SLEEP_EFFICIENCY: 64,
      },
      overrideEnvironment: {
        CABIN_PPCO2: 4.1,
        CABIN_PRESSURE: 14.6,
        CABIN_O2_PCT: 20.7,
        ACOUSTIC_NOISE: 58,
      },
      expectedDiagnosisSupport:
        'ALERT: SANS Grade 2 risk. Optic disc swelling likely. Immediately run Portable OCT and Tonometer protocol. Deploy Lower Body Negative Pressure (LBNP) session.',
    },
  ],
};

// -------------------------------------------------------------
// 2. MOON (ARTEMIS LUNAR SURFACE // HYPOGRAVITY 1/6g)
// -------------------------------------------------------------
export const MOON_MISSION_PROFILE: MissionProfile = {
  id: 'MOON',
  name: 'Artemis Base Camp (South Pole Shackleton)',
  code: 'ARTEMIS-IV',
  destination: 'Lunar Surface (89.9°S Lunar South Pole)',
  orbitOrLocation: 'Shackleton Crater Rim Base',
  gravityLabel: '0.166g (1/6g Hypogravity)',
  gravityG: 0.166,
  owltLabel: '1.28s (Direct Earth-Lunar Comm)',
  owltSeconds: 1.28,
  radiationProfile: 'Unshielded Lunar Surface // GCR + Solar Wind (1.2–2.5 mSv/day)',
  summary:
    'Hypogravity surface habitat operating under extreme thermal swings (-180°C to +120°C) and aggressive, electrostatically charged, jagged lunar regolith dust. High physical EVA workload inside pressurized spacesuits (xEMU/AxEMU) with heightened risk of dust inhalation, musculoskeletal strain, and vestibular gait imbalance.',
  primaryRiskFactors: [
    'Lunar Regolith Dust Inhalation (<0.3 mg/m³ NASA-STD-3001 ceiling)',
    'EVA High Metabolic Load & Heat Storage in Spacesuit Cooling Loops',
    'Vestibular Balance Drift (Transitioning between 0g transit and 1/6g surface)',
    'Acute Solar Particle Event (SPE) without magnetic field protection',
  ],
  prioritySystems: [
    {
      category: 'RESPIRATORY_DUST',
      priorityWeight: 10,
      rationale:
        'Sub-10µm jagged silica grains lack atmospheric weathering; acute pulmonary toxicity and airway inflammation are primary hazards.',
    },
    {
      category: 'CARDIOVASCULAR',
      priorityWeight: 9,
      rationale:
        'Suit metabolic work (>350 kcal/hr during lunar regolith drilling) stresses cardiac reserve and thermal balance.',
    },
    {
      category: 'MUSCULOSKELETAL',
      priorityWeight: 8,
      rationale:
        '1/6g gait dynamics cause high Achilles tendon strain, ankle destabilization, and torso muscular fatigue in stiff spacesuits.',
    },
    {
      category: 'IMMUNE_RADIATION',
      priorityWeight: 9,
      rationale:
        'Unshielded lunar surface lacks magnetosphere; SPE alarms require instant habitat storm shelter protocol.',
    },
    {
      category: 'METABOLIC_HYDRATION',
      priorityWeight: 7,
      rationale:
        'High sweat rates during 6-hour EVAs can produce 2.5L fluid deficits if in-suit hydration fails.',
    },
    {
      category: 'OCULAR_NEURO',
      priorityWeight: 6,
      rationale:
        'Corneal abrasion from airborne lunar regolith particles during suit ingress/doffing.',
    },
  ],
  physiologicalParameters: [
    {
      id: 'EVA_METABOLIC_RATE',
      name: 'EVA Spacesuit Metabolic Rate',
      category: 'CARDIOVASCULAR',
      unit: 'BTU/hr',
      nominalRange: [800, 1400],
      cautionRange: [1401, 1800],
      warningRange: [1801, 2600],
      priorityWeight: 10,
      sampleIntervalSec: 2,
      nasaRef: 'NASA-STD-3001 Vol 2 §11.4 (EVA Medical Requirements)',
      description: 'Astronaut energy expenditure inside pressurized exploration suit.',
      impactNote: 'Sustained rates > 1800 BTU/hr deplete suit oxygen and liquid cooling capacity.',
    },
    {
      id: 'CORE_TEMP',
      name: 'Estimated Core Body Temperature',
      category: 'METABOLIC_HYDRATION',
      unit: '°C',
      nominalRange: [36.7, 37.6],
      cautionRange: [37.7, 38.3],
      warningRange: [38.4, 40.0],
      priorityWeight: 9,
      sampleIntervalSec: 5,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.5',
      description: 'Core thermal balance measured via ingestible telemetry capsule or tympanic sensor.',
      impactNote: 'Hyperthermia (>38.5°C) degrades motor coordination during tricky lunar geology walks.',
    },
    {
      id: 'HEART_RATE',
      name: 'EVA Cardiac Workload',
      category: 'CARDIOVASCULAR',
      unit: 'BPM',
      nominalRange: [65, 115],
      cautionRange: [116, 145],
      warningRange: [146, 185],
      priorityWeight: 9,
      sampleIntervalSec: 1,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.1',
      description: 'Real-time cardiac frequency during lunar surface exploration.',
      impactNote: 'Cardiovascular drift indicates dehydration or thermal loop insufficiency.',
    },
    {
      id: 'RESPIRATORY_RATE',
      name: 'Breathing Frequency',
      category: 'RESPIRATORY_DUST',
      unit: 'breaths/min',
      nominalRange: [12, 18],
      cautionRange: [19, 26],
      warningRange: [27, 40],
      priorityWeight: 9,
      sampleIntervalSec: 2,
      nasaRef: 'NASA-STD-3001 Vol 1 §3.6',
      description: 'Ventilatory frequency per minute.',
      impactNote: 'Tachypnea (>24) indicates suit CO2 washout failure or dust-induced bronchospasm.',
    },
    {
      id: 'VESTIBULAR_BALANCE_SCORE',
      name: 'Postural Vestibular Stability',
      category: 'MUSCULOSKELETAL',
      unit: 'Score (0-100)',
      nominalRange: [75, 100],
      cautionRange: [55, 74],
      warningRange: [20, 54],
      priorityWeight: 8,
      sampleIntervalSec: 30,
      nasaRef: 'NASA HRP Sensorimotor Risk',
      description: 'Center of pressure sway velocity in 1/6g terrain walking.',
      impactNote: 'Vestibular disorientation increases fall risk on steep crater escarpments.',
    },
    {
      id: 'CUMULATIVE_DOSE_LUNAR',
      name: 'Mission Surface Radiation Dose',
      category: 'IMMUNE_RADIATION',
      unit: 'mSv',
      nominalRange: [0, 45],
      cautionRange: [46, 90],
      warningRange: [91, 250],
      priorityWeight: 9,
      sampleIntervalSec: 60,
      nasaRef: 'NASA-STD-3001 Vol 1 §4.2 (Permissible Exposure Limits)',
      description: 'Cumulative active dosimeter measurement on lunar surface.',
      impactNote: 'Doses above 100 mSv increase lifetime excess risk of cancer mortality.',
    },
  ],
  environmentalParameters: [
    {
      id: 'LUNAR_DUST_CONCENTRATION',
      name: 'Respirable Lunar Regolith Dust (<10µm)',
      unit: 'mg/m³',
      nominalRange: [0.0, 0.25],
      cautionRange: [0.26, 0.29],
      warningRange: [0.30, 2.5],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.4 (Respirable Limit: < 0.3 mg/m³ TWA)',
      description:
        'Concentration of ultra-fine, abrasive jagged lunar silicate particles in habitat or airlock air.',
      dangerDescription:
        'Toxicity ceiling is strictly 0.3 mg/m³. Exceeding this causes lunar dust toxic pneumonitis, chemical irritation from active radicals, and pulmonary inflammation.',
    },
    {
      id: 'AIRLOCK_PRESSURE',
      name: 'Airlock Repressurization Status',
      unit: 'psi',
      nominalRange: [14.4, 14.8],
      cautionRange: [12.0, 14.3],
      warningRange: [4.0, 11.9],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.2',
      description: 'Artemis Base Camp airlock equalization chamber barometric pressure.',
      dangerDescription: 'Incomplete repressurization risks barotrauma during suit ingress.',
    },
    {
      id: 'SURFACE_SOLAR_FLUX',
      name: 'Active Solar Particle Proton Flux (>10 MeV)',
      unit: 'pfu',
      nominalRange: [0.1, 8.0],
      cautionRange: [8.1, 25.0],
      warningRange: [25.1, 1500.0],
      nasaStandardRef: 'NOAA Space Weather Scale S1-S5 / NASA HRP',
      description: 'Proton particle flux measured by surface radiation detector array.',
      dangerDescription:
        'Values > 25 pfu indicate Solar Particle Event (SPE). Immediate retreat to subsurface regolith radiation shelter required.',
    },
  ],
  crossCorrelationRules: [
    {
      id: 'MOON_RULE_DUST_BRONCHO',
      title: 'Lunar Dust Breach + Acute Airway Tachypnea',
      targetCategory: 'RESPIRATORY_DUST',
      conditionDescription: 'Lunar Dust > 0.30 mg/m³ AND Respiratory Rate > 24 breaths/min',
      physiologicalTrigger: { paramId: 'RESPIRATORY_RATE', operator: '>', threshold: 24 },
      environmentalTrigger: { paramId: 'LUNAR_DUST_CONCENTRATION', operator: '>', threshold: 0.30 },
      resultingStatus: 'WARNING',
      clinicalRationale:
        'Respirable lunar regolith particles have exceeded the NASA-STD-3001 ceiling of 0.3 mg/m³. Correlated tachypnea and elevated heart rate indicate acute toxic airway reactivity or airlock filtration breach.',
      countermeasureCueCardId: 'LUNAR_REGOLITH_SCRUBBER_MONITOR',
    },
    {
      id: 'MOON_RULE_EVA_THERMAL',
      title: 'EVA Metabolic Overload & Thermal Dissipation Limit',
      targetCategory: 'CARDIOVASCULAR',
      conditionDescription: 'EVA Metabolic Rate > 1750 BTU/hr AND Core Body Temp > 38.0°C',
      physiologicalTrigger: { paramId: 'CORE_TEMP', operator: '>', threshold: 38.0 },
      environmentalTrigger: { paramId: 'LUNAR_DUST_CONCENTRATION', operator: '>=', threshold: 0.1 },
      resultingStatus: 'CAUTION',
      clinicalRationale:
        'Suit liquid cooling garment (LCG) is unable to match high metabolic heat production during steep slope traverse. Impending heat exhaustion.',
      countermeasureCueCardId: 'TEMPUS_PRO_HMS',
    },
  ],
  hardwareCueCards: GLOBAL_HARDWARE_CATALOG.filter(h => h.missionRelevance.includes('MOON')),
  scenarios: [
    {
      id: 'nominal_moon',
      name: 'Nominal Shackleton Surface Sortie',
      missionId: 'MOON',
      description: 'Standard 4-hour geology EVA. Suit cooling nominal, habitat dust scrubbers locked at zero.',
      severity: 'NOMINAL',
      overrideTelemetry: {
        EVA_METABOLIC_RATE: 1120,
        CORE_TEMP: 37.2,
        HEART_RATE: 84,
        RESPIRATORY_RATE: 15,
        VESTIBULAR_BALANCE_SCORE: 88,
        CUMULATIVE_DOSE_LUNAR: 18,
      },
      overrideEnvironment: {
        LUNAR_DUST_CONCENTRATION: 0.08,
        AIRLOCK_PRESSURE: 14.7,
        SURFACE_SOLAR_FLUX: 1.4,
      },
      expectedDiagnosisSupport:
        'Lunar surface operations nominal. Dust levels well within 0.3 mg/m³ limit.',
    },
    {
      id: 'lunar_eva_dust',
      name: 'Lunar EVA Regolith Dust Breach + Thermal Workload Spike',
      missionId: 'MOON',
      description:
        'Astronaut returns through airlock with heavy electrostatic dust cling. Airlock particulate monitor spikes past 0.42 mg/m³, with elevated respiration and core temp.',
      severity: 'WARNING',
      overrideTelemetry: {
        EVA_METABOLIC_RATE: 1890,
        CORE_TEMP: 38.4,
        HEART_RATE: 142,
        RESPIRATORY_RATE: 28,
        VESTIBULAR_BALANCE_SCORE: 61,
        CUMULATIVE_DOSE_LUNAR: 24,
      },
      overrideEnvironment: {
        LUNAR_DUST_CONCENTRATION: 0.48,
        AIRLOCK_PRESSURE: 14.5,
        SURFACE_SOLAR_FLUX: 3.2,
      },
      expectedDiagnosisSupport:
        'MASTER CAUTION: Respirable lunar dust ceiling breached (0.48 mg/m³ vs 0.30 mg/m³ max). Don P100 respirator. Run high-efficiency electrostatic airlock purge. Initiate saline eye and airway flush.',
    },
  ],
};

// -------------------------------------------------------------
// 3. MARS (LONG-DURATION SURFACE MISSION // 3/8g GRAVITY)
// -------------------------------------------------------------
export const MARS_MISSION_PROFILE: MissionProfile = {
  id: 'MARS',
  name: 'Mars Surface Exploration (Jezero Crater Base)',
  code: 'ARES-V',
  destination: 'Martian Surface (18.38°N 77.58°E Jezero Crater)',
  orbitOrLocation: 'Surface Habitation Complex',
  gravityLabel: '0.38g (3/8g Hypogravity)',
  gravityG: 0.38,
  owltLabel: '14m 22s (One-Way Light Time Delay)',
  owltSeconds: 862,
  radiationProfile: 'Thin CO2 Atmosphere Shielding // GCR Doses (1.5–3.2 mSv/day)',
  summary:
    'Ultra-long-duration expedition characterized by total communications autonomy (14–24 min one-way light delay), Martian Sol circadian drift (24h 39m clock), toxic iron oxide and perchlorate surface soils, cumulative galactic cosmic radiation (GCR), and prolonged neurobehavioral isolation.',
  primaryRiskFactors: [
    'Autonomous Medical Triage (No Earth Synchronous Tele-Medicine)',
    'Martian Sol Circadian Drift (39 minutes daily sleep phase shifting)',
    'Cumulative Galactic Cosmic Radiation (GCR) & DNA Double-Strand Breaks',
    'Cognitive Fatigue & PVT Attentional Lapses from Chronic Confinement',
    'Severe Musculoskeletal Deconditioning (Multi-year cumulative 3/8g load)',
  ],
  prioritySystems: [
    {
      category: 'IMMUNE_RADIATION',
      priorityWeight: 10,
      rationale:
        'Cumulative GCR causes immune system senescence, T-cell exhaustion, and high risk of opportunistic infection with no evacuation path.',
    },
    {
      category: 'METABOLIC_HYDRATION',
      priorityWeight: 9,
      rationale:
        'Adapting circadian machinery to the 24h 39m Sol causes persistent desynchronosis and metabolic dysfunction.',
    },
    {
      category: 'MUSCULOSKELETAL',
      priorityWeight: 9,
      rationale:
        'Over 500 Sols on surface, cumulative bone mineral density loss and tendon stiffness changes can lead to fracture risk during surface traversal.',
    },
    {
      category: 'OCULAR_NEURO',
      priorityWeight: 8,
      rationale:
        'Continuous Psychomotor Vigilance Test (PVT) monitoring required to detect cognitive degradation and depression.',
    },
    {
      category: 'CARDIOVASCULAR',
      priorityWeight: 7,
      rationale:
        'Left ventricular mass loss during long interplanetary cruise manifests as reduced aerobic capacity on Mars.',
    },
    {
      category: 'RESPIRATORY_DUST',
      priorityWeight: 8,
      rationale:
        'Martian perchlorates (ClO4-) and fine basaltic dust irritate thyroid and lung tissue upon habitat intrusion.',
    },
  ],
  physiologicalParameters: [
    {
      id: 'PVT_MEAN_REACTION_TIME',
      name: 'PVT Mean Reaction Time',
      category: 'OCULAR_NEURO',
      unit: 'ms',
      nominalRange: [180, 260],
      cautionRange: [261, 340],
      warningRange: [341, 550],
      priorityWeight: 10,
      sampleIntervalSec: 86400,
      nasaRef: 'NASA HRP Behavioral Health & Performance PVT Standard',
      description: 'Standard 30-second Psychomotor Vigilance Task median response latency.',
      impactNote: 'Latencies > 350 ms correlate with high risk of operational task failure.',
    },
    {
      id: 'PVT_LAPSES',
      name: 'PVT Lapses (>350ms)',
      category: 'OCULAR_NEURO',
      unit: 'count',
      nominalRange: [0, 2],
      cautionRange: [3, 5],
      warningRange: [6, 15],
      priorityWeight: 10,
      sampleIntervalSec: 86400,
      nasaRef: 'NASA HRP PVT Fatigue Metric',
      description: 'Number of delayed attentional failures during vigilance test.',
      impactNote: 'Multiple lapses signal severe cognitive micro-sleep episodes.',
    },
    {
      id: 'CIRCADIAN_SOL_OFFSET',
      name: 'Circadian Phase Shift vs Mars Sol',
      category: 'METABOLIC_HYDRATION',
      unit: 'hours',
      nominalRange: [-0.5, 0.5],
      cautionRange: [0.6, 1.8],
      warningRange: [1.9, 4.5],
      priorityWeight: 9,
      sampleIntervalSec: 3600,
      nasaRef: 'NASA-STD-3001 Vol 1 §4.1',
      description: 'Melatonin onset delta relative to local Martian sunset.',
      impactNote: 'Misalignment causes refractory insomnia, anorexia, and irritability.',
    },
    {
      id: 'BONE_MINERAL_DENSITY_DELTA',
      name: 'Cumulative BMD Loss vs Baseline',
      category: 'MUSCULOSKELETAL',
      unit: '% Delta',
      nominalRange: [0, -3.0],
      cautionRange: [-3.1, -6.5],
      warningRange: [-6.6, -15.0],
      priorityWeight: 9,
      sampleIntervalSec: 604800,
      nasaRef: 'NASA HRP Bone Demineralization Standard',
      description: 'Dual-energy X-ray absorptiometry / ultrasound heel bone mineral density index.',
      impactNote: 'Losses beyond 6.5% place femoral neck at spontaneous fracture risk in 3/8g.',
    },
    {
      id: 'LYMPHOCYTE_CD4_RATIO',
      name: 'T-Cell Immune Competence (CD4/CD8)',
      category: 'IMMUNE_RADIATION',
      unit: 'Ratio',
      nominalRange: [1.4, 2.4],
      cautionRange: [1.0, 1.39],
      warningRange: [0.4, 0.99],
      priorityWeight: 9,
      sampleIntervalSec: 86400,
      nasaRef: 'NASA HRP Immune Dysregulation Standard',
      description: 'Helper-to-cytotoxic T-lymphocyte ratio via blood cartridge.',
      impactNote: 'Inverted ratios (<1.0) allow persistent viral shedding and skin infections.',
    },
    {
      id: 'CUMULATIVE_GCR_DOSE',
      name: 'Cumulative Deep Space / Mars Dose',
      category: 'IMMUNE_RADIATION',
      unit: 'mSv',
      nominalRange: [0, 250],
      cautionRange: [251, 450],
      warningRange: [451, 800],
      priorityWeight: 10,
      sampleIntervalSec: 3600,
      nasaRef: 'NASA-STD-3001 Vol 1 §4.2 (Career Limit: 600 mSv)',
      description: 'Total ionizing radiation dose absorbed during transit and surface stay.',
      impactNote: 'Nearing 600 mSv approaches the NASA astronaut career lifetime limit.',
    },
  ],
  environmentalParameters: [
    {
      id: 'HABITAT_PERCHLORATE_PPM',
      name: 'Habitat Trace Perchlorate Dust',
      unit: 'ppm',
      nominalRange: [0.0, 0.05],
      cautionRange: [0.06, 0.20],
      warningRange: [0.21, 1.5],
      nasaStandardRef: 'NASA-STD-3001 Vol 2 §6.4.3 (Martian Soil Contaminant Limits)',
      description: 'Concentration of toxic Martian perchlorate salts (ClO4-) tracked in habitat air.',
      dangerDescription:
        'Perchlorates disrupt thyroid iodine uptake, cause aplastic anemia risks, and irritate respiratory mucosa.',
    },
    {
      id: 'SOL_CYCLE_CLOCK',
      name: 'Local Mars Sol Time (Jezero Crater)',
      unit: 'Sol Hr',
      nominalRange: [0.0, 24.65],
      cautionRange: [0, 0],
      warningRange: [0, 0],
      nasaStandardRef: 'Martian Coordinated Time (MTC)',
      description: '1 Sol = 24 hours 39 minutes 35.244 seconds.',
      dangerDescription: 'Daily 39-minute slippage requires strict blue-enriched lighting protocols.',
    },
    {
      id: 'HAB_RADIATION_SHIELD_MARGIN',
      name: 'Sub-Regolith Habitat Shielding Attenuation',
      unit: '% Effective',
      nominalRange: [85, 99],
      cautionRange: [70, 84],
      warningRange: [40, 69],
      nasaStandardRef: 'NASA HRP Radiation Protection Architecture',
      description: 'Attenuation ratio provided by 2.5 meters of piled Martian regolith shielding.',
      dangerDescription: 'Compromised shielding exposes crew to unattenuated heavy iron ions (HZE).',
    },
  ],
  crossCorrelationRules: [
    {
      id: 'MARS_RULE_SOL_DESYNC_PVT',
      title: 'Sol Circadian Desync + Cognitive Vigilance Failure',
      targetCategory: 'OCULAR_NEURO',
      conditionDescription: 'Circadian Sol Offset > 1.8 hrs AND PVT Mean Reaction Time > 330 ms',
      physiologicalTrigger: { paramId: 'PVT_MEAN_REACTION_TIME', operator: '>', threshold: 330 },
      environmentalTrigger: { paramId: 'HABITAT_PERCHLORATE_PPM', operator: '>=', threshold: 0.0 },
      resultingStatus: 'WARNING',
      clinicalRationale:
        'Circadian drift against the 24.65h Martian Sol has destabilized slow-wave sleep. Consecutive PVT attentional lapses indicate degraded mission-critical piloting capability under 14-min comms lag.',
      countermeasureCueCardId: 'EXPLORATION_AUTONOMOUS_MEDICINE_SUITE',
    },
    {
      id: 'MARS_RULE_BMD_LOSS',
      title: 'Accelerated Bone Demineralization in 3/8g',
      targetCategory: 'MUSCULOSKELETAL',
      conditionDescription: 'BMD Delta < -5.0% AND Cumulative GCR > 300 mSv',
      physiologicalTrigger: { paramId: 'BONE_MINERAL_DENSITY_DELTA', operator: '<', threshold: -5.0 },
      environmentalTrigger: { paramId: 'HAB_RADIATION_SHIELD_MARGIN', operator: '<', threshold: 82 },
      resultingStatus: 'CAUTION',
      clinicalRationale:
        'Hypogravity resorption outpaces osteoblast synthesis. Concomitant radiation enhances bone marrow oxidative stress. Spontaneous micro-fracture risk.',
      countermeasureCueCardId: 'ARED_RESISTIVE_DEVICE',
    },
  ],
  hardwareCueCards: GLOBAL_HARDWARE_CATALOG.filter(h => h.missionRelevance.includes('MARS')),
  scenarios: [
    {
      id: 'nominal_mars',
      name: 'Nominal Sol 142 Operations',
      missionId: 'MARS',
      description: 'Crew adjusted to 24h 39m Sol rhythm. Deep regolith vault shielding at 94% efficiency.',
      severity: 'NOMINAL',
      overrideTelemetry: {
        PVT_MEAN_REACTION_TIME: 224,
        PVT_LAPSES: 1,
        CIRCADIAN_SOL_OFFSET: 0.2,
        BONE_MINERAL_DENSITY_DELTA: -2.1,
        LYMPHOCYTE_CD4_RATIO: 1.8,
        CUMULATIVE_GCR_DOSE: 185,
      },
      overrideEnvironment: {
        HABITAT_PERCHLORATE_PPM: 0.02,
        SOL_CYCLE_CLOCK: 14.2,
        HAB_RADIATION_SHIELD_MARGIN: 94,
      },
      expectedDiagnosisSupport:
        'Nominal autonomous Martian operations. Continue circadian LED light box therapy.',
    },
    {
      id: 'mars_dust_circadian',
      name: 'Regional Dust Storm + Circadian Desynchrony Crisis',
      missionId: 'MARS',
      description:
        'A month-long Martian dust storm blocks solar arrays. Crew experiences insomnia, severe PVT lapses (>6 lapses), and trace perchlorate airlock intrusion.',
      severity: 'WARNING',
      overrideTelemetry: {
        PVT_MEAN_REACTION_TIME: 412,
        PVT_LAPSES: 8,
        CIRCADIAN_SOL_OFFSET: 2.8,
        BONE_MINERAL_DENSITY_DELTA: -5.4,
        LYMPHOCYTE_CD4_RATIO: 0.85,
        CUMULATIVE_GCR_DOSE: 320,
      },
      overrideEnvironment: {
        HABITAT_PERCHLORATE_PPM: 0.28,
        SOL_CYCLE_CLOCK: 21.6,
        HAB_RADIATION_SHIELD_MARGIN: 76,
      },
      expectedDiagnosisSupport:
        'AUTONOMOUS ALERT (No Earth Live Link): Severe cognitive deficit and sleep desynchrony. Restrict astronaut from robotic arm/rover controls for 24 hours. Prescribe 0.5mg Melatonin 30m prior to sleep lock.',
    },
  ],
};

// -------------------------------------------------------------
// 4. DEEP SPACE (EXTENDED INTERPLANETARY TRANSIT // 0g TRANSIT)
// -------------------------------------------------------------
export const DEEP_SPACE_MISSION_PROFILE: MissionProfile = {
  id: 'DEEP_SPACE',
  name: 'Interplanetary Transit (Deep Space Transport)',
  code: 'CHRONOS-I',
  destination: 'Heliocentric Transfer Orbit (Earth-Mars Cycler)',
  orbitOrLocation: 'Interplanetary Cruise',
  gravityLabel: '0.00g Transit Microgravity',
  gravityG: 0.0,
  owltLabel: '38m 10s (Autonomous Mode)',
  owltSeconds: 2290,
  radiationProfile: 'Zero Shielding Interplanetary Vacuum // Cosmic Heavy Ions & SPEs',
  summary:
    'Extended cruise through deep interplanetary space with complete reliance on closed-loop life support (ECLSS), full autonomous clinical triage, high risk of acute Solar Particle Events (SPEs), and severe confinement-induced psychological and immunological stress.',
  primaryRiskFactors: [
    'Solar Particle Events (SPE) Requiring Immediate Water-Wall Storm Shelter Lock',
    'Closed-Loop ECLSS Trace Contaminant Accumulation',
    'Immune System Exhaustion & Chronic T-Cell Suppression',
    'Long-Horizon Cardiovascular Left Ventricular Remodeling',
    'Complete Communications Isolation (Deep Space Network latency > 30 mins)',
  ],
  prioritySystems: [
    {
      category: 'IMMUNE_RADIATION',
      priorityWeight: 10,
      rationale:
        'Unattenuated GCR and sporadic SPEs pose lethal acute radiation syndrome (ARS) hazards if storm shelter is breached.',
    },
    {
      category: 'CARDIOVASCULAR',
      priorityWeight: 9,
      rationale:
        'Continuous lack of hydrostatic column causes 10-15% myocardial mass shrinkage and stroke volume loss.',
    },
    {
      category: 'OCULAR_NEURO',
      priorityWeight: 9,
      rationale:
        'Persistent cephalad pressure with no gravity relief for 250+ days poses maximum risk for permanent SANS visual impairment.',
    },
    {
      category: 'MUSCULOSKELETAL',
      priorityWeight: 8,
      rationale:
        'High mechanical loading protocols required to prevent total loss of postural antigravity musculature.',
    },
    {
      category: 'METABOLIC_HYDRATION',
      priorityWeight: 8,
      rationale:
        'Strict water reclamation closed-loop recycling requires constant electrolyte monitoring.',
    },
    {
      category: 'RESPIRATORY_DUST',
      priorityWeight: 7,
      rationale:
        'Trace volatile organic compounds (VOCs) and catalytic scrubber performance dictate air purity.',
    },
  ],
  physiologicalParameters: [
    {
      id: 'SPE_ACUTE_RADIATION_FLUX',
      name: 'Active Dosimeter Instantaneous Flux',
      category: 'IMMUNE_RADIATION',
      unit: 'mGy/hr',
      nominalRange: [0.01, 0.08],
      cautionRange: [0.09, 0.49],
      warningRange: [0.50, 120.0],
      priorityWeight: 10,
      sampleIntervalSec: 1,
      nasaRef: 'NASA-STD-3001 Vol 1 §4.2',
      description: 'Real-time ionizing radiation dose rate inside the spacecraft.',
      impactNote: 'Rates > 0.50 mGy/hr indicate coronal mass ejection impact. Instant alarm.',
    },
    {
      id: 'PLATELET_COUNT',
      name: 'Blood Platelet Count (PCBA)',
      category: 'IMMUNE_RADIATION',
      unit: 'k/µL',
      nominalRange: [150, 380],
      cautionRange: [90, 149],
      warningRange: [20, 89],
      priorityWeight: 9,
      sampleIntervalSec: 86400,
      nasaRef: 'NASA-STD-3001 Vol 2 §11.3',
      description: 'Thrombocyte count derived from onboard blood analyzer.',
      impactNote: 'Acute drop indicates bone marrow suppression from high-energy radiation.',
    },
    {
      id: 'CARDIAC_STROKE_VOLUME',
      name: 'Left Ventricular Stroke Volume',
      category: 'CARDIOVASCULAR',
      unit: 'mL',
      nominalRange: [65, 95],
      cautionRange: [50, 64],
      warningRange: [30, 49],
      priorityWeight: 9,
      sampleIntervalSec: 3600,
      nasaRef: 'NASA HRP Cardiovascular Risk',
      description: 'Echocardiographic estimate of blood pumped per ventricular contraction.',
      impactNote: 'Chronic drop indicates cardiac atrophy from prolonged microgravity unloading.',
    },
    {
      id: 'PSYCH_ISOLATION_INDEX',
      name: 'Neurobehavioral Isolation Stress Index',
      category: 'OCULAR_NEURO',
      unit: 'Index (0-10)',
      nominalRange: [1.0, 3.5],
      cautionRange: [3.6, 6.0],
      warningRange: [6.1, 10.0],
      priorityWeight: 8,
      sampleIntervalSec: 86400,
      nasaRef: 'NASA HRP Behavioral Medicine',
      description: 'Composite metric combining speech acoustic prosody, facial affect, and PVT stability.',
      impactNote: 'High scores reflect cognitive confinement exhaustion and team cohesion strain.',
    },
    {
      id: 'SANS_EDEMA_INDEX',
      name: 'Transit Cephalad SANS Edema',
      category: 'OCULAR_NEURO',
      unit: 'Ratio Delta %',
      nominalRange: [0, 9],
      cautionRange: [10, 18],
      warningRange: [19, 35],
      priorityWeight: 9,
      sampleIntervalSec: 3600,
      nasaRef: 'NASA HRP SANS Research Roadmap',
      description: 'Long-horizon facial and optic peripapillary fluid accumulation.',
      impactNote: 'Persistent fluid shifts risk irreversible retinal nerve fiber layer thickening.',
    },
  ],
  environmentalParameters: [
    {
      id: 'ECLSS_WATER_RECOVERY_PCT',
      name: 'Closed-Loop Water Recovery Efficiency',
      unit: '%',
      nominalRange: [95.0, 99.5],
      cautionRange: [88.0, 94.9],
      warningRange: [60.0, 87.9],
      nasaStandardRef: 'NASA Exploration ECLSS Benchmark (>98% target)',
      description: 'Potable water distillate recovery from crew sweat, condensate, and urine.',
      dangerDescription: 'Drops below 95% deplete consumable water reserves before Mars orbital insertion.',
    },
    {
      id: 'SPE_STORM_SHELTER_STATUS',
      name: 'SPE Radiation Shelter Lock Status',
      unit: 'State',
      nominalRange: [0, 0], // 0: Standby, 1: Advisory, 2: LOCK ACTIVE
      cautionRange: [1, 1],
      warningRange: [2, 2],
      nasaStandardRef: 'NASA Spacecraft Storm Shelter Protocol',
      description: 'Water-wall fortified central storm shelter shielding status.',
      dangerDescription:
        'State 2 (LOCK ACTIVE) indicates crew must immediately retreat into water-jacketed core.',
    },
    {
      id: 'DSN_COMM_QUEUE_DELAY',
      name: 'Deep Space Network Packet Round-Trip Delay',
      unit: 'minutes',
      nominalRange: [35, 45],
      cautionRange: [46, 75],
      warningRange: [76, 120],
      nasaStandardRef: 'NASA DSN Deep Space Navigation',
      description: 'Round-trip signal latency to Goldstone / Madrid / Canberra DSN dishes.',
      dangerDescription: 'Full clinical autonomy required. Earth cannot provide real-time guidance.',
    },
  ],
  crossCorrelationRules: [
    {
      id: 'DEEP_SPACE_RULE_SPE_ALARM',
      title: 'SPE Proton Surge + Active Thrombocytopenia Risk',
      targetCategory: 'IMMUNE_RADIATION',
      conditionDescription: 'Radiation Flux > 0.50 mGy/hr OR Storm Shelter Status = LOCK ACTIVE',
      physiologicalTrigger: { paramId: 'SPE_ACUTE_RADIATION_FLUX', operator: '>', threshold: 0.50 },
      environmentalTrigger: { paramId: 'SPE_STORM_SHELTER_STATUS', operator: '>=', threshold: 1 },
      resultingStatus: 'WARNING',
      clinicalRationale:
        'Solar Particle Event (SPE) proton surge detected. Crew must immediately secure habitat, enter water-wall storm shelter, and ingest radioprotective antioxidant countermeasures.',
      countermeasureCueCardId: 'EXPLORATION_AUTONOMOUS_MEDICINE_SUITE',
    },
    {
      id: 'DEEP_SPACE_RULE_CARDIAC_SANS',
      title: 'Myocardial Deconditioning + Progressive Cephalad Fluid Shift',
      targetCategory: 'CARDIOVASCULAR',
      conditionDescription: 'Cardiac Stroke Volume < 52 mL AND SANS Edema Index > 16%',
      physiologicalTrigger: { paramId: 'CARDIAC_STROKE_VOLUME', operator: '<', threshold: 52 },
      environmentalTrigger: { paramId: 'ECLSS_WATER_RECOVERY_PCT', operator: '<', threshold: 94 },
      resultingStatus: 'CAUTION',
      clinicalRationale:
        'Unremitting microgravity has reduced left ventricular filling pressure while maintaining elevated venous head pressures. Prescribe 45-minute daily cycle ergometer interval training.',
      countermeasureCueCardId: 'ARED_RESISTIVE_DEVICE',
    },
  ],
  hardwareCueCards: GLOBAL_HARDWARE_CATALOG.filter(h => h.missionRelevance.includes('DEEP_SPACE')),
  scenarios: [
    {
      id: 'nominal_deep_space',
      name: 'Nominal Interplanetary Cruise (Day 118)',
      missionId: 'DEEP_SPACE',
      description: 'Deep Space Transport cruise nominal. ECLSS water loop at 98.4% efficiency. DSN link stable.',
      severity: 'NOMINAL',
      overrideTelemetry: {
        SPE_ACUTE_RADIATION_FLUX: 0.03,
        PLATELET_COUNT: 245,
        CARDIAC_STROKE_VOLUME: 78,
        PSYCH_ISOLATION_INDEX: 2.8,
        SANS_EDEMA_INDEX: 7.2,
      },
      overrideEnvironment: {
        ECLSS_WATER_RECOVERY_PCT: 98.4,
        SPE_STORM_SHELTER_STATUS: 0,
        DSN_COMM_QUEUE_DELAY: 38.2,
      },
      expectedDiagnosisSupport:
        'Interplanetary transit nominal. Maintain autonomous daily physical countermeasure log.',
    },
    {
      id: 'spe_radiation_storm',
      name: 'Deep Space Solar Particle Event (SPE) + Storm Shelter Lock',
      missionId: 'DEEP_SPACE',
      description:
        'Coronal mass ejection (CME) shockwave strikes spacecraft. Radiation dosimeters scream at 3.8 mGy/hr. Crew retreats to water-wall storm shelter.',
      severity: 'WARNING',
      overrideTelemetry: {
        SPE_ACUTE_RADIATION_FLUX: 3.85,
        PLATELET_COUNT: 118,
        CARDIAC_STROKE_VOLUME: 64,
        PSYCH_ISOLATION_INDEX: 7.4,
        SANS_EDEMA_INDEX: 12.5,
      },
      overrideEnvironment: {
        ECLSS_WATER_RECOVERY_PCT: 92.1,
        SPE_STORM_SHELTER_STATUS: 2, // LOCK ACTIVE
        DSN_COMM_QUEUE_DELAY: 46.5,
      },
      expectedDiagnosisSupport:
        'MASTER ALARM: Class X Solar Flare SPE Alert. Storm shelter seal locked. Water-shield surrounding crew deployed. Administer granulocyte colony-stimulating factor (G-CSF) if acute dose exceeds 1.5 Gy.',
    },
  ],
};

// -------------------------------------------------------------
// EXTENSIBLE MISSION PROFILE REGISTRY
// -------------------------------------------------------------
export const MISSION_PROFILES: Record<string, MissionProfile> = {
  ISS: ISS_MISSION_PROFILE,
  MOON: MOON_MISSION_PROFILE,
  MARS: MARS_MISSION_PROFILE,
  DEEP_SPACE: DEEP_SPACE_MISSION_PROFILE,
};

/**
 * Extensibility hook allowing dynamic registration of new planetary destinations
 * (e.g., Europa Ice Drilling Base, Phobos Staging Platform, Lunar Gateway Station)
 */
export function registerNewMissionProfile(profile: MissionProfile): void {
  if (!profile.id) {
    throw new Error('MissionProfile must possess a unique id string');
  }
  MISSION_PROFILES[profile.id] = profile;
}

export function getMissionProfile(id: MissionId): MissionProfile {
  return MISSION_PROFILES[id] || ISS_MISSION_PROFILE;
}
