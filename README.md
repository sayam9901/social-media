# OmniSchedule — Social Media Post Scheduler & Queue

A modern, responsive social media post management and scheduling dashboard built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Users can compose posts for multiple channels (**Facebook, Instagram, X/Twitter, TikTok**), inspect live platform-specific character limits, schedule them into a chronologically grouped queue, filter and search with URL query persistence, and retry failed posts with optimistic UI updates and rollback handling.

---

## 🌟 Live Demo & Submission

- **Live Deployment**: `https://your-deployment-url.vercel.app` *(Replace with your deployed URL)*
- **Repository**: Created locally in `social-media-scheduler`
- **Submission Recipient**: `bhanu@flintzy.com`

---

## 🚀 Key Features & Requirements Coverage

### 1. Mock Data (32+ Realistic Posts)
- Pre-populated with **32 rich mock posts** spanning:
  - **Today** (both upcoming scheduled posts and earlier published/failed posts)
  - **Tomorrow** (scheduled posts at various hours)
  - **Upcoming Dates** (Day +2, Day +3, Day +5, etc.)
  - **Past Archive** (published posts and failed posts with realistic error messages)
- Each post conforms to the schema:
  - `id`: Unique identifier (e.g. `post-1`)
  - `content`: Realistic post copy with hashtags, emojis, and links
  - `platforms`: Array of target channels (`'facebook' | 'instagram' | 'x' | 'tiktok'`)
  - `mediaUrl`: Optional high-resolution image attachment
  - `scheduledAt`: ISO 8601 UTC timestamp (e.g. `2026-10-26T14:30:00.000Z`)
  - `status`: `'scheduled' | 'published' | 'failed'`
  - `errorMessage`: Detailed technical failure reason for failed posts
- **LocalStorage Persistence**: New posts, retries, and deletions persist across page reloads. A **"Reset Mock Data"** button in the header allows restoring the default 32 posts anytime.

### 2. Day-Grouped Queue (Today, Tomorrow, Calendar Dates)
- Posts are automatically grouped by calendar day using the user's local timezone:
  - **Today**: Current local day
  - **Tomorrow**: Next local day
  - **Calendar Dates**: Formatted as e.g. `Wednesday, Oct 28, 2026`
  - **Past Archive**: Chronologically sorted historical posts
- Each card displays:
  - Platform brand icons with distinct colored badges
  - Scheduled time converted to the user's local timezone (with UTC timestamp available on hover)
  - Status pill (`Scheduled`, `Published`, `Failed`)
  - Content preview with expandable "Read full post" for long copy
  - Clickable media thumbnail opening a full-resolution modal preview
  - Delivery failure alert banner showing exact error details on failed posts

### 3. Filter & Search with URL Query Params Sync
- Filter by **Platform**: All, X (Twitter), Instagram, TikTok, Facebook
- Filter by **Status**: All, Scheduled, Published, Failed
- **Live Search**: Instant keyword filtering across post content and post IDs
- **URL Query Parameters**: Active filters are bidirectionally synchronized with URL query params (`?platform=x&status=failed&search=product`).
  - Refreshing or sharing the URL preserves the exact filtered view!
  - "Clear filters" button quickly resets the view.

### 4. Post Composer & Live Character Counters
- Multi-channel selector allowing any combination of Facebook, Instagram, X, and TikTok.
- **Strict Live Character Counters** enforced per platform:
  - **X (Twitter)**: `280` characters
  - **Instagram**: `2,200` characters
  - **TikTok**: `2,200` characters
  - **Facebook**: `5,000` characters
- Dynamic color-coded feedback:
  - Under limit: Normal / Indigo progress indicator
  - Approaching limit (last 15%): Amber warning indicator
  - Over limit: Bright red indicator displaying exact count over limit (e.g. `+12 over`)
- **Submission Guard**: Scheduling is strictly disabled if **any** selected platform exceeds its limit, if no platform is selected, or if content is empty.
- Optional media URL with live thumbnail preview and quick one-click sample presets (Product Launch, Tech Desk, Coffee, etc.).

### 5. Future Date Validation & Local Timezone vs UTC Storage
- Native `datetime-local` input with minimum date constrained to current time + 1 minute.
- Quick preset buttons: `+30m`, `+2 hours`, `Tomorrow 10:00 AM`, `Tomorrow 6:00 PM`.
- Clear user guidance showing detected local timezone (e.g. `Asia/Kolkata (GMT+5:30)`).
- Strict validation ensuring scheduled time is in the future.
- Stored internally in standardized **UTC ISO string** (`new Date(input).toISOString()`) and formatted for display in the user's local timezone.

### 6. Optimistic Retry with Rollback (20% Simulated Failure)
- Failed posts include a prominent **"Retry Post"** action.
- **Optimistic UI Update**: The post status immediately switches to `scheduled` with a spinning indicator and an informative toast notification.
- Simulates an asynchronous API broadcast with a **1-second delay** (`setTimeout`).
- **20% Failure Simulation**:
  - `80% of attempts succeed`: Status is confirmed as `scheduled`, `errorMessage` is cleared, and a success toast is displayed.
  - `20% of attempts fail`: Post status is immediately rolled back to `failed`, an updated error message is set, and a failure toast is displayed explaining the rollback.

### 7. Loading, Empty, and Error States & Responsive Design
- **Loading State**: Animated skeleton cards with shimmer pulse while posts load.
- **Empty States**:
  - Filter empty state: Friendly illustration and "Reset All Filters" CTA when no posts match criteria.
  - Queue empty state: Guide to compose the first post.
- **Responsive Layout**:
  - **Desktop**: 2-column layout with sticky Composer on the left and interactive Queue on the right.
  - **Mobile**: Responsive tab switcher between "Schedule Queue" and "Compose Post", optimized touch targets.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework with React Server Components, Suspense, and Turbopack |
| **React 19** | Component architecture, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) |
| **TypeScript** | Strict type safety for Post, Platform, Status, and API contracts |
| **Tailwind CSS v4** | Modern dark-themed styling, glassmorphism, responsive grid |
| **Lucide React** | Clean, accessible icons |

### Directory Structure

```
social-media-scheduler/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS theme & custom utilities
│   │   ├── layout.tsx           # SEO metadata, font definitions, dark layout
│   │   └── page.tsx             # Main dashboard assembling components with Suspense
│   ├── components/
│   │   ├── FilterBar.tsx        # Search & platform/status filter pills with URL sync
│   │   ├── Header.tsx           # Brand header, live timezone clock, reset data button
│   │   ├── ImagePreviewModal.tsx# Lightbox modal for post media attachments
│   │   ├── PlatformIcons.tsx    # Crisp SVG brand icons (X, Instagram, TikTok, Facebook)
│   │   ├── PostCard.tsx         # Post card with preview, local time, badges & retry
│   │   ├── PostComposer.tsx     # Post composer, live character counters & date picker
│   │   ├── PostQueue.tsx        # Day-grouped feed (Today, Tomorrow, Dates) & skeletons
│   │   ├── StatsBar.tsx         # Metric summary cards (Total, Scheduled, Published, Failed)
│   │   └── Toast.tsx            # Floating feedback notifications for actions & retries
│   ├── constants/
│   │   └── platforms.ts         # Character limits, brand colors, sample media presets
│   ├── mock/
│   │   └── initialPosts.ts      # Dynamic generator for 32+ realistic initial mock posts
│   ├── services/
│   │   └── storage.ts           # LocalStorage wrapper & 1s 20%-failure retry simulation
│   ├── types/
│   │   └── post.ts              # TypeScript interfaces for Post, Platform, Filter
│   └── utils/
│       └── date.ts              # Day grouping (Today/Tomorrow), UTC/Local formatting
├── public/                      # Static assets & favicons
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation & run guide
```

---

## 📋 Key Architectural Decisions & Assumptions

1. **Relative Mock Generation vs Static Dates**:
   - Rather than hardcoding fixed dates in 2024 or 2025 (which would immediately become outdated), `generateInitialPosts()` generates mock timestamps relative to `Date.now()`.
   - This guarantees that whenever any evaluator opens the project (today, tomorrow, or in the future), there will always be posts populated in **"Today"**, **"Tomorrow"**, and upcoming dates!

2. **Optimistic UI with State Snapshot**:
   - When retrying a failed post, we preserve a snapshot of the previous post state. We immediately transition the UI to `scheduled` (with `isRetrying: true` pulse effect) to give the user instant feedback.
   - If the simulated network request fails (20% random chance), we restore the previous snapshot with the error response and alert the user via toast notification.

3. **URL State Synchronization**:
   - `searchParams` are read via Next.js `useSearchParams()` inside a `<Suspense>` boundary.
   - Any modification to search text, selected platform, or status calls `window.history.replaceState()`, keeping the browser URL in sync without triggering unnecessary page reloads.

4. **Timezone Handling**:
   - Post scheduling dates are stored as standard UTC strings (`toISOString()`).
   - All presentation is converted to the user's detected local timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), ensuring seamless internationalization.

5. **Live Character Limit Enforcement**:
   - Limits are verified per selected network: `X: 280`, `Instagram: 2,200`, `TikTok: 2,200`, `Facebook: 5,000`.
   - If a post targets multiple channels, the composer displays individual counters for each channel. If any single channel exceeds its limit, the schedule button is blocked.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js `18.18+` or `20+`
- npm or yarn

### 1. Clone & Enter Project Directory
```bash
cd social-media-scheduler
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub / Bitbucket:
   ```bash
   git add .
   git commit -m "feat: complete social media scheduler dashboard"
   git remote add origin https://github.com/your-username/social-media-scheduler.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework preset will automatically detect **Next.js**.
5. Click **Deploy**.
6. Copy the deployment URL and add it to the top of this `README.md`.

---

## ✉️ Submission Checklist

- [x] Next.js with TypeScript & Tailwind CSS
- [x] Mock data with 32+ posts across Facebook, Instagram, X, and TikTok
- [x] Queue grouped by day (Today, Tomorrow, upcoming dates)
- [x] Content preview, platform icons, local scheduled time, status badges
- [x] Filter by platform & status, search by content
- [x] URL query parameters persistence across refresh
- [x] Post composer with multi-platform selection and optional image URL
- [x] Live character counters (X 280, Instagram 2200, TikTok 2200, Facebook 5000)
- [x] Scheduling blocked if any platform exceeds limit
- [x] Scheduled time validation (must be in future, stored in UTC, shown in local time)
- [x] Optimistic retry with 1s delay, 20% failure simulation, and rollback
- [x] Loading, empty, and error states
- [x] Responsive layout for mobile and desktop
- [x] Steps to run, key decisions, and deployment guide included
