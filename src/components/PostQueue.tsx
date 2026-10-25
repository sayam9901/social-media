'use client';

import React, { useMemo } from 'react';
import { Calendar, Inbox, SearchX } from 'lucide-react';
import { Post } from '@/types/post';
import { PostCard } from './PostCard';
import { getDayGroupKey } from '@/utils/date';

interface PostQueueProps {
  posts: Post[];
  isLoading: boolean;
  onRetry: (postId: string) => void;
  onDelete: (postId: string) => void;
  onDuplicate: (post: Post) => void;
  onPreviewImage: (url: string, caption?: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

interface DayGroup {
  key: string;
  label: string;
  order: number;
  isPast: boolean;
  posts: Post[];
}

export function PostQueue({
  posts,
  isLoading,
  onRetry,
  onDelete,
  onDuplicate,
  onPreviewImage,
  onClearFilters,
  hasActiveFilters,
}: PostQueueProps) {
  // Group and sort posts into Today, Tomorrow, and upcoming dates
  const groups: DayGroup[] = useMemo(() => {
    // Sort posts chronologically by scheduledAt
    const sorted = [...posts].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

    const map = new Map<string, DayGroup>();

    sorted.forEach((post) => {
      const groupInfo = getDayGroupKey(post.scheduledAt);
      if (!map.has(groupInfo.key)) {
        map.set(groupInfo.key, {
          key: groupInfo.key,
          label: groupInfo.label,
          order: groupInfo.order,
          isPast: groupInfo.isPast,
          posts: [],
        });
      }
      map.get(groupInfo.key)!.posts.push(post);
    });

    // Sort groups: Today (0), Tomorrow (1), Upcoming dates (2+), Past dates (-1, -2, etc. at end)
    const list = Array.from(map.values());
    list.sort((a, b) => {
      // Put non-past (Today, Tomorrow, Future) first, ordered ascending
      if (!a.isPast && !b.isPast) return a.order - b.order;
      if (!a.isPast && b.isPast) return -1;
      if (a.isPast && !b.isPast) return 1;
      // Both are past: order descending (most recent past first)
      return b.order - a.order;
    });

    return list;
  }, [posts]);

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map((g) => (
          <div key={g} className="space-y-3">
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3].map((c) => (
                <div key={c} className="h-32 bg-white border border-slate-200/80 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state: No posts match filters
  if (posts.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-white border border-slate-200/90 text-center flex flex-col items-center justify-center min-h-[320px] shadow-xs">
        {hasActiveFilters ? (
          <>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3">
              <SearchX className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No matching posts found</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              We couldn’t find any posts matching your selected platform, status, or search keywords.
            </p>
            <button
              onClick={onClearFilters}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs active:scale-95"
            >
              Reset All Filters
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Inbox className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Your Schedule Queue is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              Use the composer on the left to schedule posts across your social media channels.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const isToday = group.key === 'today';
        const isTomorrow = group.key === 'tomorrow';

        return (
          <section key={group.key} className="space-y-2.5">
            {/* Day Header */}
            <div className="flex items-center justify-between sticky top-16 z-20 py-2 bg-slate-50/90 backdrop-blur-md px-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-md border ${
                    isToday
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : isTomorrow
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : group.isPast
                      ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{group.label}</span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Today
                    </span>
                  )}
                  {isTomorrow && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Tomorrow
                    </span>
                  )}
                  {group.isPast && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-slate-100 text-slate-500 border border-slate-200">
                      Past
                    </span>
                  )}
                </h3>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            {/* List of cards in this day */}
            <div className="space-y-2.5">
              {group.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onRetry={onRetry}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onPreviewImage={onPreviewImage}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
