'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Post } from '@/types/post';
import { PLATFORMS } from '@/constants/platforms';
import { PlatformIcon } from './PlatformIcons';
import { formatLocalTime, formatLocalDateTime } from '@/utils/date';

interface PostCardProps {
  post: Post;
  onRetry: (postId: string) => void;
  onDelete: (postId: string) => void;
  onDuplicate: (post: Post) => void;
  onPreviewImage: (url: string, caption?: string) => void;
}

export function PostCard({ post, onRetry, onDelete, onDuplicate, onPreviewImage }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongContent = post.content.length > 220;
  const displayContent = isExpanded || !isLongContent ? post.content : `${post.content.slice(0, 220)}...`;

  const isRetrying = post.isRetrying || false;

  // Status badge styling
  const statusConfig = {
    scheduled: {
      label: isRetrying ? 'Retrying...' : 'Scheduled',
      bg: isRetrying
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-blue-50 border-blue-200/80 text-blue-700',
      icon: isRetrying ? (
        <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-blue-600" />
      ),
    },
    published: {
      label: 'Published',
      bg: 'bg-emerald-50 border-emerald-200/80 text-emerald-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    failed: {
      label: 'Failed',
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    },
  }[post.status];

  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all duration-200 shadow-xs hover:shadow-sm ${
        isRetrying
          ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300'
          : post.status === 'failed'
          ? 'bg-white border-rose-200 hover:border-rose-300'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top row: Status, Local Time, Platforms, and Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </span>

          {/* Scheduled Time in Local Timezone with UTC tooltip */}
          <div
            className="flex items-center gap-1 text-xs text-slate-700 font-mono bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60"
            title={`Local: ${formatLocalDateTime(post.scheduledAt)}\nUTC: ${post.scheduledAt}`}
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-900">{formatLocalTime(post.scheduledAt)}</span>
            <span className="text-[10px] text-slate-400">local</span>
          </div>
        </div>

        {/* Target Platform Badges */}
        <div className="flex items-center gap-1">
          {post.platforms.map((platformId) => {
            const config = PLATFORMS.find((p) => p.id === platformId);
            return (
              <span
                key={platformId}
                title={config?.name || platformId}
                className="p-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <PlatformIcon platform={platformId} size={13} />
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="py-3 flex flex-col md:flex-row gap-4 items-start">
        {/* Post Text */}
        <div className="flex-1 space-y-2">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
            {displayContent}
          </p>
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Read full post</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Media Thumbnail (if present) */}
        {post.mediaUrl && (
          <div
            onClick={() => onPreviewImage(post.mediaUrl!, post.content.slice(0, 60))}
            className="cursor-pointer relative shrink-0 w-28 h-20 sm:w-32 sm:h-22 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group/img hover:border-indigo-400 transition shadow-xs"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.mediaUrl}
              alt="Post attachment"
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
              onError={(e) => {
                // If broken image link, replace with fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
              <ExternalLink className="w-4 h-4" />
            </div>
            <span className="absolute bottom-1 right-1 p-0.5 rounded bg-slate-900/70 text-[9px] text-white">
              <ImageIcon className="w-2.5 h-2.5" />
            </span>
          </div>
        )}
      </div>

      {/* Error Message Banner for Failed Posts */}
      {post.status === 'failed' && post.errorMessage && (
        <div className="mt-1 mb-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-rose-900">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span>Delivery Failure Details:</span>
          </div>
          <p className="pl-5 text-rose-700 leading-relaxed font-mono text-[11px] break-words">
            {post.errorMessage}
          </p>
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-mono">
          ID: {post.id}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Retry Button (specifically for failed posts) */}
          {post.status === 'failed' && (
            <button
              onClick={() => onRetry(post.id)}
              disabled={isRetrying}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-xs transition-all shadow-xs active:scale-95 ${
                isRetrying
                  ? 'bg-amber-100 text-amber-800 cursor-wait'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying (1s)...' : 'Retry Post'}</span>
            </button>
          )}

          {/* Duplicate / Re-use in Composer */}
          <button
            onClick={() => onDuplicate(post)}
            title="Load into composer to duplicate or edit"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Duplicate post"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Action */}
          <button
            onClick={() => onDelete(post.id)}
            title="Remove post from scheduler"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            aria-label="Delete post"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
