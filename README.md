# ASTROVITAL // Multi-Planetary Mission-Adaptive Crew Health & Telemetry System
### 2026 NASA Space Apps Challenge: "Create Health Monitoring Software for Astronauts on Space Missions"

ASTROVITAL is an offline-first, aerospace-grade crew health intelligence system engineered to adapt dynamically to distinct planetary gravity fields, communications latencies (One-Way Light Time), and environmental hazard profiles across **ISS (LEO)**, **MOON (Artemis)**, **MARS (Surface)**, and **DEEP SPACE (Transit)**.

---

## 🚀 Key Architectural Capabilities

### 1. Modular MissionProfile Engine
- **Dynamically Altering Parameters & Priority Weights:**
  - **ISS (0g Microgravity | OWLT ~0.1s):** Cephalad fluid redistribution, SANS (Spaceflight-Associated Neuro-ocular Syndrome), ARED resistive mechanical loading compliance, cabin $pp\text{CO}_2$ pocketing.
  - **MOON (1/6g Hypogravity | OWLT 1.3s):** Respirable lunar regolith dust limits ($< 0.3\,\text{mg/m}^3$ TWA), suit metabolic rate (BTU/hr), core body temperature, vestibular balance drift.
  - **MARS (3/8g Hypogravity | OWLT 14m–24m):** Complete medical autonomy, Sol circadian phase shifting ($24\text{h }39\text{m}$ clock), Psychomotor Vigilance Test (PVT) attentional lapses, long-horizon bone mineral density loss.
  - **DEEP SPACE (0g Transit | OWLT 35m–60m+):** Interplanetary SPE (Solar Particle Event) alert shelter lock, closed-loop ECLSS water recycling, cardiac stroke volume atrophy.
- **Extensibility:** Simple typed configuration schema (`MissionProfile`) supporting new destinations (e.g., Europa, Phobos, Lunar Gateway) with a single object registration.

### 2. Client-Side Facial Biometrics & Space-Medicine HUD
- Real-time offline face detection and 68-point landmark tracking using `@vladmandic/face-api` (with graceful fallback to high-fidelity synthetic telemetry simulation if camera is offline).
- **Space-Medicine Telemetry Indices:**
  1. **Facial Fluid Shift / Edema Index:** Tracks facial width-to-height ratio swelling relative to pre-flight baseline ($L-30\text{d}$) to detect microgravity cephalad fluid redistribution.
  2. **Ocular Fatigue & Eye Aspect Ratio (EAR):** Measures palpebral fissure height-to-width ratio to detect micro-sleep episodes and circadian exhaustion.
- Enrolls custom astronaut facial descriptors directly to `localStorage`.

### 3. Explainable AI Health Intelligence (Non-Diagnostic Decision Support)
- **Individual Baseline Delta:** Compares live telemetry against each astronaut's personal pre-flight baseline ($\mu \pm \sigma$) rather than generic Earth population averages.
- **Environmental Cross-Correlation Engine:** Correlates physiological reactions with habitat and spacesuit sensors (e.g., elevated heart rate + breathing frequency cross-referenced with lunar dust breaches).
- **Explainable Alert Cards:** Every alert specifies detected patterns, exact multi-variable drivers, Z-scores, and 7-day/30-day projected trajectories with confidence intervals and uncertainty cones.

### 4. Interactive Anatomical Body Map & NASA Hardware Cue Cards
- **Interactive SVG Body Map:** Highlights 6 physiological systems (*Ocular/Neuro*, *Cardiovascular*, *Respiratory/Dust*, *Musculoskeletal*, *Metabolic/Hydration*, *Immune/Radiation*) weighted according to destination risks.
- **Documented NASA Instruments:** Step-by-step procedures and "Explain Like I'm Not a Doctor" guides for:
  - *Tempus Pro / Health Maintenance System (HMS)*
  - *Portable Clinical Blood Analyzer (PCBA / i-STAT)*
  - *Advanced Resistive Exercise Device (ARED)*
  - *Spaceflight OCT & Rebound Tonometer*
  - *Aerosol Particulate Mass Monitor (APMM)*
  - *Autonomous Clinical Decision Support System (ExMC Concept)*

### 5. Working 30-Second Psychomotor Vigilance Test (PVT)
- NASA-standard operational vigilance test with randomized stimulus intervals ($1800\text{ms} - 5000\text{ms}$), millisecond reaction timing, false-start penalties, and attentional lapse counting ($>350\text{ms}$).
- Computes an operational Cognitive Readiness score ($0-100\%$) that feeds directly into the live crew telemetry stream.

---

## 🛠️ Tech Stack & Standards
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with aerospace spacecraft palette (`#0B0E14` obsidian background, `#30363D` structural borders, NASA flight rule color coding)
- **Data Visualization:** Recharts (shaded nominal baseline envelopes & AI confidence cones)
- **Computer Vision:** `@vladmandic/face-api` (client-side WebGL / TensorFlow.js)
- **Compliance:** NASA-STD-3001 Vol 1 & Vol 2, NASA Human Research Program (HRP) Standards

---

## 🚦 Getting Started

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
