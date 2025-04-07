type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  duration?: number;
}

class ShopifyLogger {
  private static instance: ShopifyLogger;
  private logs: LogEntry[] = [];
  private isDebugEnabled = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): ShopifyLogger {
    if (!ShopifyLogger.instance) {
      ShopifyLogger.instance = new ShopifyLogger();
    }
    return ShopifyLogger.instance;
  }

  private formatLog(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  info(message: string, data?: unknown): void {
    const log = this.formatLog('info', message, data);
    this.logs.push(log);
    console.log(`[Shopify] ${message}`, data || '');
  }

  warn(message: string, data?: unknown): void {
    const log = this.formatLog('warn', message, data);
    this.logs.push(log);
    console.warn(`[Shopify] ${message}`, data || '');
  }

  error(message: string, data?: unknown): void {
    const log = this.formatLog('error', message, data);
    this.logs.push(log);
    console.error(`[Shopify] ${message}`, data || '');
  }

  debug(message: string, data?: unknown): void {
    if (!this.isDebugEnabled) return;
    const log = this.formatLog('debug', message, data);
    this.logs.push(log);
    console.debug(`[Shopify] ${message}`, data || '');
  }

  logApiCall(operation: string, duration: number, data?: unknown): void {
    const log = {
      ...this.formatLog('info', `API Call: ${operation}`, data),
      duration
    };
    this.logs.push(log);
    console.log(`[Shopify] ${operation} took ${duration}ms`, data || '');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const shopifyLogger = ShopifyLogger.getInstance();
