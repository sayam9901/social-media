export type Platform = 'facebook' | 'instagram' | 'x' | 'tiktok';

export type PostStatus = 'scheduled' | 'published' | 'failed';

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  mediaUrl?: string;
  scheduledAt: string; // ISO 8601 string in UTC (e.g. "2026-10-26T14:30:00.000Z")
  status: PostStatus;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
  // Transient state for optimistic UI updates
  isRetrying?: boolean;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  charLimit: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  brandColor: string;
  hoverGlow: string;
}

export interface PostFilters {
  search: string;
  platform: Platform | 'all';
  status: PostStatus | 'all';
}
