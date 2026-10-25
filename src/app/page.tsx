'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Post, Platform, PostStatus } from '@/types/post';
import { getStoredPosts, saveStoredPosts, resetStoredPosts, simulateRetryApiCall } from '@/services/storage';
import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { FilterBar } from '@/components/FilterBar';
import { PostComposer } from '@/components/PostComposer';
import { PostQueue } from '@/components/PostQueue';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { Layers, Send } from 'lucide-react';

function DashboardContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Draft editing / duplicating
  const [composerDraft, setComposerDraft] = useState<Partial<Post> | null>(null);

  // Mobile active tab: 'queue' | 'compose'
  const [mobileTab, setMobileTab] = useState<'queue' | 'compose'>('queue');

  // Media preview modal
  const [previewImage, setPreviewImage] = useState<{ url: string; caption?: string } | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filter state synced with URL query params
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>(() => {
    const p = searchParams.get('platform') as Platform | 'all' | null;
    return p && ['all', 'x', 'instagram', 'tiktok', 'facebook'].includes(p) ? p : 'all';
  });
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>(() => {
    const s = searchParams.get('status') as PostStatus | 'all' | null;
    return s && ['all', 'scheduled', 'published', 'failed'].includes(s) ? s : 'all';
  });

  // Update URL search parameters when filters change
  const updateUrlParams = useCallback(
    (newSearch: string, newPlatform: 'all' | Platform, newStatus: 'all' | PostStatus) => {
      const params = new URLSearchParams();
      if (newSearch.trim()) params.set('search', newSearch.trim());
      if (newPlatform !== 'all') params.set('platform', newPlatform);
      if (newStatus !== 'all') params.set('status', newStatus);

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, '', targetUrl);
    },
    [pathname]
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, platformFilter, statusFilter);
  };

  const handlePlatformChange = (val: 'all' | Platform) => {
    setPlatformFilter(val);
    updateUrlParams(searchQuery, val, statusFilter);
  };

  const handleStatusChange = (val: 'all' | PostStatus) => {
    setStatusFilter(val);
    updateUrlParams(searchQuery, platformFilter, val);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setStatusFilter('all');
    updateUrlParams('', 'all', 'all');
  };

  // Load initial data asynchronously
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const loaded = getStoredPosts();
      setPosts(loaded);
      setIsLoading(false);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Reset to original 32+ mock posts
  const handleResetData = () => {
    if (confirm('Are you sure you want to restore the default 32 mock posts? Any newly scheduled posts will be replaced.')) {
      const fresh = resetStoredPosts();
      setPosts(fresh);
      handleClearFilters();
      addToast({
        type: 'info',
        title: 'Mock Data Reset',
        description: 'Successfully reloaded default 32 mock posts across Facebook, Instagram, X, and TikTok.',
      });
    }
  };

  // Schedule a new post
  const handleSchedulePost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);

    addToast({
      type: 'success',
      title: 'Post Scheduled Successfully!',
      description: `Targeting ${newPost.platforms.join(', ').toUpperCase()} in your local timezone.`,
    });

    if (mobileTab === 'compose') {
      setMobileTab('queue');
    }
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    saveStoredPosts(updated);
    addToast({
      type: 'info',
      title: 'Post Removed',
      description: `Post ID ${postId} was removed from the queue.`,
    });
  };

  // Duplicate / load into composer
  const handleDuplicatePost = (post: Post) => {
    setComposerDraft(post);
    setMobileTab('compose');
    addToast({
      type: 'info',
      title: 'Post Loaded into Composer',
      description: 'You can now modify channels, content, or schedule time.',
    });
    // Scroll to top on desktop
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Retry failed post with Optimistic UI update & 20% simulated failure rollback
   * Requirement 6:
   * "Allow users to retry failed posts. Update the UI immediately,
   * simulate an API call with a 1 second delay that fails 20% of the time,
   * and roll back with an error message on failure."
   */
  const handleRetryPost = async (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    // 1. Snapshot previous state for rollback
    const previousState: Post = { ...target };

    // 2. Immediately update the UI (optimistic update)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: 'scheduled',
              isRetrying: true,
              errorMessage: undefined,
            }
          : p
      )
    );

    addToast({
      type: 'info',
      title: 'Retrying Broadcast...',
      description: 'Optimistic state applied: Status set to Scheduled while checking upstream API.',
    });

    // 3. Simulate API call with 1s delay and 20% failure probability
    const result = await simulateRetryApiCall(postId);

    if (!result.success) {
      // 4. Rollback on failure!
      const failedState: Post = {
        ...previousState,
        status: 'failed',
        isRetrying: false,
        errorMessage: result.errorMessage || 'Upstream API delivery timed out. Rolled back.',
      };

      setPosts((prev) => prev.map((p) => (p.id === postId ? failedState : p)));
      saveStoredPosts(posts.map((p) => (p.id === postId ? failedState : p)));

      addToast({
        type: 'error',
        title: 'Retry Failed (20% Simulation)',
        description:
          result.errorMessage || 'Upstream server rejected connection. Optimistic change has been rolled back.',
        duration: 5500,
      });
    } else {
      // 5. Success confirmed!
      const confirmedState: Post = {
        ...previousState,
        status: 'scheduled',
        isRetrying: false,
        errorMessage: undefined,
      };

      setPosts((prev) => prev.map((p) => (p.id === postId ? confirmedState : p)));
      const updated = posts.map((p) => (p.id === postId ? confirmedState : p));
      saveStoredPosts(updated);

      addToast({
        type: 'success',
        title: 'Retry Successful!',
        description: 'Post broadcast confirmed and queued in schedule.',
      });
    }
  };

  // Filtered posts calculation
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Platform filter
      if (platformFilter !== 'all' && !post.platforms.includes(platformFilter)) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false;
      }
      // Content search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesId = post.id.toLowerCase().includes(query);
        if (!matchesContent && !matchesId) return false;
      }
      return true;
    });
  }, [posts, platformFilter, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Header
        totalCount={posts.length}
        scheduledCount={posts.filter((p) => p.status === 'scheduled').length}
        failedCount={posts.filter((p) => p.status === 'failed').length}
        onResetData={handleResetData}
        onOpenMobileComposer={() => setMobileTab('compose')}
      />

      {/* Main Container - Optimized Spacing */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Interactive Stats Bar */}
        <StatsBar
          posts={posts}
          activeStatus={statusFilter}
          activePlatform={platformFilter}
          onSelectStatus={handleStatusChange}
          onSelectPlatform={handlePlatformChange}
        />

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex rounded-xl bg-slate-200/80 p-1 border border-slate-200">
          <button
            onClick={() => setMobileTab('queue')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mobileTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Schedule Queue ({filteredPosts.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('compose')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mobileTab === 'compose' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Compose Post</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Post Composer (Sticky on Desktop) */}
          <div
            className={`lg:col-span-5 ${
              mobileTab === 'compose' ? 'block' : 'hidden lg:block'
            } lg:sticky lg:top-20 space-y-4`}
          >
            <PostComposer
              onSchedulePost={handleSchedulePost}
              initialValues={composerDraft}
              onClearInitialValues={() => setComposerDraft(null)}
            />
          </div>

          {/* Right Column: Filters and Queue */}
          <div
            className={`lg:col-span-7 ${
              mobileTab === 'queue' ? 'block' : 'hidden lg:block'
            } space-y-4`}
          >
            {/* Filter Bar (Search, Platforms, Status, URL Params) */}
            <FilterBar
              search={searchQuery}
              platform={platformFilter}
              status={statusFilter}
              onSearchChange={handleSearchChange}
              onPlatformChange={handlePlatformChange}
              onStatusChange={handleStatusChange}
              onClearFilters={handleClearFilters}
              filteredCount={filteredPosts.length}
              totalCount={posts.length}
            />

            {/* Post Queue Grouped by Day */}
            <PostQueue
              posts={filteredPosts}
              isLoading={isLoading}
              onRetry={handleRetryPost}
              onDelete={handleDeletePost}
              onDuplicate={handleDuplicatePost}
              onPreviewImage={(url, caption) => setPreviewImage({ url, caption })}
              onClearFilters={handleClearFilters}
              hasActiveFilters={searchQuery.trim() !== '' || platformFilter !== 'all' || statusFilter !== 'all'}
            />
          </div>
        </div>
      </main>

      {/* Media Preview Modal */}
      <ImagePreviewModal
        isOpen={previewImage !== null}
        imageUrl={previewImage?.url || null}
        caption={previewImage?.caption}
        onClose={() => setPreviewImage(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
          Loading OmniSchedule Workspace...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
