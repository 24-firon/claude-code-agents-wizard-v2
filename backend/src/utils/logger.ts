const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private level: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private log(level: LogLevel, message: string, ...args: unknown[]) {
    if (LOG_LEVELS[level] >= LOG_LEVELS[this.level]) {
      const timestamp = new Date().toISOString();
      console[level === 'debug' ? 'log' : level](
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        ...args
      );
    }
  }

  debug(message: string, ...args: unknown[]) { this.log('debug', message, ...args); }
  info(message: string, ...args: unknown[]) { this.log('info', message, ...args); }
  warn(message: string, ...args: unknown[]) { this.log('warn', message, ...args); }
  error(message: string, ...args: unknown[]) { this.log('error', message, ...args); }
}

export const logger = new Logger();
