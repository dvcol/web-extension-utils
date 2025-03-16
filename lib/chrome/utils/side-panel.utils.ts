/** @see chrome.sidePanel */
export const sidePanel = globalThis?.chrome?.sidePanel;

/** @see chrome.sidePanel.open */
export const openPanel: typeof chrome.sidePanel.open | undefined = sidePanel?.open;

/** @see chrome.sidePanel.setPanelBehavior */
export const setPanelBehavior: typeof chrome.sidePanel.setPanelBehavior | undefined = sidePanel?.setPanelBehavior;

/** @see chrome.sidePanel.getPanelBehavior */
export const getPanelBehavior: typeof chrome.sidePanel.getPanelBehavior | undefined = sidePanel?.getPanelBehavior;

/** @see chrome.sidePanel.getOptions */
export const getPanelOptions: typeof chrome.sidePanel.getOptions | undefined = sidePanel?.getOptions;

/** @see chrome.sidePanel.setOptions */
export const setPanelOptions: typeof chrome.sidePanel.setOptions | undefined = sidePanel?.setOptions;
