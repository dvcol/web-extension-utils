type UpdateProperties = chrome.contextMenus.UpdateProperties;
type CreateProperties = chrome.contextMenus.CreateProperties;

export type ContextMenuUpdate = UpdateProperties & { id: string };
export type ContextMenuCreate = CreateProperties;

export type ContextMenu = ContextMenuCreate | ContextMenuUpdate;
