import { from, fromEventPattern, map } from 'rxjs';

import type { StorageArea, StorageChange, StorageChangeHandler } from '@lib/chrome/models/storage.model';
import type { Observable } from 'rxjs';

/**
 * Parse a json if it's in string form
 * @param json
 */
const parseJSON = <T>(json?: string | object) => (typeof json == 'string' && json?.length ? JSON.parse(json) : json) as T;

/**
 * Rxjs wrapper for chrome storage getter
 * @param name the key to extract from storage
 * @param storage the chrome storage object (chrome.storage.sync, chrome.storage.local, ...)
 */
export const storageGet = <R>(storage: StorageArea, name?: string): Observable<R> =>
  from(storage.get(name)).pipe(
    map(keys => (name ? parseJSON<R>(keys[name]) : Object.keys(keys).reduce((acc, next) => ({ ...acc, [next]: parseJSON(keys[next]) }), {} as R))),
  );

/**
 * Rxjs wrapper for chrome storage setter
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 * @param storage the chrome storage object (chrome.storage.sync, chrome.storage.local, ...)
 */
export const storageSet = <R>(storage: StorageArea, name: string, payload: R): Observable<R> =>
  from(storage.set({ [name]: JSON.stringify(payload) })).pipe(map(() => payload));

/**
 * Rxjs wrapper for chrome: chrome.storage.sync.get
 *
 * @param name the key to extract from storage
 *
 * @see storageGet
 * @see chrome.storage.sync
 */
export const syncGet = <R>(name?: string): Observable<R> => storageGet(chrome.storage.sync, name);

/**
 * Rxjs wrapper for chrome: chrome.storage.sync.set
 *
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 *
 * @see storageSet
 * @see chrome.storage.sync
 */
export const syncSet = <R>(name: string, payload: R): Observable<R> => storageSet(chrome.storage.sync, name, payload);

/**
 * Rxjs wrapper for chrome: chrome.storage.local.get
 *
 * @param name the key to extract from storage
 *
 * @see storageGet
 * @see chrome.storage.local
 */
export const localGet = <R>(name?: string): Observable<R> => storageGet(chrome.storage.local, name);

/**
 * Rxjs wrapper for chrome: chrome.storage.local.set
 *
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 *
 * @see storageSet
 * @see chrome.storage.local
 */
export const localSet = <R>(name: string, payload: R): Observable<R> => storageSet(chrome.storage.local, name, payload);

/**
 * Rxjs wrapper for chrome.storage.clear
 * @param storage the storage area to clear
 *
 * @see chrome.storage.StorageArea
 */
export const storageClear = (storage: StorageArea): Observable<void> => from(storage.clear());

/**
 * Rxjs wrapper for chrome.storage.local.clear
 *
 * @see chrome.storage.local.clear
 */
export const localClear = () => storageClear(chrome.storage.local);

/**
 * Rxjs wrapper for chrome.storage.sync.clear
 *
 * @see chrome.storage.sync.clear
 */
export const syncClear = () => storageClear(chrome.storage.sync);

/**
 * Wraps onChange event bus into rxjs chain.
 * @param storage the storage area to listen to
 *
 * @see fromEventPattern
 * @see chrome.storage.onChanged
 */
export const getOnChange = (storage: StorageArea) => {
  const addStorageHandler = (handler: StorageChangeHandler) => storage.onChanged.addListener(handler);
  const removeStorageHandler = (handler: StorageChangeHandler) => storage.onChanged.removeListener(handler);
  return fromEventPattern(addStorageHandler, removeStorageHandler);
};

/**
 * Rxjs wrapper for chrome.storage.sync.onChanged
 *
 * @see chrome.storage.sync.onChanged
 */
export const onSyncChange$: Observable<StorageChange> = getOnChange(chrome.storage.sync);

/**
 * Rxjs wrapper for chrome.storage.local.onChanged
 *
 * @see chrome.storage.local.onChanged
 */
export const onLocalChange$: Observable<StorageChange> = getOnChange(chrome.storage.sync);
