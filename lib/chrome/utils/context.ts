import { ProxyLogger } from '@lib/chrome/utils/logger';

import { forkJoin, Observable, of } from 'rxjs';

import type { ContextMenu, ContextMenuCreate, ContextMenuUpdate } from '../models';
import type { Subscriber } from 'rxjs';

/**
 * Update an already creation context menu
 * @see chrome.contextMenus.update
 */
const updateContextMenu = (id: string, updates: ContextMenuUpdate, subscriber: Subscriber<void>) =>
  chrome.contextMenus.update(id, updates, () => {
    ProxyLogger.debug(`Context menu '${id}' updated`, { id, updates });
    subscriber.next();
    subscriber.complete();
  });

/**
 * Add or update a context menu to chrome with the given options
 * @see chrome.contextMenus.create
 */
export function saveContextMenu(menu: ContextMenu, update?: boolean): Observable<void> {
  return new Observable<void>(subscriber => {
    const { id, ...updates } = menu;
    if (update) {
      ProxyLogger.debug(`Context menu '${id}' updated`, { id, updates });
      updateContextMenu(id, updates as ContextMenuUpdate, subscriber);
    } else {
      const { onclick, ...create } = menu;
      chrome.contextMenus.create(create as ContextMenuCreate, () => {
        ProxyLogger.debug(`Context menu '${id}' created`, { id, updates });
        updateContextMenu(id, updates as ContextMenuUpdate, subscriber);
      });
    }
  });
}

/**
 * Remove context menu from chrome corresponding to the specified id
 * @see chrome.contextMenus.remove
 */
export function removeContextMenu(id: string): Observable<void> {
  return new Observable<void>(subscriber => {
    ProxyLogger.debug(`removing context menu '${id}'`);
    chrome.contextMenus.remove(id, () => {
      ProxyLogger.debug(`Context menu '${id}' removed`);
      subscriber.next();
      subscriber.complete();
    });
  });
}

/**
 * Build context menu for the menu options given
 * @param options the options
 * @param callback the context creation function
 * @see chrome.contextMenus.removeAll
 */
export function buildContextMenu<C extends ContextMenu = ContextMenu>(
  options: C[] | undefined,
  callback: (menu: C, update?: boolean) => Observable<void> = saveContextMenu,
): Observable<void | void[]> {
  chrome.contextMenus.removeAll();
  if (options?.length) return forkJoin(options.map(o => callback(o)));
  return of(null);
}
