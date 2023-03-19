export type StorageArea = chrome.storage.StorageArea;
export type StorageChange = chrome.storage.StorageChange;
export type StorageChangeHandler = ($event: { [key: string]: chrome.storage.StorageChange }) => void;
