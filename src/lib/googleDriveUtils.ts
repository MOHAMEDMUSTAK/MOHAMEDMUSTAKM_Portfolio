/**
 * Converts a Google Drive sharing link to a direct viewable/embeddable URL
 * Supports both file/d/ format and open?id= format
 */
export function getGoogleDriveDirectUrl(url: string | null): string | null {
  if (!url) return null;
  
  // Check if it's already a direct URL
  if (url.includes('drive.google.com/uc?')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID&export=view
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Return a direct image URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Not a Google Drive URL, return as-is
  return url;
}

/**
 * Gets a thumbnail URL for Google Drive files
 * Uses the lh3.googleusercontent.com thumbnail service
 */
export function getGoogleDriveThumbnailUrl(url: string | null, size: number = 400): string | null {
  if (!url) return null;
  
  // Extract file ID
  let fileId: string | null = null;
  
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) {
    fileId = openMatch[1];
  }
  
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Use Google's thumbnail service
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
  
  // Not a Google Drive URL, return as-is
  return url;
}

/**
 * Checks if a URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string | null): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}
