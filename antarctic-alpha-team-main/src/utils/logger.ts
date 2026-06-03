// Logger utility - logs only in development mode
const isDev = import.meta.env.DEV

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors in development, but we can also log critical ones in production
    if (isDev) {
      console.error(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(...args)
    }
  }
}
