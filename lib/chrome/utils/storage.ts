import { Observable } from 'rxjs';

type StorageArea = chrome.storage.StorageArea;

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
const storageGet = <R>(name: string, storage: StorageArea): Observable<R> =>
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
const storageSet = <R>(name: string, payload: R, storage: StorageArea): Observable<R> =>
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
export const syncGet = <R>(name: string): Observable<R> => storageGet(name, chrome.storage.sync);

/**
 * Rxjs wrapper for chrome: chrome.storage.sync.set
 *
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 *
 * @see storageSet
 * @see chrome.storage.sync
 */
export const syncSet = <R>(name: string, payload: R): Observable<R> => storageSet(name, payload, chrome.storage.sync);

/**
 * Rxjs wrapper for chrome: chrome.storage.local.get
 *
 * @param name the key to extract from storage
 *
 * @see storageGet
 * @see chrome.storage.local
 */
export const localGet = <R>(name: string): Observable<R> => storageGet(name, chrome.storage.local);

/**
 * Rxjs wrapper for chrome: chrome.storage.local.set
 *
 * @param name the key to set into storage
 * @param payload the object to serialize into storage
 *
 * @see storageSet
 * @see chrome.storage.local
 */
export const localSet = <R>(name: string, payload: R): Observable<R> => storageSet(name, payload, chrome.storage.local);
