import { fromEventPattern } from 'rxjs';

import type { InstalledDetails } from '../models';

import type { Observable } from 'rxjs';

type InstalledHandler = (details: InstalledDetails) => void;
const addOnInstallHandler = (handler: InstalledHandler) => chrome.runtime.onInstalled.addListener(handler);
const removeOnInstallHandler = (handler: InstalledHandler) => chrome.runtime.onInstalled.removeListener(handler);

/**
 * Rxjs wrapper for when chrome installs a new version of an extension
 * @see chrome.runtime.onInstalled
 */
export const onInstalled$: Observable<InstalledDetails> = fromEventPattern<InstalledDetails>(addOnInstallHandler, removeOnInstallHandler);
