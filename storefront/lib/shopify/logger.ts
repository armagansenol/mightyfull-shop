type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  duration?: number;
}

const MAX_LOG_ENTRIES = 1000;

class ShopifyLogger {
  private static instance: ShopifyLogger;
  private logs: LogEntry[] = [];
  // Opt-in via SHOPIFY_DEBUG=true in .env.local — info/debug/logApiCall
  // are otherwise silent. warn/error are always emitted.
  private isDebugEnabled = process.env.SHOPIFY_DEBUG === 'true';

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

  private addLog(log: LogEntry): void {
    this.logs.push(log);
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
    }
  }

  info(message: string, data?: unknown): void {
    if (!this.isDebugEnabled) return;
    const log = this.formatLog('info', message, data);
    this.addLog(log);
    console.log(`[Shopify] ${message}`, data || '');
  }

  warn(message: string, data?: unknown): void {
    const log = this.formatLog('warn', message, data);
    this.addLog(log);
    console.warn(`[Shopify] ${message}`, data || '');
  }

  error(message: string, data?: unknown): void {
    const log = this.formatLog('error', message, data);
    this.addLog(log);
    console.error(`[Shopify] ${message}`, data || '');
  }

  debug(message: string, data?: unknown): void {
    if (!this.isDebugEnabled) return;
    const log = this.formatLog('debug', message, data);
    this.addLog(log);
    console.debug(`[Shopify] ${message}`, data || '');
  }

  logApiCall(operation: string, duration: number, data?: unknown): void {
    if (!this.isDebugEnabled) return;
    const log = {
      ...this.formatLog('info', `API Call: ${operation}`, data),
      duration
    };
    this.addLog(log);
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
