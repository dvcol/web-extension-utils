import { EMPTY, forkJoin, Observable } from 'rxjs';

import type { ContextMenu, ContextMenuCreate, ContextMenuUpdate } from '../models';
import type { Subscriber } from 'rxjs';

/**
 * Update an already creation context menu
 */
const updateContextMenu = (id: string, updates: ContextMenuUpdate, subscriber: Subscriber<void>) =>
  chrome.contextMenus.update(id, updates, () => {
    console.debug('Context menu updated');
    subscriber.next();
    subscriber.complete();
  });

/**
 * Add or update a context menu to chrome with the given options
 */
export function saveContextMenu(menu: ContextMenu, update?: boolean): Observable<void> {
  return new Observable<void>(subscriber => {
    const { id, ...updates } = menu;
    if (update) {
      console.debug('Context menu updated');
      updateContextMenu(id, updates as ContextMenuUpdate, subscriber);
    } else {
      chrome.contextMenus.create(menu as ContextMenuCreate, () => {
        console.debug('Context menu created');
        updateContextMenu(id, updates as ContextMenuUpdate, subscriber);
      });
    }
  });
}

/**
 * Remove context menu from chrome corresponding to the specified id
 */
export function removeContextMenu(id: string): Observable<void> {
  return new Observable<void>(subscriber => {
    console.debug('removing context menu');
    chrome.contextMenus.remove(id, () => {
      console.debug('Context menu removed');
      subscriber.next();
      subscriber.complete();
    });
  });
}

/**
 * Build context menu for the menu options given
 * @param options the options
 */
export function buildContextMenu(options: ContextMenu[] | undefined): Observable<void | void[]> {
  chrome.contextMenus.removeAll();
  if (options?.length) return forkJoin(options.map(o => saveContextMenu(o)));
  return EMPTY;
}
