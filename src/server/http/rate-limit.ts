type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitResult = {
  limited: boolean;
  remaining: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

let lastPruneAt = Date.now();
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;

function pruneExpiredBuckets(now: number) {
  if (now - lastPruneAt < PRUNE_INTERVAL_MS) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  lastPruneAt = now;
}

export function consumeRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  pruneExpiredBuckets(now);

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const next: Bucket = {
      count: 1,
      resetAt: now + options.windowMs
    };

    buckets.set(key, next);

    return {
      limited: false,
      remaining: Math.max(options.maxRequests - 1, 0),
      resetAt: next.resetAt
    };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    limited: current.count > options.maxRequests,
    remaining: Math.max(options.maxRequests - current.count, 0),
    resetAt: current.resetAt
  };
}
