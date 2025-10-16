/**
 * Generate a unique browser fingerprint for guest user tracking
 * This combines various browser properties to create a stable identifier
 */
export function generateFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('Browser Fingerprint', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('Browser Fingerprint', 4, 17);

  const canvasData = canvas.toDataURL();

  const fingerprint = {
    canvas: canvasData,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  };

  // Create a simple hash from the fingerprint data
  const fingerprintString = JSON.stringify(fingerprint);
  return simpleHash(fingerprintString);
}

/**
 * Simple hash function to convert fingerprint data to a short string
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get or create a persistent fingerprint stored in localStorage
 */
export function getPersistentFingerprint() {
  const storageKey = 'aether_guest_fingerprint';
  
  // Try to get existing fingerprint from localStorage
  let fingerprint = localStorage.getItem(storageKey);
  
  if (!fingerprint) {
    // Generate new fingerprint
    fingerprint = generateFingerprint();
    // Store it
    localStorage.setItem(storageKey, fingerprint);
  }
  
  return fingerprint;
}

/**
 * Clear the stored fingerprint (for testing purposes)
 */
export function clearFingerprint() {
  localStorage.removeItem('aether_guest_fingerprint');
}

