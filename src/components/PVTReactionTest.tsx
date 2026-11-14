'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Activity,
  Award,
} from 'lucide-react';

interface PVTReactionTestProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  astronautName: string;
  onRecordResult?: (meanRT: number, lapses: number, cognitiveScore: number) => void;
}

type PVTState = 'IDLE' | 'WAITING' | 'TRIGGERED' | 'FALSE_START' | 'COMPLETED';

export function PVTReactionTest({
  isOpen = true,
  isModal = true,
  onClose,
  astronautName,
  onRecordResult,
}: PVTReactionTestProps) {
  const [gameState, setGameState] = useState<PVTState>('IDLE');
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(30); // 30-second standard brief test
  const [currentReactionTime, setCurrentReactionTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lapsesCount, setLapsesCount] = useState<number>(0); // >350ms
  const [falseStartsCount, setFalseStartsCount] = useState<number>(0);

  const stimulusStartTimeRef = useRef<number>(0);
  const stimulusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount or close
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (testIntervalRef.current) clearInterval(testIntervalRef.current);
    if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
  };

  const startPVTTest = () => {
    clearAllTimers();
    setReactionTimes([]);
    setLapsesCount(0);
    setFalseStartsCount(0);
    setTestTimeRemaining(30);
    setCurrentReactionTime(0);
    setGameState('WAITING');

    // 30s countdown
    testIntervalRef.current = setInterval(() => {
      setTestTimeRemaining((prev) => {
        if (prev <= 1) {
          finishPVTTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    scheduleNextStimulus();
  };

  const scheduleNextStimulus = () => {
    setGameState('WAITING');
    setCurrentReactionTime(0);

    // Random delay between 1800ms and 5000ms
    const randomDelay = Math.floor(Math.random() * 3200) + 1800;

    stimulusTimeoutRef.current = setTimeout(() => {
      stimulusStartTimeRef.current = performance.now();
      setGameState('TRIGGERED');

      // Ticker for visual millisecond counter on screen
      tickerIntervalRef.current = setInterval(() => {
        const elapsed = Math.round(performance.now() - stimulusStartTimeRef.current);
        setCurrentReactionTime(elapsed);
      }, 10);
    }, randomDelay);
  };

  const handleUserClick = () => {
    if (gameState === 'WAITING') {
      // False start / Anticipation error
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      setFalseStartsCount((prev) => prev + 1);
      setGameState('FALSE_START');
      setTimeout(() => {
        scheduleNextStimulus();
      }, 1200);
      return;
    }

    if (gameState === 'TRIGGERED') {
      const clickTime = performance.now();
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);

      const reaction = Math.round(clickTime - stimulusStartTimeRef.current);
      setCurrentReactionTime(reaction);

      // Check if lapse (>350ms)
      if (reaction > 350) {
        setLapsesCount((prev) => prev + 1);
      }

      setReactionTimes((prev) => [...prev, reaction]);

      // Schedule next trial after 1000ms pause
      setTimeout(() => {
        scheduleNextStimulus();
      }, 1000);
    }
  };

  const finishPVTTest = () => {
    clearAllTimers();
    setGameState('COMPLETED');
  };

  // Calculate final score
  const avgRT =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 240;

  // NASA Cognitive Readiness Index (0-100)
  // Deduct for high RT (>250ms), lapses (>350ms), and false starts
  const baseScore = 100;
  const rtPenalty = Math.max(0, (avgRT - 220) * 0.2);
  const lapsePenalty = lapsesCount * 12;
  const falseStartPenalty = falseStartsCount * 8;
  const cognitiveScore = Math.max(15, Math.min(100, Math.round(baseScore - rtPenalty - lapsePenalty - falseStartPenalty)));

  const handleSaveResult = () => {
    if (onRecordResult) {
      onRecordResult(avgRT, lapsesCount, cognitiveScore);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className={`bg-spacecraft-surface border border-spacecraft-border rounded-[10px] w-full p-6 font-mono flex flex-col gap-4 select-none ${isModal ? 'max-w-xl shadow-2xl' : 'shadow-lg'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-spacecraft-border pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-flight-nominal" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider">
              PSYCHOMOTOR VIGILANCE TEST (PVT-B // 30s)
            </h2>
            <p className="text-[11px] text-gray-400">
              NASA Operational Cognitive Readiness Standard // Fast Reaction Time Evaluation
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={() => {
              clearAllTimers();
              onClose();
            }}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-spacecraft-card"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* Test Body */}
        {gameState === 'IDLE' && (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="w-16 h-16 rounded-full bg-spacecraft-card border border-spacecraft-border flex items-center justify-center">
              <Clock className="w-8 h-8 text-flight-info" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Astronaut: {astronautName}
              </h3>
              <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                As soon as the high-contrast millisecond counter begins running, click the
                action zone or tap spacebar as rapidly as possible. Do NOT anticipate or click early.
              </p>
            </div>
            <button
              onClick={startPVTTest}
              className="px-6 py-2.5 bg-flight-nominal hover:bg-emerald-600 text-black font-bold rounded text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(46,160,67,0.3)]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>COMMENCE 30-SECOND TEST</span>
            </button>
          </div>
        )}

        {(gameState === 'WAITING' ||
          gameState === 'TRIGGERED' ||
          gameState === 'FALSE_START') && (
          <div className="flex flex-col gap-3">
            {/* Status Strip */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-flight-nominal animate-ping" />
                SESSION IN PROGRESS
              </span>
              <span className="text-white font-bold tabular-nums">
                REMAINING: {testTimeRemaining}s
              </span>
            </div>

            {/* Reaction Touch/Click Target Zone */}
            <div
              onClick={handleUserClick}
              className={`h-56 rounded border flex flex-col items-center justify-center cursor-pointer transition-all ${
                gameState === 'TRIGGERED'
                  ? 'bg-flight-warning/20 border-flight-warning shadow-[0_0_30px_rgba(248,81,73,0.35)]'
                  : gameState === 'FALSE_START'
                  ? 'bg-flight-caution/20 border-flight-caution'
                  : 'bg-spacecraft-bg border-spacecraft-border hover:border-gray-500'
              }`}
            >
              {gameState === 'WAITING' && (
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-1 font-semibold">
                    FOCUS GAZE HERE
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Waiting for stimulus...
                  </div>
                </div>
              )}

              {gameState === 'TRIGGERED' && (
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-flight-warning font-mono tabular-nums tracking-widest animate-pulse">
                    {currentReactionTime} ms
                  </div>
                  <div className="text-xs font-bold text-white mt-2 uppercase tracking-widest">
                    TAP NOW!
                  </div>
                </div>
              )}

              {gameState === 'FALSE_START' && (
                <div className="text-center text-flight-caution flex flex-col items-center gap-1">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <span className="text-sm font-bold">FALSE START!</span>
                  <span className="text-[11px] text-gray-400">
                    Premature click recorded. Wait for stimulus.
                  </span>
                </div>
              )}
            </div>

            {/* Real-Time Metrics Counters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-spacecraft-panel p-2 rounded border border-spacecraft-border">
                <div className="text-gray-400 text-[10px]">VALID TRIALS</div>
                <div className="text-white font-bold text-sm">
                  {reactionTimes.length}
                </div>
              </div>
              <div className="bg-spacecraft-panel p-2 rounded border border-spacecraft-border">
                <div className="text-gray-400 text-[10px]">LAPSES (&gt;350ms)</div>
                <div
                  className={`font-bold text-sm ${
                    lapsesCount > 2 ? 'text-flight-warning' : 'text-white'
                  }`}
                >
                  {lapsesCount}
                </div>
              </div>
              <div className="bg-spacecraft-panel p-2 rounded border border-spacecraft-border">
                <div className="text-gray-400 text-[10px]">FALSE STARTS</div>
                <div
                  className={`font-bold text-sm ${
                    falseStartsCount > 0 ? 'text-flight-caution' : 'text-white'
                  }`}
                >
                  {falseStartsCount}
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'COMPLETED' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-flight-nominal/20 text-flight-nominal mb-2">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">
                TEST SESSION COMPLETE
              </h3>
              <p className="text-xs text-gray-400">
                Cognitive Readiness metrics updated to mission telemetry store.
              </p>
            </div>

            <div className="bg-spacecraft-panel p-4 rounded border border-spacecraft-border flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-spacecraft-border pb-2">
                <span className="text-xs text-gray-400">COGNITIVE READINESS SCORE:</span>
                <span
                  className={`text-base font-bold ${
                    cognitiveScore >= 80
                      ? 'text-flight-nominal'
                      : cognitiveScore >= 60
                      ? 'text-flight-caution'
                      : 'text-flight-warning'
                  }`}
                >
                  {cognitiveScore} / 100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400">MEAN REACTION TIME:</span>
                  <div className="text-white font-bold text-sm">{avgRT} ms</div>
                </div>
                <div>
                  <span className="text-gray-400">ATTENTIONAL LAPSES:</span>
                  <div
                    className={`font-bold text-sm ${
                      lapsesCount > 2 ? 'text-flight-warning' : 'text-white'
                    }`}
                  >
                    {lapsesCount} lapses
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">FALSE STARTS:</span>
                  <div className="text-white font-bold text-sm">
                    {falseStartsCount}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">FLIGHT READINESS:</span>
                  <div
                    className={`font-bold text-sm ${
                      cognitiveScore >= 75
                        ? 'text-flight-nominal'
                        : 'text-flight-caution'
                    }`}
                  >
                    {cognitiveScore >= 75 ? 'GO FOR CRITICAL OPS' : 'RESTRICTED / FATIGUED'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={startPVTTest}
                className="px-4 py-2 bg-spacecraft-card hover:bg-spacecraft-border border border-spacecraft-border text-gray-200 rounded text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RE-TEST
              </button>
              <button
                onClick={handleSaveResult}
                className="px-5 py-2 bg-flight-nominal hover:bg-emerald-600 text-black font-bold rounded text-xs flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" /> APPLY TO TELEMETRY STREAM
              </button>
            </div>
          </div>
        )}
      </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return content;
}
