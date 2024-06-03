/**
 * The ID of the current extension.
 * @see [chrome.runtime.id](https://developer.chrome.com/docs/extensions/reference/runtime/#property-id)
 */
export const chromeRuntimeId: typeof chrome.runtime.id | undefined = globalThis?.chrome?.runtime?.id;
