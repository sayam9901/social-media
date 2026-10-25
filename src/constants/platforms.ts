import { Platform, PlatformConfig } from '@/types/post';

export const PLATFORM_LIMITS: Record<Platform, number> = {
  x: 280,
  instagram: 2200,
  tiktok: 2200,
  facebook: 5000,
};

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'x',
    name: 'X (Twitter)',
    charLimit: 280,
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-900',
    badgeText: 'text-white',
    brandColor: '#0f172a',
    hoverGlow: 'hover:border-slate-700',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    charLimit: 2200,
    badgeBg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500',
    badgeBorder: 'border-transparent',
    badgeText: 'text-white',
    brandColor: '#E1306C',
    hoverGlow: 'hover:opacity-95',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    charLimit: 2200,
    badgeBg: 'bg-slate-900',
    badgeBorder: 'border-slate-900',
    badgeText: 'text-white',
    brandColor: '#00F2FE',
    hoverGlow: 'hover:border-slate-700',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    charLimit: 5000,
    badgeBg: 'bg-blue-600',
    badgeBorder: 'border-blue-600',
    badgeText: 'text-white',
    brandColor: '#1877F2',
    hoverGlow: 'hover:bg-blue-700',
  },
];

export const SAMPLE_IMAGES = [
  { label: '🚀 Product Launch', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: '☕ Office Coffee', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80' },
  { label: '💻 Tech Workspace', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
  { label: '📈 Analytics Growth', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: '🎨 Design UI/UX', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' },
  { label: '🌿 Nature Scenic', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80' },
];
