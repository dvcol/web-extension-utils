import { ApiUnavailableError } from '@lib/chrome/utils/error.utils';

import type { EventTypes, InstalledDetails, VersionUpdateCallback } from '@lib/chrome/models/extension.model';
import type { ChromeConnectListener } from '@lib/chrome/models/message.model';

/**
 * Runtime alias
 */
export const runtime: typeof chrome.runtime | undefined = globalThis?.chrome?.runtime;

/**
 * The ID of the current extension.
 * @see chrome.runtime.id
 * @see [chrome.runtime.id](https://developer.chrome.com/docs/extensions/reference/runtime/#property-id)
 */
export const chromeRuntimeId: typeof chrome.runtime.id | undefined = globalThis?.chrome?.runtime?.id;

/**
 * Get the extension's manifest details.
 * @see chrome.runtime.getManifest
 * @see [chrome.runtime.id](https://developer.chrome.com/docs/extensions/reference/runtime/#property-id)
 */
export const getManifest: typeof chrome.runtime.getManifest | undefined = globalThis?.chrome?.runtime.getManifest;

export const onInstalled: typeof chrome.runtime.onInstalled | undefined = globalThis?.chrome?.runtime.onInstalled;

/**
 * Wrapper for chrome.runtime.onInstalled event listener
 * @param callback
 * @param events
 * @throws ApiUnavailableError
 * @see chrome.runtime.onInstalled
 */
export const onInstalledEvent = (callback: (details: InstalledDetails) => void, events?: EventTypes[]) => {
  if (!onInstalled) throw new ApiUnavailableError('chrome.runtime.onInstalled is not available');
  onInstalled.addListener(details => {
    if (!events?.length) return callback(details);
    if (events.includes(details.reason)) callback(details);
  });

  return () => onInstalled.removeListener(callback);
};

export const onVersionUpdate = (callback: VersionUpdateCallback, events: EventTypes[] = ['update']) =>
  onInstalledEvent(details => {
    const nextVersion = getManifest()?.version;
    if (nextVersion !== details.previousVersion) callback({ ...details, nextVersion });
  }, events);

export const onConnect: typeof chrome.runtime.onConnect | undefined = globalThis?.chrome?.runtime.onConnect;

/**
 * Wrapper for chrome.runtime.onConnect event listener
 * @param callback
 * @throws ApiUnavailableError
 * @see chrome.runtime.onConnect
 */
export const onConnectEvent = (callback: ChromeConnectListener) => {
  if (!onConnect) throw new ApiUnavailableError('chrome.runtime.onConnect is not available');
  onConnect.addListener(callback);
  return () => onConnect.removeListener(callback);
};
