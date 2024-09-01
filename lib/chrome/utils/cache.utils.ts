import { CacheRetention } from '@dvcol/common-utils/common/cache';

import { setStorageWrapper, storage, type StorageArea } from '@lib/chrome';

import type { CacheStore, CacheStoreEntity } from '@dvcol/common-utils/common';

export class ChromeCacheStore<T> implements CacheStore<T> {
  saveRetention?: boolean;
  saveAccess?: boolean;
  evictOnError?: boolean;
  retention?: number;
  store: StorageArea;
  prefix: string;

  constructor({
    saveRetention = true,
    saveAccess = false,
    evictOnError = true,
    retention = CacheRetention.Month,
    store = storage.local,
    prefix = 'http-cache',
  }: {
    saveRetention?: boolean;
    saveAccess?: boolean;
    evictOnError?: boolean;
    retention?: number;
    store?: StorageArea;
    prefix?: string;
  }) {
    this.saveRetention = saveRetention;
    this.saveAccess = saveAccess;
    this.evictOnError = evictOnError;
    this.retention = retention;
    this.store = {
      ...store,
      set: <V>(key: string, value: V) => setStorageWrapper(key, value, this.prefix, store),
    };
    this.prefix = prefix;
  }

  async get(key: string) {
    return this.store.get<CacheStoreEntity<T>>(`${this.prefix}:${key}`);
  }

  async set(key: string, value: CacheStoreEntity<T>) {
    await this.store.set(`${this.prefix}:${key}`, value);
    return this;
  }

  async delete(key: string) {
    await this.store.remove(`${this.prefix}:${key}`);
    return true;
  }

  async clear(regex: string = '') {
    return this.store.removeAll(`^${this.prefix}:${regex}`);
  }

  async entries() {
    const data = await this.store.getAll<Record<string, CacheStoreEntity<T>>>(`^${this.prefix}:`);
    return new Map<string, CacheStoreEntity<T>>(Object.entries(data)).entries();
  }

  async values() {
    const data = await this.store.getAll<Record<string, CacheStoreEntity<T>>>(`^${this.prefix}:`);
    return new Map<string, CacheStoreEntity<T>>(Object.entries(data)).values();
  }

  async keys() {
    const data = await this.store.getAll<Record<string, CacheStoreEntity<T>>>(`^${this.prefix}:`);
    return new Map<string, CacheStoreEntity<T>>(Object.entries(data)).keys();
  }

  /**
   * Clean the cache by removing all entries that are older than the retention period.
   *
   * If an entry has an eviction date in the future, it will not be evicted regardless of the retention period.
   *
   * If no retention period is defined, do nothing.
   *
   * @param retention The duration in milliseconds after which the cache will be cleared.
   */
  async clean(retention = this.retention) {
    if (retention === undefined) throw new Error('No retention period defined');
    const data = await this.store.getAll<Record<string, CacheStoreEntity<T>>>(`^${this.prefix}:`);
    const now = Date.now();
    // date before which the cache should be evicted
    const expires = now - retention;
    await Promise.all(
      Object.entries(data)
        .map(([key, value]) => {
          // if there is an eviction date, and it is in the future, do not evict
          if (value.evictAt && value.evictAt > now) return;
          // if there is a cached date, and it is after the expiration date, do not evict
          if (value.cachedAt && value.cachedAt > expires) return;
          return this.store.remove(key);
        })
        .filter(Boolean),
    );
  }
}
