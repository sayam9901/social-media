'use client';

import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Post, Platform } from '@/types/post';

interface StatsBarProps {
  posts: Post[];
  activeStatus: string;
  activePlatform?: string;
  onSelectStatus: (status: 'all' | 'scheduled' | 'published' | 'failed') => void;
  onSelectPlatform?: (platform: 'all' | Platform) => void;
}

export function StatsBar({ posts, activeStatus, onSelectStatus }: StatsBarProps) {
  const total = posts.length;
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;
  const failed = posts.filter((p) => p.status === 'failed').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Posts */}
      <div
        onClick={() => onSelectStatus('all')}
        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
          activeStatus === 'all'
            ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-sm'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Total Posts</span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{total}</span>
          <span className="text-xs text-slate-500">in queue</span>
        </div>
      </div>

      {/* Scheduled */}
      <div
        onClick={() => onSelectStatus('scheduled')}
        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
          activeStatus === 'scheduled'
            ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600 shadow-sm'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-700">Scheduled</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{scheduled}</span>
          <span className="text-xs text-indigo-600/80">queued up</span>
        </div>
      </div>

      {/* Published */}
      <div
        onClick={() => onSelectStatus('published')}
        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
          activeStatus === 'published'
            ? 'bg-emerald-50/60 border-emerald-600 ring-1 ring-emerald-600 shadow-sm'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-700">Published</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{published}</span>
          <span className="text-xs text-emerald-600/80">broadcasted</span>
        </div>
      </div>

      {/* Failed */}
      <div
        onClick={() => onSelectStatus('failed')}
        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
          activeStatus === 'failed'
            ? 'bg-rose-50/60 border-rose-600 ring-1 ring-rose-600 shadow-sm'
            : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-700">Failed / Retry</span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{failed}</span>
          <span className="text-xs text-rose-600/80">needs action</span>
        </div>
      </div>
    </div>
  );
}
