import { Post } from '@/types/post';
import { generateInitialPosts } from '@/mock/initialPosts';

const STORAGE_KEY = 'social_media_scheduler_posts_v1';

export function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') {
    return generateInitialPosts();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialPosts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = generateInitialPosts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Failed to load posts from storage, falling back to mock data:', err);
    return generateInitialPosts();
  }
}

export function saveStoredPosts(posts: Post[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage:', err);
  }
}

export function resetStoredPosts(): Post[] {
  if (typeof window === 'undefined') return generateInitialPosts();
  try {
    const fresh = generateInitialPosts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch (err) {
    console.error('Failed to reset posts:', err);
    return generateInitialPosts();
  }
}

/**
 * Simulates the backend API call for retrying a failed post.
 * Requirement:
 * "Update the UI immediately, simulate an API call with a 1 second delay
 * that fails 20% of the time, and roll back with an error message on failure."
 */
export async function simulateRetryApiCall(postId: string): Promise<{ success: boolean; errorMessage?: string }> {
  // Simulate network latency (1000ms delay)
  console.debug(`[Simulation] Retrying post broadcast for ID: ${postId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 20% failure probability (Math.random() < 0.20)
  const isFailure = Math.random() < 0.20;

  if (isFailure) {
    const errorReasons = [
      'Simulated Gateway Timeout (504): Downstream social network API failed to acknowledge within 1000ms.',
      'Simulated Rate Limit (429): Endpoint quota exceeded for this account. Retry rolled back.',
      'Simulated Handshake Error: OAuth session token revoked or expired during broadcast attempt.',
      'Simulated Media Service Error: Asset CDN reported temporary unreachability.',
    ];
    const chosenError = errorReasons[Math.floor(Math.random() * errorReasons.length)];
    return {
      success: false,
      errorMessage: `Retry failed (${chosenError})`,
    };
  }

  return { success: true };
}
