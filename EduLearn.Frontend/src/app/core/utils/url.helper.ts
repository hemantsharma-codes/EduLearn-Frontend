/**
 * Resolves local upload paths to their full service URL.
 * - /uploads/avatars/... → http://localhost:6001 (AuthService)
 * - /uploads/thumbnails/... → http://localhost:6002 (CourseService)
 * - /uploads/videos/...  → http://localhost:6003 (ContentService)
 * - /uploads/documents/... → http://localhost:6003 (ContentService)
 * - http(s)://... → returned as-is
 */
export function resolveMediaUrl(url: string | null | undefined, fallback: string = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'): string {
  if (!url) return fallback;

  // Already a full URL
  if (url.startsWith('http')) return url;

  // 1. Student Avatars (AuthService)
  if (url.startsWith('/uploads/avatars/')) {
    return 'http://localhost:6001' + url;
  }

  // 2. Course Thumbnails (CourseService)
  if (url.startsWith('/uploads/thumbnails/')) {
    return 'http://localhost:6002' + url;
  }

  // 3. Videos & Documents (ContentService)
  if (url.startsWith('/uploads/')) {
    return 'http://localhost:6003' + url;
  }

  return url;
}
