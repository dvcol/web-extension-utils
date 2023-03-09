/**
 * Generate a logging timestamp
 * @param scope the logging scope, default to globalThis._proxyLoggerScope
 */
export const getTimestamp = (scope?: string) => (scope ? `[${new Date()?.toISOString()} - ${scope}]` : `[${new Date()?.toISOString()}]`);

/**
 * Proxy logger to control this extension log level
 */
export class ProxyLogger {
  private static logger: Console = console;
  private static proxy?: Partial<Console>;

  static init(_proxy: Partial<Console>, _logger?: Console) {
    this.proxy = _proxy;
    if (_logger) this.logger = _logger;
  }

  static reset() {
    this.proxy = undefined;
  }

  static get trace() {
    return this.proxy?.trace.bind(this.proxy) ?? this.logger?.trace;
  }

  static get debug() {
    return this.proxy?.debug.bind(this.proxy) ?? this.logger?.debug;
  }

  static get info() {
    return this.proxy?.info.bind(this.proxy) ?? this.logger?.info;
  }

  static get warn() {
    return this.proxy?.warn.bind(this.proxy) ?? this.logger?.warn;
  }

  static get error() {
    return this.proxy?.error.bind(this.proxy) ?? this.logger?.error;
  }
}
