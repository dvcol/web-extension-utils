import { fromEventPattern } from 'rxjs';

import type { DownloadDelta, DownloadFilenameSuggestion, DownloadItem } from '@lib/chrome/models/downloads.model';
import type { Observable } from 'rxjs';

type FilenameHandler = (downloadItem: DownloadItem, suggest: (suggestion?: DownloadFilenameSuggestion) => void) => void;

let fileNameHandler: FilenameHandler;
const addFilenameHandler = (handler: FilenameHandler) => {
  fileNameHandler = (...args) => {
    handler(...args);
    return true;
  };
  return chrome.downloads.onDeterminingFilename.addListener(fileNameHandler);
};
const removeFilenameHandler = (handler: FilenameHandler) => chrome.downloads.onDeterminingFilename.removeListener(fileNameHandler ?? handler);

/**
 * Rxjs wrapper for when chrome is determining file name after initiating a download.
 * @see chrome.downloads.onDeterminingFilename
 */
export const onFilename$: Observable<[DownloadItem, (suggestion?: DownloadFilenameSuggestion) => void]> = fromEventPattern<
  [DownloadItem, (suggestion?: DownloadFilenameSuggestion) => void]
>(addFilenameHandler, removeFilenameHandler);

type CreateHandler = (downloadItem: DownloadItem) => void;
const addCreatedHandler = (handler: CreateHandler) => chrome.downloads.onCreated.addListener(handler);
const removeCreatedHandler = (handler: CreateHandler) => chrome.downloads.onCreated.removeListener(handler);

/**
 * Rxjs wrapper for when chrome initiate a download.
 * @see chrome.downloads.onCreated
 */
export const onCreated$: Observable<DownloadItem> = fromEventPattern<DownloadItem>(addCreatedHandler, removeCreatedHandler);

type ChangedHandler = (downloadDelta: DownloadDelta) => void;
const addChangedHandler = (handler: ChangedHandler) => chrome.downloads.onChanged.addListener(handler);
const removeChangedHandler = (handler: ChangedHandler) => chrome.downloads.onChanged.removeListener(handler);

/**
 * Rxjs wrapper for when chrome change a download state.
 * @see chrome.downloads.onChanged
 */
export const onChanged$: Observable<DownloadDelta> = fromEventPattern<DownloadDelta>(addChangedHandler, removeChangedHandler);
