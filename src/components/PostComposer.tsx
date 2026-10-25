'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  X as XIcon,
  Clock,
  Globe,
} from 'lucide-react';
import { Platform, Post } from '@/types/post';
import { PLATFORMS, PLATFORM_LIMITS, SAMPLE_IMAGES } from '@/constants/platforms';
import { PlatformIcon } from './PlatformIcons';
import {
  getUserTimeZone,
  getTimeZoneOffsetString,
  toDatetimeLocalInputString,
  localInputToUtcIso,
} from '@/utils/date';

interface PostComposerProps {
  onSchedulePost: (newPost: Omit<Post, 'id' | 'createdAt'>) => void;
  initialValues?: Partial<Post> | null;
  onClearInitialValues?: () => void;
}

export function PostComposer({ onSchedulePost, initialValues, onClearInitialValues }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['x', 'instagram']);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timezone display
  const [userTz] = useState(() => (typeof window !== 'undefined' ? getUserTimeZone() : 'UTC'));
  const [tzOffset] = useState(() => (typeof window !== 'undefined' ? getTimeZoneOffsetString() : ''));

  // Initialize default future time (+2 hours from now)
  const [localScheduledAt, setLocalScheduledAt] = useState(() => {
    const defaultDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    defaultDate.setMinutes(Math.ceil(defaultDate.getMinutes() / 15) * 15);
    defaultDate.setSeconds(0);
    return toDatetimeLocalInputString(defaultDate);
  });

  const [minDate] = useState(() => toDatetimeLocalInputString(new Date(Date.now() + 60000)));

  // Handle populated values if user duplicated or edited a post
  useEffect(() => {
    if (!initialValues) return;
    const frame = requestAnimationFrame(() => {
      if (initialValues.content) setContent(initialValues.content);
      if (initialValues.platforms && initialValues.platforms.length > 0) {
        setSelectedPlatforms(initialValues.platforms);
      }
      if (initialValues.mediaUrl) setMediaUrl(initialValues.mediaUrl);
      if (initialValues.scheduledAt) {
        try {
          const d = new Date(initialValues.scheduledAt);
          if (!isNaN(d.getTime())) {
            const targetDate = d.getTime() > Date.now() ? d : new Date(Date.now() + 2 * 60 * 60 * 1000);
            setLocalScheduledAt(toDatetimeLocalInputString(targetDate));
          }
        } catch {
          // ignore
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [initialValues, setLocalScheduledAt]);

  // Toggle platform selection
  const togglePlatform = (platformId: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  // Date validation
  const validateScheduledDate = (inputVal: string): boolean => {
    if (!inputVal) {
      setDateError('Please specify a scheduled time.');
      return false;
    }
    const targetDate = new Date(inputVal);
    if (isNaN(targetDate.getTime())) {
      setDateError('Invalid date format.');
      return false;
    }
    if (targetDate.getTime() <= Date.now()) {
      setDateError('Scheduled time must be in the future (at least 1 minute ahead).');
      return false;
    }
    setDateError(null);
    return true;
  };

  const handleDateChange = (val: string) => {
    setLocalScheduledAt(val);
    validateScheduledDate(val);
  };

  // Preset quick times
  const applyPresetTime = (hoursFromNow: number, specificHour?: number) => {
    const now = new Date();
    let target: Date;
    if (specificHour !== undefined) {
      // e.g. Tomorrow at 10 AM
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, specificHour, 0, 0);
    } else {
      target = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
    }
    const formatted = toDatetimeLocalInputString(target);
    setLocalScheduledAt(formatted);
    validateScheduledDate(formatted);
  };

  // Character limit calculations
  const contentLength = content.length;

  // Determine if any selected platform is over its limit
  const platformExceeded = selectedPlatforms.some((platform) => {
    const limit = PLATFORM_LIMITS[platform];
    return contentLength > limit;
  });

  const isFormValid =
    content.trim().length > 0 &&
    selectedPlatforms.length > 0 &&
    !platformExceeded &&
    localScheduledAt !== '' &&
    !dateError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateScheduledDate(localScheduledAt)) return;
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // Store in UTC ISO string
      const utcIso = localInputToUtcIso(localScheduledAt);

      onSchedulePost({
        content: content.trim(),
        platforms: selectedPlatforms,
        mediaUrl: mediaUrl.trim() ? mediaUrl.trim() : undefined,
        scheduledAt: utcIso,
        status: 'scheduled',
      });

      // Reset form
      setContent('');
      setMediaUrl('');
      if (onClearInitialValues) onClearInitialValues();

      // Reset to +2 hours
      const nextDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
      nextDate.setMinutes(Math.ceil(nextDate.getMinutes() / 15) * 15);
      setLocalScheduledAt(toDatetimeLocalInputString(nextDate));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Send className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Create & Schedule Post</h2>
        </div>
        {initialValues && (
          <button
            onClick={() => {
              setContent('');
              setMediaUrl('');
              if (onClearInitialValues) onClearInitialValues();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition"
          >
            Clear Draft
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Target Channels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PLATFORMS.map((plat) => {
              const isSelected = selectedPlatforms.includes(plat.id);
              const limit = PLATFORM_LIMITS[plat.id];
              const isOver = contentLength > limit;

              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => togglePlatform(plat.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all relative ${
                    isSelected
                      ? isOver
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs ring-1 ring-rose-400'
                        : `${plat.badgeBg} ${plat.badgeBorder} ${plat.badgeText} shadow-xs ring-1 ring-slate-900/10`
                      : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <PlatformIcon platform={plat.id} size={14} />
                    <span className="font-semibold">{plat.name}</span>
                  </div>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'opacity-85' : 'text-slate-400'}`}>
                    Max {limit.toLocaleString()}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedPlatforms.length === 0 && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Please select at least one social media channel.
            </p>
          )}
        </div>

        {/* Post Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="post-content" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Post Content
            </label>
            <span className="text-xs text-slate-400">Emojis & links supported</span>
          </div>
          <textarea
            id="post-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what's on your mind, share updates, announcements, or thoughts..."
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition resize-y min-h-[110px]"
          />
        </div>

        {/* Live Character Counters for Each Selected Platform */}
        {selectedPlatforms.length > 0 && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-200/80 pb-1.5">
              <span className="font-semibold text-slate-800">Platform Character Limits:</span>
              <span className="text-[11px] text-slate-400">Live network verification</span>
            </div>

            <div className="space-y-2">
              {selectedPlatforms.map((platformId) => {
                const config = PLATFORMS.find((p) => p.id === platformId)!;
                const limit = PLATFORM_LIMITS[platformId];
                const remaining = limit - contentLength;
                const percent = Math.min(100, Math.round((contentLength / limit) * 100));
                const isOver = remaining < 0;
                const isNear = remaining >= 0 && remaining <= limit * 0.15; // Within 15% of limit

                return (
                  <div key={platformId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <PlatformIcon platform={platformId} size={13} className="text-slate-600" />
                        <span className="font-medium text-slate-700">{config.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span
                          className={`font-semibold ${
                            isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-600'
                          }`}
                        >
                          {contentLength.toLocaleString()} / {limit.toLocaleString()}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isOver
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : isNear
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isOver ? `+${Math.abs(remaining)} over` : `${remaining} left`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 rounded-full ${
                          isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {platformExceeded && (
              <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>One or more platforms exceed character limit. Please shorten post text.</span>
              </div>
            )}
          </div>
        )}

        {/* Media URL (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="media-url-input" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              Optional Media URL
            </label>
            <button
              type="button"
              onClick={() => setShowImageDropdown(!showImageDropdown)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {showImageDropdown ? 'Hide Samples' : 'Quick Samples'}
            </button>
          </div>

          <div className="relative">
            <input
              id="media-url-input"
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition pr-8"
            />
            {mediaUrl && (
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Remove image URL"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Preset Samples */}
          {showImageDropdown && (
            <div className="mt-1.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-md grid grid-cols-2 gap-1 text-xs z-10 relative">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMediaUrl(sample.url);
                    setShowImageDropdown(false);
                  }}
                  className="px-2 py-1.5 text-left rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900 truncate transition"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}

          {/* Image preview thumbnail */}
          {mediaUrl && (
            <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 max-h-32 bg-slate-100 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl}
                alt="Preview attachment"
                className="max-h-32 w-auto object-cover rounded-md"
                onError={() => {
                  // Fallback if broken image URL
                }}
              />
              <span className="absolute bottom-1 right-2 text-[10px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                Preview Thumbnail
              </span>
            </div>
          )}
        </div>

        {/* Date-Time Picker */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="scheduled-time-input" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Schedule Date & Time
            </label>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>{userTz} ({tzOffset})</span>
            </div>
          </div>

          <div className="relative">
            <input
              id="scheduled-time-input"
              type="datetime-local"
              value={localScheduledAt}
              min={minDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition font-mono"
            />
          </div>

          {/* Quick preset time shortcuts */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Quick:
            </span>
            <button
              type="button"
              onClick={() => applyPresetTime(0.5)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 text-[11px] transition"
            >
              +30m
            </button>
            <button
              type="button"
              onClick={() => applyPresetTime(2)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 text-[11px] transition"
            >
              +2 hours
            </button>
            <button
              type="button"
              onClick={() => applyPresetTime(0, 10)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 text-[11px] transition"
            >
              Tomorrow 10:00 AM
            </button>
            <button
              type="button"
              onClick={() => applyPresetTime(0, 18)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 text-[11px] transition"
            >
              Tomorrow 6:00 PM
            </button>
          </div>

          {dateError && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {dateError}
            </p>
          )}

          <p className="text-[11px] text-slate-400 mt-1.5">
            Times shown in your local timezone ({userTz}); automatically stored in UTC.
          </p>
        </div>

        {/* Schedule Button */}
        <button
          id="schedule-post-submit-btn"
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all duration-150 ${
            isFormValid && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-[0.99]'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Scheduling Post...' : 'Schedule Post for Channels'}</span>
        </button>
      </form>
    </div>
  );
}
