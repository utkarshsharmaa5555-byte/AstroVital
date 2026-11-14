'use client';

import React, { useState } from 'react';
import { HardwareCueCard, GLOBAL_HARDWARE_CATALOG } from '@/config/missionProfiles';
import {
  Wrench,
  CheckSquare,
  Shield,
  X,
  ExternalLink,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';

interface HardwareCueCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCueCardId: string | null;
  onSelectCueCard: (id: string) => void;
}

export function HardwareCueCardsModal({
  isOpen,
  onClose,
  selectedCueCardId,
  onSelectCueCard,
}: HardwareCueCardsModalProps) {
  const [filterMode, setFilterMode] = useState<'ALL' | 'ESTABLISHED' | 'AUTONOMOUS'>('ALL');

  if (!isOpen) return null;

  const filteredCards = GLOBAL_HARDWARE_CATALOG.filter((c) => {
    if (filterMode === 'ESTABLISHED') return c.status === 'ESTABLISHED_FLIGHT_HARDWARE';
    if (filterMode === 'AUTONOMOUS') return c.status === 'AUTONOMOUS_EXPLORATION_CONCEPT';
    return true;
  });

  const activeCard: HardwareCueCard =
    GLOBAL_HARDWARE_CATALOG.find((c) => c.id === selectedCueCardId) ||
    filteredCards[0] ||
    GLOBAL_HARDWARE_CATALOG[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-spacecraft-surface border border-spacecraft-border rounded-lg max-w-5xl w-full max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl font-mono select-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-spacecraft-border bg-spacecraft-panel">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-flight-info" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                NASA ONBOARD MEDICAL HARDWARE CUE CARDS & SELF-EXAM CHECKLISTS
              </h2>
              <p className="text-[11px] text-gray-400">
                NASA-STD-3001 Vol 2 // Established Flight Hardware vs Exploration Autonomous Concepts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-spacecraft-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 bg-spacecraft-bg border-b border-spacecraft-borderMuted flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">HARDWARE CATEGORY:</span>
            <div className="flex items-center bg-spacecraft-card rounded border border-spacecraft-border p-0.5">
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  filterMode === 'ALL' ? 'bg-spacecraft-border text-white font-bold' : 'text-gray-400'
                }`}
              >
                ALL ({GLOBAL_HARDWARE_CATALOG.length})
              </button>
              <button
                onClick={() => setFilterMode('ESTABLISHED')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  filterMode === 'ESTABLISHED' ? 'bg-flight-nominal text-black font-bold' : 'text-gray-400'
                }`}
              >
                ESTABLISHED ISS/ARTEMIS
              </button>
              <button
                onClick={() => setFilterMode('AUTONOMOUS')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  filterMode === 'AUTONOMOUS' ? 'bg-flight-accent text-white font-bold' : 'text-gray-400'
                }`}
              >
                AUTONOMOUS EXPLORATION CONCEPTS
              </button>
            </div>
          </div>
        </div>

        {/* Body (Left sidebar + Right detailed view) */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Cards List (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-2 overflow-y-auto max-h-[550px] pr-1">
            {filteredCards.map((card) => {
              const isSelected = activeCard.id === card.id;
              const isEstablished = card.status === 'ESTABLISHED_FLIGHT_HARDWARE';

              return (
                <button
                  key={card.id}
                  onClick={() => onSelectCueCard(card.id)}
                  className={`p-3 rounded text-left transition-all border flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-spacecraft-card border-flight-info text-white'
                      : 'bg-spacecraft-panel/70 border-spacecraft-border text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-tight">{card.acronym}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isEstablished
                          ? 'bg-flight-nominal/20 text-flight-nominal border border-flight-nominal/30'
                          : 'bg-flight-accent/20 text-flight-accent border border-flight-accent/30'
                      }`}
                    >
                      {isEstablished ? 'ESTABLISHED' : 'CONCEPT'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-300 font-semibold leading-tight line-clamp-1">
                    {card.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Missions: {card.missionRelevance.join(', ')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Card Detail (8 cols) */}
          <div className="md:col-span-8 flex flex-col gap-4 bg-spacecraft-panel p-5 rounded border border-spacecraft-border">
            {/* Header info */}
            <div className="flex flex-col gap-1.5 border-b border-spacecraft-border pb-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    activeCard.status === 'ESTABLISHED_FLIGHT_HARDWARE'
                      ? 'bg-flight-nominal/20 text-flight-nominal border border-flight-nominal/40'
                      : 'bg-flight-accent/20 text-flight-accent border border-flight-accent/40'
                  }`}
                >
                  {activeCard.status === 'ESTABLISHED_FLIGHT_HARDWARE'
                    ? 'ESTABLISHED NASA FLIGHT HARDWARE'
                    : 'EXPLORATION MEDICAL CAPABILITY CONCEPT (MARS / DEEP SPACE)'}
                </span>

                <span className="text-[10px] text-gray-400">{activeCard.nasaStandardRef}</span>
              </div>

              <h3 className="text-base font-bold text-white">{activeCard.name}</h3>
              <p className="text-xs text-flight-info">Acronym / Callout: {activeCard.acronym}</p>
            </div>

            {/* "Explain Like I'm Not a Doctor" Plain-English Guide */}
            <div className="bg-spacecraft-bg p-3.5 rounded border border-spacecraft-borderMuted flex flex-col gap-1.5">
              <div className="text-xs font-bold text-flight-nominal flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-flight-nominal" />
                "EXPLAIN LIKE I'M NOT A DOCTOR" // OVERVIEW:
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                {activeCard.plainEnglishDescription}
              </p>
            </div>

            {/* Clinical Purpose & Impact */}
            <div className="bg-spacecraft-bg p-3.5 rounded border border-spacecraft-borderMuted flex flex-col gap-1.5">
              <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-flight-info" />
                SPACE MEDICINE CLINICAL PURPOSE:
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{activeCard.clinicalPurpose}</p>
            </div>

            {/* Step-by-Step Procedure Checklist */}
            <div className="bg-spacecraft-bg p-3.5 rounded border border-spacecraft-borderMuted flex flex-col gap-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-flight-caution" />
                ONBOARD STEP-BY-STEP CHECKLIST PROTOCOL:
              </div>
              <ol className="flex flex-col gap-1.5 text-xs text-gray-200 pl-1">
                {activeCard.stepByStepProtocol.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-1.5 rounded bg-spacecraft-card/80 border border-spacecraft-borderMuted text-gray-200 text-[11px]"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Actionable Countermeasure Protocol */}
            <div className="p-3 rounded bg-flight-nominal/10 border border-flight-nominal/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase">IMMEDIATE COUNTERMEASURE ACTION:</span>
                <div className="text-white font-bold">{activeCard.countermeasureAction}</div>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-flight-nominal text-black font-bold rounded text-xs hover:bg-emerald-600 transition-colors"
              >
                DISMISS CUE CARD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
