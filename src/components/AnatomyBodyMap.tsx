'use client';

import React from 'react';
import {
  MissionProfile,
  SystemCategory,
  FlightStatus,
} from '@/config/missionProfiles';
import {
  Eye,
  Heart,
  Wind,
  Dumbbell,
  Droplet,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface AnatomyBodyMapProps {
  mission: MissionProfile;
  selectedCategory: SystemCategory | null;
  onSelectCategory: (category: SystemCategory) => void;
  telemetry: Record<string, number>;
  categoryStatuses: Record<SystemCategory, FlightStatus>;
}

export function AnatomyBodyMap({
  mission,
  selectedCategory,
  onSelectCategory,
  telemetry,
  categoryStatuses,
}: AnatomyBodyMapProps) {
  // Priority map for current mission
  const priorityMap: Record<SystemCategory, number> = {
    OCULAR_NEURO: 5,
    CARDIOVASCULAR: 5,
    RESPIRATORY_DUST: 5,
    MUSCULOSKELETAL: 5,
    METABOLIC_HYDRATION: 5,
    IMMUNE_RADIATION: 5,
  };

  mission.prioritySystems.forEach((p) => {
    priorityMap[p.category] = p.priorityWeight;
  });

  const getStatusColor = (status: FlightStatus, isPriorityHigh: boolean) => {
    if (status === 'WARNING') return '#F85149';
    if (status === 'CAUTION') return '#D29922';
    if (status === 'NOMINAL') return '#2EA043';
    return isPriorityHigh ? '#58A6FF' : '#484F58';
  };

  const systems: {
    id: SystemCategory;
    name: string;
    icon: any;
    targetArea: string;
    yPos: number;
    xPos: number;
  }[] = [
    {
      id: 'OCULAR_NEURO',
      name: 'Ocular / Neuro (SANS)',
      icon: Eye,
      targetArea: 'Cranial & Ocular Globe',
      xPos: 150,
      yPos: 50,
    },
    {
      id: 'RESPIRATORY_DUST',
      name: 'Respiratory & Aerosol Dust',
      icon: Wind,
      targetArea: 'Pulmonary & Bronchial Tree',
      xPos: 150,
      yPos: 110,
    },
    {
      id: 'CARDIOVASCULAR',
      name: 'Cardiovascular & Fluid Shift',
      icon: Heart,
      targetArea: 'Myocardium & Systemic Vasculature',
      xPos: 150,
      yPos: 145,
    },
    {
      id: 'METABOLIC_HYDRATION',
      name: 'Metabolic & Core Thermal',
      icon: Droplet,
      targetArea: 'Hepatic, Renal & Core Heat',
      xPos: 150,
      yPos: 195,
    },
    {
      id: 'IMMUNE_RADIATION',
      name: 'Immune & Hematopoietic (GCR/SPE)',
      icon: Shield,
      targetArea: 'Bone Marrow & Lymphoid System',
      xPos: 150,
      yPos: 245,
    },
    {
      id: 'MUSCULOSKELETAL',
      name: 'Musculoskeletal (BMD & Atrophy)',
      icon: Dumbbell,
      targetArea: 'Lumbar Spine, Femur & Soleus',
      xPos: 150,
      yPos: 320,
    },
  ];

  return (
    <div className="bg-spacecraft-surface border border-spacecraft-border rounded p-4 flex flex-col font-mono select-none">
      <div className="flex items-center justify-between border-b border-spacecraft-border pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-flight-info animate-pulse" />
          <h3 className="text-xs font-bold text-white tracking-wide">
            PHYSIOLOGICAL SYSTEM RADAR // ANATOMICAL BODY MAP
          </h3>
        </div>
        <span className="text-[10px] text-gray-400">
          MISSION ADAPTIVE WEIGHTS [{mission.id}]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left / Center: SVG Anatomical Wireframe (7 cols) */}
        <div className="md:col-span-7 flex justify-center relative">
          <svg
            viewBox="0 0 300 420"
            className="w-full max-w-[260px] h-auto drop-shadow-lg"
          >
            {/* Background Grid Lines */}
            <defs>
              <pattern
                id="body-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#1F242C"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="300" height="420" fill="url(#body-grid)" rx="6" />

            {/* Astronaut Wireframe Silhouette (NASA Spacesuit / Human Body Contour) */}
            <g
              stroke="#30363D"
              strokeWidth="1.5"
              fill="#111622"
              fillOpacity="0.85"
            >
              {/* Head / Helmet */}
              <circle cx="150" cy="50" r="28" />
              {/* Neck */}
              <path d="M 143 78 L 143 88 L 157 88 L 157 78 Z" />
              {/* Torso */}
              <path d="M 120 90 L 180 90 L 172 210 L 128 210 Z" />
              {/* Arms */}
              <path d="M 120 90 L 95 160 L 80 230 L 92 235 L 105 170 L 124 110 Z" />
              <path d="M 180 90 L 205 160 L 220 230 L 208 235 L 195 170 L 176 110 Z" />
              {/* Pelvis & Legs */}
              <path d="M 128 210 L 122 300 L 115 390 L 135 395 L 145 300 L 150 225 L 155 300 L 165 395 L 185 390 L 178 300 L 172 210 Z" />
            </g>

            {/* Active System Nodes & Crosshair Targeting */}
            {systems.map((sys) => {
              const status = categoryStatuses[sys.id] || 'NOMINAL';
              const isSelected = selectedCategory === sys.id;
              const isHighPriority = (priorityMap[sys.id] || 0) >= 8;
              const color = getStatusColor(status, isHighPriority);

              return (
                <g
                  key={sys.id}
                  onClick={() => onSelectCategory(sys.id)}
                  className="cursor-pointer group"
                >
                  {/* Radar Pulse on active warning */}
                  {status === 'WARNING' && (
                    <circle
                      cx={sys.xPos}
                      cy={sys.yPos}
                      r="16"
                      fill="none"
                      stroke="#F85149"
                      strokeWidth="1.5"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}

                  {/* Node Outer Ring */}
                  <circle
                    cx={sys.xPos}
                    cy={sys.yPos}
                    r={isSelected ? 14 : 10}
                    fill="#161B26"
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Inner Target Core */}
                  <circle
                    cx={sys.xPos}
                    cy={sys.yPos}
                    r={isSelected ? 5 : 3.5}
                    fill={color}
                  />

                  {/* Priority Label */}
                  {isHighPriority && (
                    <text
                      x={sys.xPos + 18}
                      y={sys.yPos + 4}
                      fill={color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      P{priorityMap[sys.id]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Interactive System Selector Cards (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          {systems.map((sys) => {
            const Icon = sys.icon;
            const status = categoryStatuses[sys.id] || 'NOMINAL';
            const isSelected = selectedCategory === sys.id;
            const weight = priorityMap[sys.id] || 5;

            return (
              <button
                key={sys.id}
                onClick={() => onSelectCategory(sys.id)}
                className={`flex items-center justify-between p-2 rounded text-left transition-all border ${
                  isSelected
                    ? 'bg-spacecraft-card border-flight-info text-white'
                    : 'bg-spacecraft-panel/60 border-spacecraft-border text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded ${
                      status === 'WARNING'
                        ? 'bg-flight-warning/20 text-flight-warning'
                        : status === 'CAUTION'
                        ? 'bg-flight-caution/20 text-flight-caution'
                        : 'bg-flight-nominal/20 text-flight-nominal'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-tight text-white flex items-center gap-1.5">
                      {sys.name}
                    </div>
                    <div className="text-[9px] text-gray-400">{sys.targetArea}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                      status === 'WARNING'
                        ? 'bg-flight-warning text-black'
                        : status === 'CAUTION'
                        ? 'bg-flight-caution text-black'
                        : 'bg-flight-nominal/20 text-flight-nominal border border-flight-nominal/30'
                    }`}
                  >
                    {status}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-0.5">
                    PRIORITY: W{weight}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
