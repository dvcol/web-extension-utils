import type { RecursiveRecord } from '@dvcol/common-utils/common';

export type StorageArea = chrome.storage.StorageArea;

/**
 * @see [chrome.storage.sync](https://developer.chrome.com/docs/extensions/reference/storage/#type-SyncStorageArea)
 */
export const syncStorage: StorageArea | undefined = globalThis?.chrome?.storage?.sync;

/**
 * @see [chrome.storage.local](https://developer.chrome.com/docs/extensions/reference/storage/#type-LocalStorageArea)
 */
export const localStorage: StorageArea | undefined = globalThis?.chrome?.storage?.local;

/**
 * @see [chrome.storage.session](https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea)
 */
export const sessionStorage: StorageArea | undefined = globalThis?.chrome?.storage?.session;

const filterObject = (object: Record<string, unknown>, regex: string | RegExp) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => (typeof regex === 'string' ? new RegExp(regex) : regex).test(key)));

const reverseFilterObject = (object: Record<string, unknown>, regex: string | RegExp) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => !(typeof regex === 'string' ? new RegExp(regex) : regex).test(key)));

/**
 * This function is used to get the total size of the local storage.
 * @param storage The storage area to get the size of.
 * @param encoder The encoder to use to get the size of the keys and values.
 */
const getLocalStorageSize = (storage = window.localStorage, encoder = new TextEncoder()) => {
  return Object.entries(storage).reduce((acc, [key, value]) => acc + encoder.encode(key).length + encoder.encode(value).length, 0);
};

export type StorageChange<T> = {
  /** Optional. The new value of the item, if there is a new value. */
  newValue?: T;
  /** Optional. The old value of the item, if there was an old value. */
  oldValue?: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Callback type is unknown and can be anything
export type StorageChangeCallback<T = any> = (changes: Record<string, StorageChange<T>>) => void;

export type StorageAreaWrapper = {
  name: string;
  getBytesInUse: () => Promise<number>;
  getAll: <T>(regex?: string | RegExp) => Promise<T>;
  get: <T>(key: string) => Promise<T | undefined>;
  set: <T>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
  removeAll: (regex: string | RegExp) => Promise<void>;
  clear: () => Promise<void>;
  listen: <T>(callback: StorageChangeCallback<T>) => () => void;
};

/**
 * This function is used to wrap the storage areas to provide type inference and a more convenient interface.
 * @param area The storage area to wrap.
 * @param name The name of the storage area.
 * @param prefix The prefix to use for the storage area (global app name, defaults to app).
 */
export const storageWrapper = (name: string, area?: chrome.storage.StorageArea, prefix = 'app'): StorageAreaWrapper => {
  if (!area) {
    console.warn('Storage API is not provided or available, using local storage instead.', { name, prefix });

    if (window[prefix]?.[name]) return window[prefix][name];

    const callbacks = new Set<StorageChangeCallback>();

    const storage = {
      id: `${prefix}-${name}-storage`,
      get values(): RecursiveRecord {
        const _value = window.localStorage.getItem(this.id);
        if (!_value) return {};
        return JSON.parse(_value);
      },
      set values(value: unknown) {
        window.localStorage.setItem(this.id, JSON.stringify(value));
      },
      setItem(key: string, value: unknown) {
        const oldValue = structuredClone(this.values[key]);
        this.values = { ...this.values, [key]: value };
        callbacks.forEach(callback => callback({ [key]: { newValue: this.values[key], oldValue } }));
      },
      removeItem(key: string) {
        const oldValue = structuredClone(this.values[key]);
        this.values = { ...this.values, [key]: undefined };
        callbacks.forEach(callback => callback({ [key]: { newValue: this.values[key], oldValue } }));
      },
      clear() {
        const oldValue = structuredClone(this.values);
        this.values = {};
        const change = Object.keys(oldValue).reduce((acc, key) => ({ ...acc, [key]: { newValue: undefined, oldValue: oldValue[key] } }), {});
        callbacks.forEach(callback => callback(change));
      },
    };

    window[prefix] = { ...window[prefix], [name]: storage };
    console.debug(`Local storage bound to 'window.${prefix}.${name}'.`, { name, prefix, storage: window[prefix][name] });
    return {
      name,
      getBytesInUse: async (): Promise<number> => getLocalStorageSize(window.localStorage),
      getAll: async <T>(regex?: string | RegExp): Promise<T> => (regex ? filterObject(storage.values, regex) : storage.values) as T,
      get: async <T>(key: string): Promise<T | undefined> => storage.values[key] as T | undefined,
      set: async <T>(key: string, value: T): Promise<void> => storage.setItem(key, value),
      remove: async (key: string): Promise<void> => storage.removeItem(key),
      removeAll: async (regex: string | RegExp): Promise<void> => {
        storage.values = reverseFilterObject(storage.values, regex);
      },
      clear: async (): Promise<void> => storage.clear(),
      listen: <T>(callback: StorageChangeCallback<T>) => {
        callbacks.add(callback);
        return () => callbacks.delete(callback);
      },
    };
  }
  return {
    name,
    getBytesInUse: (): Promise<number> => area.getBytesInUse(),
    getAll: <T>(regex?: string | RegExp): Promise<T> => area.get().then(data => (regex ? filterObject(data, regex) : data) as T),
    get: <T>(key: string): Promise<T | undefined> => area.get(key).then(({ [key]: value }) => value),
    set: <T>(key: string, value: T): Promise<void> => area.set({ [key]: value }),
    remove: (key: string): Promise<void> => area.remove(key),
    removeAll: async (regex: string | RegExp): Promise<void> => {
      const data = await area.get();
      const _regex = typeof regex === 'string' ? new RegExp(regex) : regex;
      await Promise.all(
        Object.keys(data).map(key => {
          if (_regex.test(key)) return area.remove(key);
          return Promise.resolve();
        }),
      );
    },
    clear: (): Promise<void> => area.clear(),
    listen: <T>(callback: StorageChangeCallback<T>) => {
      area.onChanged.addListener(callback);
      return () => area.onChanged.removeListener(callback);
    },
  };
};

/**
 * This object is used to access the storage areas.
 */
export const getStorage = (type: 'local' | 'sync' | 'session' = 'local'): StorageAreaWrapper => {
  switch (type) {
    case 'local':
      return storageWrapper('local', localStorage);
    case 'sync':
      return storageWrapper('sync', syncStorage);
    case 'session':
      return storageWrapper('session', sessionStorage);
    default:
      throw new Error(`Storage type "${type}" is not supported.`);
  }
};

/**
 * Determines whether an error is a QuotaExceededError.
 *
 * Browsers love throwing slightly different variations of QuotaExceededError
 * (this is especially true for old browsers/versions), so we need to check
 * different fields and values to ensure we cover every edge-case.
 *
 * @param err - The error to check
 * @return Is the error a QuotaExceededError?
 */
export const isQuotaExceededError = (err: unknown): boolean => {
  if (!(err instanceof DOMException)) return false;
  if (err.name === 'QuotaExceededError') return true;
  if (err.name === 'NS_ERROR_DOM_QUOTA_REACHED') return true; // Firefox
  if (err.code === 22) return true;
  return err.code === 1014; // Firefox
};

/**
 * The default maximum size of the local/session storage.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
 */
export const defaultMaxLocalStorageSize = 10485760 / 2;

/**
 * Wrapper around the storage set method with additional checks for the size of the storage and storage eviction.
 * @param key The key to store the value under.
 * @param value The payload to store.
 * @param regex An optional regex to filter the keys to remove when the storage is full.
 * @param area The storage area to use.
 */
export const setStorageWrapper: <T>(key: string, value: T, regex?: string | RegExp, area?: StorageAreaWrapper) => Promise<void> = async (
  key,
  value,
  regex,
  area = getStorage('local'),
) => {
  let inUse = await area.getBytesInUse();

  const max = globalThis?.chrome?.storage?.local.QUOTA_BYTES ?? defaultMaxLocalStorageSize;

  const encoder = new TextEncoder();
  const payload = encoder.encode(JSON.stringify(value)).length;

  if (payload > max) {
    console.warn('Payload is too large to store in local storage.', { payload, max, inUse, regex, area: area.name });
    return Promise.resolve();
  }

  if (inUse + payload >= max) {
    console.warn('Local storage is full, clearing cache.', { payload, max, inUse, regex, area: area.name });
    if (regex) await area.removeAll(regex);
    else await area.clear();
  }

  inUse = await area.getBytesInUse();
  if (inUse + payload >= max) {
    console.warn('Local storage is still full, skipping cache.', { payload, max, inUse, regex, area: area.name });
    return Promise.resolve();
  }

  try {
    return await area.set(key, value);
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.warn('Local storage is full, clearing cache.', { payload, max, inUse, regex, area: area.name });
      if (regex) await area.removeAll(regex);
      else await area.clear();
      return area.set(key, value);
    }
    throw error;
  }
};
