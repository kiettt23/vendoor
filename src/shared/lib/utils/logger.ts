type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = process.env.NODE_ENV === "development";

class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  // Format log message with context
  private format(level: LogLevel, message: string, _data?: unknown): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : "";
    return `${timestamp} ${level.toUpperCase()} ${ctx} ${message}`;
  }

  // Debug logs (only in development)
  debug(message: string, data?: unknown) {
    if (isDevelopment) {
      console.log(this.format("debug", message), data || "");
    }
  }

  // Info logs (development + production)
  info(message: string, data?: unknown) {
    if (isDevelopment) {
      console.log(this.format("info", message), data || "");
    }
    // In production, could send to logging service (e.g., Sentry)
  }

  // Warning logs (development + production)
  warn(message: string, data?: unknown) {
    if (isDevelopment) {
      console.warn(this.format("warn", message), data || "");
    }
    // In production, could send to logging service
  }

  // Error logs (development + production)
  error(message: string, error?: unknown) {
    if (isDevelopment) {
      console.error(this.format("error", message), error || "");
    }

    // In production, integrate with error tracking service (e.g., Sentry)
    // when needed: Sentry.captureException(error, { extra: { message } });
  }

  // Create a child logger with additional context
  child(context: string): Logger {
    const parentContext = this.context ? `${this.context}:${context}` : context;
    return new Logger(parentContext);
  }
}

/**
 * Create a logger instance with optional context
 *
 * @example
 * const logger = createLogger("ProductService");
 * logger.info("Creating product", { name: "Test" });
 * logger.error("Failed to create product", error);
 */
export function createLogger(context?: string): Logger {
  return new Logger(context);
}

/**
 * Default logger instance (no context)
 */
export const logger = new Logger();

/**
 * Performance measurement utility
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();

    if (isDevelopment) {
      console.log(`⏱️  [${label}] Started`);
    }
  }

  // End timer and log duration
  end() {
    const duration = Date.now() - this.startTime;

    if (isDevelopment) {
      const color = duration < 100 ? "🟢" : duration < 500 ? "🟡" : "🔴";
      console.log(`${color} [${this.label}] Completed in ${duration}ms`);
    }

    return duration;
  }
}

/**
 * Measure performance of an async function
 *
 * @example
 * await measurePerformance("getProducts", async () => {
 *   return await prisma.product.findMany();
 * });
 */
export async function measurePerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const timer = new PerformanceTimer(label);
  try {
    return await fn();
  } finally {
    timer.end();
  }
}
