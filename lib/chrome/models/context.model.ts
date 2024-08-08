import type { Tab } from '@lib/chrome/models/tabs.model';

type UpdateProperties = chrome.contextMenus.UpdateProperties;
type CreateProperties = chrome.contextMenus.CreateProperties;

export type ContextMenuUpdate = UpdateProperties & { id: string };
export type ContextMenuCreate = CreateProperties;

export type ContextMenu = ContextMenuCreate | ContextMenuUpdate;

/**
 * Browser context menu clicked event alias
 */
export type ContextMenuOnClickedData = chrome.contextMenus.OnClickData;

export type ContextMenuOnClickedCallback = (info: ContextMenuOnClickedData, tab: Tab) => void;
