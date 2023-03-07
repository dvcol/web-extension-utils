import { fromEventPattern, Observable } from 'rxjs';

import type { StorageArea, StorageChange, StorageChangeHandler } from '@lib/chrome/models/storage';

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
const storageGet = <R>(storage: StorageArea, name?: string): Observable<R> =>
  new Observable<R>(subscriber =>
    storage.get(name, keys => {
      subscriber.next(parseJSON<R>(keys[name]));
      subscriber.complete();
    }),
  );

/**
 * Rxjs wrapper for chrome storage setter
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 * @param storage the chrome storage object (chrome.storage.sync, chrome.storage.local, ...)
 */
const storageSet = <R>(storage: StorageArea, name: string, payload: R): Observable<R> =>
  new Observable<R>(subscriber =>
    storage.set({ [name]: JSON.stringify(payload) }, () => {
      subscriber.next(payload);
      subscriber.complete();
    }),
  );

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
 * Wraps onChange event bus into rxjs chain.
 * @param storage the storage area to listen to
 *
 * @see fromEventPattern
 * @see chrome.storage.onChanged
 */
const getOnChange = (storage: StorageArea) => {
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
