import { Post } from '@/types/post';

/**
 * Creates at least 32 rich, realistic mock posts.
 * Times are dynamically generated relative to current runtime so that reviewers
 * always see posts grouped under "Today", "Tomorrow", and upcoming future dates.
 */
export function generateInitialPosts(): Post[] {
  const now = new Date();

  // Helper to get ISO UTC string for offsets in hours from now
  const getOffsetIso = (hoursOffset: number, setMinute?: number): string => {
    const d = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
    if (setMinute !== undefined) {
      d.setMinutes(setMinute);
      d.setSeconds(0);
      d.setMilliseconds(0);
    }
    return d.toISOString();
  };

  // Helper to get local day offset at specific hour and minute
  const getDayOffsetIso = (dayOffset: number, localHour: number, localMinute: number): string => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, localHour, localMinute, 0);
    return d.toISOString();
  };

  return [
    // ================= TODAY (Scheduled, Published, Failed) =================
    {
      id: 'post-1',
      content: '🚀 Product Launch Announcement! We are thrilled to officially unveil V3 of our platform. Faster processing, sleek new UI, and AI-powered workflows. Check out the link in bio!',
      platforms: ['x', 'instagram', 'facebook', 'tiktok'],
      mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getOffsetIso(2, 30), // Scheduled in 2.5 hours today
      status: 'scheduled',
      createdAt: getOffsetIso(-10),
    },
    {
      id: 'post-2',
      content: 'Quick tech poll: What is your go-to state management tool in 2026? Drop your thoughts below 👇 #webdev #frontend #typescript',
      platforms: ['x'],
      scheduledAt: getOffsetIso(4, 0), // Scheduled today in 4 hours
      status: 'scheduled',
      createdAt: getOffsetIso(-5),
    },
    {
      id: 'post-3',
      content: 'Behind the scenes at today’s engineering sprint planning! Whiteboards filled, coffee brewed, and high energy all around ☕💻',
      platforms: ['instagram', 'tiktok'],
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getOffsetIso(5, 45), // Scheduled today in ~6 hours
      status: 'scheduled',
      createdAt: getOffsetIso(-3),
    },
    {
      id: 'post-4',
      content: 'Good morning founders! Reminder: focus on what makes the boat go faster today. Prioritize shipping value over perfecting things nobody asked for.',
      platforms: ['x', 'facebook'],
      scheduledAt: getOffsetIso(-3, 0), // 3 hours ago today
      status: 'published',
      createdAt: getOffsetIso(-12),
    },
    {
      id: 'post-5',
      content: 'Customer spotlight: How Acme Corp scaled their conversion rate by 180% using automated funnel analytics. Full case study published on our blog!',
      platforms: ['facebook'],
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getOffsetIso(-1, 15), // 1 hour ago today
      status: 'failed',
      errorMessage: 'OAuth token expired for Facebook Business Page. Please re-authenticate your meta account permissions.',
      createdAt: getOffsetIso(-8),
    },
    {
      id: 'post-6',
      content: 'Evening community stream starting in 30 mins! Join our core developers answering your architectural questions live on Discord and YouTube.',
      platforms: ['x', 'tiktok'],
      scheduledAt: getOffsetIso(7, 15), // Tonight
      status: 'scheduled',
      createdAt: getOffsetIso(-2),
    },

    // ================= TOMORROW (Scheduled, Failed) =================
    {
      id: 'post-7',
      content: '5 tips for writing clean, maintainable React components:\n1. Keep components small\n2. Extract custom hooks\n3. Prefer composition over props drilling\n4. Type everything strictly\n5. Test user interactions',
      platforms: ['x', 'facebook', 'instagram'],
      scheduledAt: getDayOffsetIso(1, 9, 0), // Tomorrow 9:00 AM
      status: 'scheduled',
      createdAt: getOffsetIso(-1),
    },
    {
      id: 'post-8',
      content: 'Coffee break vibes ☕ What music playlist is keeping you focused this week? Share your spotify links in comments!',
      platforms: ['instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(1, 11, 30), // Tomorrow 11:30 AM
      status: 'scheduled',
      createdAt: getOffsetIso(-2),
    },
    {
      id: 'post-9',
      content: 'Weekly Q&A: Addressing the top 3 questions submitted by our beta testers this week regarding security, offline caching, and webhook reliability.',
      platforms: ['facebook', 'x'],
      scheduledAt: getDayOffsetIso(1, 14, 0), // Tomorrow 2:00 PM
      status: 'scheduled',
      createdAt: getOffsetIso(-4),
    },
    {
      id: 'post-10',
      content: 'Aesthetic desk setups: Minimalist wood desk, dual monitor arm, mechanical keyboard with Gateron Oil Kings. Rate this setup 1-10! ✨',
      platforms: ['tiktok', 'instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(1, 16, 45), // Tomorrow 4:45 PM
      status: 'scheduled',
      createdAt: getOffsetIso(-5),
    },
    {
      id: 'post-11',
      content: 'Flash reminder: Scheduled infrastructure maintenance window begins at midnight UTC. Read-only mode will be active for approximately 25 minutes.',
      platforms: ['x'],
      scheduledAt: getDayOffsetIso(1, 20, 0), // Tomorrow 8:00 PM
      status: 'scheduled',
      createdAt: getOffsetIso(-6),
    },

    // ================= DAY +2 =================
    {
      id: 'post-12',
      content: 'Deep Dive: Understanding WebSockets vs Server-Sent Events (SSE) for modern real-time dashboards. Which do you prefer and why?',
      platforms: ['x', 'facebook'],
      scheduledAt: getDayOffsetIso(2, 10, 15),
      status: 'scheduled',
      createdAt: getOffsetIso(-12),
    },
    {
      id: 'post-13',
      content: 'Fresh autumn views from our remote team working across Switzerland, Japan, and Canada. Nature is the best creative reboot 🌲🏔️',
      platforms: ['instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(2, 13, 0),
      status: 'scheduled',
      createdAt: getOffsetIso(-14),
    },
    {
      id: 'post-14',
      content: 'Short tutorial reel: How to optimize Core Web Vitals (LCP & CLS) under 60 seconds with modern image loading strategies!',
      platforms: ['tiktok'],
      scheduledAt: getDayOffsetIso(2, 17, 30),
      status: 'failed',
      errorMessage: 'TikTok Content API: Video file dimension must meet 9:16 vertical ratio. Upload rejected.',
      createdAt: getOffsetIso(-15),
    },

    // ================= DAY +3 =================
    {
      id: 'post-15',
      content: 'Big milestone alert: We just surpassed 100,000 active monthly users! Huge thank you to our incredible community and contributors. Here is to the next 100k 🥂🎉',
      platforms: ['x', 'instagram', 'facebook', 'tiktok'],
      mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(3, 11, 0),
      status: 'scheduled',
      createdAt: getOffsetIso(-20),
    },
    {
      id: 'post-16',
      content: 'Open Source Friday: Check out our top 3 open-source libraries updated this week. Pull requests and feedback are always welcomed on GitHub!',
      platforms: ['x'],
      scheduledAt: getDayOffsetIso(3, 15, 30),
      status: 'scheduled',
      createdAt: getOffsetIso(-22),
    },

    // ================= DAY +4 =================
    {
      id: 'post-17',
      content: 'Weekend read: The architecture behind sub-millisecond query caching in distributed databases. Link to technical whitepaper in thread.',
      platforms: ['x', 'facebook'],
      scheduledAt: getDayOffsetIso(4, 9, 45),
      status: 'scheduled',
      createdAt: getOffsetIso(-24),
    },
    {
      id: 'post-18',
      content: 'Design inspirations: Clean micro-interactions that make enterprise software feel delightful rather than clunky. Swipe through to view 📱✨',
      platforms: ['instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(4, 14, 15),
      status: 'scheduled',
      createdAt: getOffsetIso(-25),
    },

    // ================= DAY +5 =================
    {
      id: 'post-19',
      content: 'Monday motivation: "Simplicity is prerequisite for reliability." - Edsger W. Dijkstra. Have a productive week of building!',
      platforms: ['x', 'facebook'],
      scheduledAt: getDayOffsetIso(5, 8, 30),
      status: 'scheduled',
      createdAt: getOffsetIso(-30),
    },
    {
      id: 'post-20',
      content: 'TikTok challenge: Show us your most chaotic commit message without telling us what went wrong 😂 Tag us to get featured!',
      platforms: ['tiktok'],
      scheduledAt: getDayOffsetIso(5, 18, 0),
      status: 'scheduled',
      createdAt: getOffsetIso(-32),
    },

    // ================= DAY +6 & +7 =================
    {
      id: 'post-21',
      content: 'Announcing our upcoming webinar on Next-Gen Frontend Frameworks with industry leaders. RSVP link in bio for early bird access!',
      platforms: ['facebook', 'x', 'instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(6, 12, 0),
      status: 'scheduled',
      createdAt: getOffsetIso(-35),
    },
    {
      id: 'post-22',
      content: 'Tips for remote developers: Ergonomics, blue light filters, and the 20-20-20 rule to keep eye strain at bay during long debugging sessions.',
      platforms: ['x'],
      scheduledAt: getDayOffsetIso(7, 10, 0),
      status: 'scheduled',
      createdAt: getOffsetIso(-40),
    },
    {
      id: 'post-23',
      content: 'Creator spotlight: Meet Sarah, UX designer crafting futuristic design systems that scale effortlessly. Link to full interview in bio!',
      platforms: ['instagram', 'tiktok'],
      mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(7, 16, 30),
      status: 'scheduled',
      createdAt: getOffsetIso(-42),
    },

    // ================= PAST POSTS (Published & Failed) =================
    {
      id: 'post-24',
      content: 'Yesterday’s release notes for v2.9.4: Patching memory leak in chart canvas renderer and improving load times by 22%.',
      platforms: ['x'],
      scheduledAt: getDayOffsetIso(-1, 16, 0),
      status: 'published',
      createdAt: getOffsetIso(-30),
    },
    {
      id: 'post-25',
      content: 'Sunday coffee & code sessions. What side projects are you tinkering with this weekend?',
      platforms: ['instagram'],
      mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(-1, 10, 0),
      status: 'published',
      createdAt: getOffsetIso(-35),
    },
    {
      id: 'post-26',
      content: 'Live product demo stream rescheduled due to audio driver crash during soundcheck. Apologies for the inconvenience!',
      platforms: ['x', 'facebook'],
      scheduledAt: getDayOffsetIso(-2, 14, 0),
      status: 'failed',
      errorMessage: 'X API rate limit (429): Endpoint exceeded 300 requests / 15 minutes window.',
      createdAt: getOffsetIso(-55),
    },
    {
      id: 'post-27',
      content: 'Celebrating our amazing Customer Success team who answered 450+ tickets with 99.4% satisfaction score this week! 👏',
      platforms: ['facebook'],
      mediaUrl: 'https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(-3, 11, 30),
      status: 'published',
      createdAt: getOffsetIso(-75),
    },
    {
      id: 'post-28',
      content: 'Quick tip: You do not need a third-party library for deep cloning in modern JS. structuredClone() is supported across all major browsers!',
      platforms: ['x', 'facebook'],
      scheduledAt: getDayOffsetIso(-3, 15, 0),
      status: 'published',
      createdAt: getOffsetIso(-78),
    },
    {
      id: 'post-29',
      content: 'TikTok audio sync failed: Background sound track copyright match blocked international distribution.',
      platforms: ['tiktok'],
      scheduledAt: getDayOffsetIso(-4, 18, 0),
      status: 'failed',
      errorMessage: 'TikTok Copyright Claim: Audio track "Summer Wave #12" is licensed only for personal accounts, not commercial profiles.',
      createdAt: getOffsetIso(-99),
    },
    {
      id: 'post-30',
      content: 'Infographic: The evolution of CSS from table layouts to Flexbox, Grid, and Subgrid. Visual timeline in slides.',
      platforms: ['instagram', 'facebook'],
      mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(-5, 12, 15),
      status: 'published',
      createdAt: getOffsetIso(-120),
    },
    {
      id: 'post-31',
      content: 'Why we migrated our data pipeline to Rust: 6x reduced CPU usage and zero memory crashes over 6 months of heavy production load.',
      platforms: ['x'],
      scheduledAt: getDayOffsetIso(-6, 9, 30),
      status: 'published',
      createdAt: getOffsetIso(-145),
    },
    {
      id: 'post-32',
      content: 'Quarterly Town Hall recap: Vision for Q4, new expansion markets, and welcoming 12 new colleagues across 4 departments! 🌟',
      platforms: ['facebook', 'instagram', 'x'],
      mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      scheduledAt: getDayOffsetIso(-7, 16, 0),
      status: 'published',
      createdAt: getOffsetIso(-170),
    },
  ];
}
