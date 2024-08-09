import { ApiUnavailableError } from '@lib/chrome/utils/error.utils';

import type { ContextMenuOnClickedCallback } from '@lib/chrome';

/**
 * Browser context alias
 */
export const context: typeof chrome.contextMenus | undefined = globalThis?.chrome?.contextMenus;

export const onContextMenuCClicked: typeof chrome.contextMenus.onClicked | undefined = globalThis?.chrome?.contextMenus.onClicked;

/**
 * Wrapper for chrome.contextMenus.create
 * @param callback
 * @throws ApiUnavailableError
 * @see chrome.contextMenus.create
 */
export const onContextMenuClicked = (callback: ContextMenuOnClickedCallback) => {
  if (!onContextMenuCClicked) throw new ApiUnavailableError('chrome.contextMenus.onClicked is not available');
  onContextMenuCClicked.addListener(callback);
  return () => onContextMenuCClicked.removeListener(callback);
};
