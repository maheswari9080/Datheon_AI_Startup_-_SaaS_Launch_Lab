/**
 * DealForge AI — In-Memory Sliding Window Rate Limiter
 * Protects waitlist and authentication endpoints against brute force and spam
 */

const requestCounts = new Map();

/**
 * Creates a rate limiting middleware
 * @param {Object} options 
 * @param {number} options.windowMs Window duration in milliseconds (default: 15 min)
 * @param {number} options.max Max requests per window per IP (default: 30)
 * @param {string} options.message Error response message
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 30;
  const message = options.message || 'Too many requests from this IP. Please try again later.';

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message
      });
    }

    next();
  };
}

module.exports = { createRateLimiter };
