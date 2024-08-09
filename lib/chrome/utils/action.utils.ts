/** @see chrome.action */
export const action: typeof chrome.action | undefined = globalThis?.chrome?.action;

/** @see chrome.action.setIcon */
export const setIcon: typeof chrome.action.setIcon | undefined = action?.setIcon;

/** @see chrome.action.setTitle */
export const setTitle: typeof chrome.action.setTitle | undefined = action?.setTitle;

/** @see chrome.action.setBadgeText */
export const setBadgeText: typeof chrome.action.setBadgeText | undefined = action?.setBadgeText;

/** @see chrome.action.setBadgeTextColor */
export const setBadgeTextColor: typeof chrome.action.setBadgeTextColor | undefined = action?.setBadgeTextColor;

/** @see chrome.action.setBadgeBackgroundColor */
export const setBadgeBackgroundColor: typeof chrome.action.setBadgeBackgroundColor | undefined = action?.setBadgeBackgroundColor;

/** @see chrome.action.openPopup */
export const openPopup: typeof chrome.action.openPopup | undefined = action?.openPopup;
