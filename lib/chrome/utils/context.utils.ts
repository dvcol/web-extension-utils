import type { ContextMenuOnClickedCallback } from '@lib/chrome';

/**
 * Browser context alias
 */
export const context: typeof chrome.contextMenus | undefined = globalThis?.chrome?.contextMenus;

export const onContextMenuCClicked: typeof chrome.contextMenus.onClicked | undefined = globalThis?.chrome?.contextMenus.onClicked;

export const onContextMenuClicked = (callback: ContextMenuOnClickedCallback) => {
  if (!onContextMenuCClicked) throw new Error('chrome.contextMenus.onClicked is not available');
  onContextMenuCClicked.addListener(callback);
  return () => onContextMenuCClicked.removeListener(callback);
};
