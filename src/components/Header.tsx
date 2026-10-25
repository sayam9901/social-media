'use client';

import React, { useState, useEffect } from 'react';
import { CalendarClock, RotateCcw, Globe, Clock, Sparkles } from 'lucide-react';
import { getUserTimeZone, getTimeZoneOffsetString } from '@/utils/date';

interface HeaderProps {
  totalCount?: number;
  scheduledCount?: number;
  failedCount?: number;
  onResetData: () => void;
  onOpenMobileComposer?: () => void;
}

export function Header({ onResetData, onOpenMobileComposer }: HeaderProps) {
  const [timeZone] = useState(() => (typeof window !== 'undefined' ? getUserTimeZone() : 'UTC'));
  const [offsetStr] = useState(() => (typeof window !== 'undefined' ? getTimeZoneOffsetString() : ''));
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [utcTimeStr, setUtcTimeStr] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setUtcTimeStr(now.toISOString().slice(11, 19) + ' UTC');
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                OmniSchedule
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                  Workspace
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Social media scheduler & unified broadcast queue</p>
          </div>
        </div>

        {/* Timezone & Clock Bar */}
        <div className="hidden lg:flex items-center gap-3.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium text-slate-900">{timeZone}</span>
            <span className="text-slate-400 font-mono">({offsetStr})</span>
            <span className="text-slate-600 font-mono pl-1">{currentTimeStr}</span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{utcTimeStr}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            title="Reset to 32 initial demo posts"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Mock Data</span>
          </button>

          {onOpenMobileComposer && (
            <button
              onClick={onOpenMobileComposer}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
