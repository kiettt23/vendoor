/**
 * Logging Utility
 * Environment-aware logging for development vs production
 *
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 *   logger.cache('Cache hit');  // Only logs in development
 *   logger.error('Error');      // Always logs
 *
 * Or use named exports:
 *   import { cache, error, debug } from '@/lib/utils/logger';
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * Logger object with environment-aware methods
 */
export const logger = {
  /**
   * Cache operations - only logs in development
   * Use for cache hit/miss/set/delete operations
   */
  cache: isDev ? console.log : () => {},

  /**
   * Errors - always logs
   * Use for error conditions that need to be tracked
   */
  error: console.error,

  /**
   * Warnings - always logs
   * Use for warning conditions
   */
  warn: console.warn,

  /**
   * Debug - only logs in development
   * Use for debugging information during development
   */
  debug: isDev ? console.log : () => {},

  /**
   * Info - always logs
   * Use for informational messages
   */
  info: console.info,
};

/**
 * Named exports for convenience
 * Allows: import { cache, error, debug } from '@/lib/utils/logger';
 */
export const { cache, error, warn, debug, info } = logger;

/**
 * Default export
 * Allows: import logger from '@/lib/utils/logger';
 */
export default logger;
