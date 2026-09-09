/**
 * Lightweight in-memory sliding window rate limiter for Next.js Route Handlers.
 * Suitable for serverless/edge environments with graceful fallback.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    const activeTimestamps = record.timestamps.filter((ts) => now - ts < 60_000);
    if (activeTimestamps.length === 0) {
      ipRequestMap.delete(ip);
    } else {
      record.timestamps = activeTimestamps;
    }
  }
}, 5 * 60_000).unref?.();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Check and record a rate limit hit for a given IP identifier.
 * @param ip - Client identifier (IP or fallback)
 * @param limit - Maximum requests allowed in the window (default: 10)
 * @param windowMs - Sliding window duration in milliseconds (default: 60,000ms / 1 min)
 */
export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const record = ipRequestMap.get(ip) || { timestamps: [] };

  // Filter timestamps within current window
  const recentTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= limit) {
    const oldestTimestamp = recentTimestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  recentTimestamps.push(now);
  ipRequestMap.set(ip, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: limit - recentTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
