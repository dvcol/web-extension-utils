/** @see chrome.tabs */
export const tabs: typeof chrome.tabs | undefined = globalThis?.chrome?.tabs;

/**
 * Open a new tab with the given options.
 *
 * This is a wrapper around `chrome.tabs.create` that falls back to `window.open` if the method is not available.
 *
 * @param options - The options for the new tab.
 */
const openTab = (options: chrome.tabs.CreateProperties) => window.open(options.url, options.active ? '_self' : '_blank');

/**
 * @see [chrome.tabs.create](https://developer.chrome.com/docs/extensions/reference/tabs/#method-create)
 */
export const createTab = (options: chrome.tabs.CreateProperties) => (tabs?.create ?? openTab)(options);
