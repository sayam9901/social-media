'use client';

import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { Platform, PostStatus } from '@/types/post';
import { PLATFORMS } from '@/constants/platforms';
import { PlatformIcon } from './PlatformIcons';

interface FilterBarProps {
  search: string;
  platform: 'all' | Platform;
  status: 'all' | PostStatus;
  onSearchChange: (search: string) => void;
  onPlatformChange: (platform: 'all' | Platform) => void;
  onStatusChange: (status: 'all' | PostStatus) => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function FilterBar({
  search,
  platform,
  status,
  onSearchChange,
  onPlatformChange,
  onStatusChange,
  onClearFilters,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters = search.trim() !== '' || platform !== 'all' || status !== 'all';

  const statuses: { id: 'all' | PostStatus; label: string; countColor: string }[] = [
    { id: 'all', label: 'All Statuses', countColor: 'text-zinc-400' },
    { id: 'scheduled', label: 'Scheduled', countColor: 'text-indigo-400' },
    { id: 'published', label: 'Published', countColor: 'text-emerald-400' },
    { id: 'failed', label: 'Failed', countColor: 'text-rose-400' },
  ];

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
      {/* Search Bar + Active Filters Meta */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="filter-search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts by content text..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button & Filter Count */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-semibold">{filteredCount}</strong> of {totalCount} posts
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
              title="Reset search and filters"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors: Platform & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Platform Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Platform:
          </span>
          <button
            onClick={() => onPlatformChange('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              platform === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            All
          </button>
          {PLATFORMS.map((plat) => {
            const isSelected = platform === plat.id;
            return (
              <button
                key={plat.id}
                onClick={() => onPlatformChange(isSelected ? 'all' : plat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  isSelected
                    ? `${plat.badgeBg} ${plat.badgeBorder} ${plat.badgeText} shadow-xs`
                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PlatformIcon platform={plat.id} size={13} />
                <span>{plat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Status:</span>
          {statuses.map((st) => {
            const isSelected = status === st.id;
            return (
              <button
                key={st.id}
                onClick={() => onStatusChange(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
