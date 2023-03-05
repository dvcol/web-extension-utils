import { fromEventPattern } from 'rxjs';

import type { ContentScript, InstalledDetails } from '../models';

import type { Observable } from 'rxjs';

type InstalledHandler = (details: InstalledDetails) => void;
const addOnInstallHandler = (handler: InstalledHandler) => chrome.runtime.onInstalled.addListener(handler);
const removeOnInstallHandler = (handler: InstalledHandler) => chrome.runtime.onInstalled.removeListener(handler);

/**
 * Rxjs wrapper for when chrome installs a new version of an extension
 * @see chrome.runtime.onInstalled
 */
export const onInstalled$: Observable<InstalledDetails> = fromEventPattern<InstalledDetails>(addOnInstallHandler, removeOnInstallHandler);

/** @see chrome.runtime.getManifest */
export const { getManifest } = chrome.runtime;

const injectScript = (tabId: number, script: string[]) =>
  chrome.scripting.executeScript({
    target: { tabId },
    files: script,
  });

const injectScripts = async (matches: ContentScript['matches'], scripts: ContentScript['js']) => {
  const tabs = await chrome.tabs.query({ url: matches });
  console.debug('Injecting content scripts in tabs', { tabs, matches, scripts });
  tabs?.forEach(tab => {
    if (!tab?.id) return;
    if (!tab?.url?.startsWith('http')) return;
    if (scripts) injectScript(tab.id, scripts);
  });
};

export const injectContentScripts = () =>
  getManifest()?.content_scripts?.forEach(async script => {
    if (script?.js?.length) await injectScripts(script.matches, script.js);
  });
