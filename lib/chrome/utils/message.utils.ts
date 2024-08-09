import { ApiUnavailableError } from '@lib/chrome/utils/error.utils';

import type {
  ChromeMessage,
  ChromeMessageListener,
  ChromeMessageOptions,
  ChromeMessagePayload,
  ChromeMessageType,
  ChromeResponsePayload,
} from '@lib/chrome';

export const onMessage: typeof chrome.runtime.onMessage | undefined = globalThis?.chrome?.runtime?.onMessage;

/**
 * Wrapper for chrome.runtime.onMessage event listener
 * @throws ApiUnavailableError
 * @see chrome.runtime.onMessage
 */
export const onMessageEvent = <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  callback: ChromeMessageListener<T, P, R>,
  types?: ChromeMessageType | ChromeMessageType[],
) => {
  if (!onMessage) throw new ApiUnavailableError('chrome.runtime.onMessage is not available');

  let _callback: ChromeMessageListener<T, P, R> = callback;
  if (types?.length) {
    const _types = Array.isArray(types) ? types : [types];
    _callback = (message, sender, sendResponse) => {
      if (!_types.includes(message?.type)) return;
      return callback(message, sender, sendResponse);
    };
  }
  onMessage.addListener(_callback);
  return () => onMessage.removeListener(_callback);
};

export const sendMessage: typeof chrome.runtime.sendMessage | undefined = globalThis?.chrome?.runtime?.sendMessage;

/**
 * Wrapper for chrome.runtime.sendMessage event sender
 * @throws ApiUnavailableError
 * @see chrome.runtime.sendMessage
 */
export const sendMessageEvent = async <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  message: ChromeMessage<T, P>,
  options?: ChromeMessageOptions,
) => {
  if (!sendMessage) throw new ApiUnavailableError('chrome.runtime.sendMessage is not available');
  return sendMessage<ChromeMessage<T, P>, R>(message, options);
};

export const sendTabMessage: typeof chrome.tabs.sendMessage | undefined = globalThis?.chrome?.tabs?.sendMessage;

/**
 * Wrapper for chrome.tabs.sendMessage event sender
 * @param tabId
 * @param message
 * @throws ApiUnavailableError
 * @see chrome.tabs.sendMessage
 */
export const sendTabMessageEvent = async <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  tabId: number,
  message: ChromeMessage<T, P>,
) => {
  if (!sendTabMessage) throw new ApiUnavailableError('chrome.tabs.sendMessage is not available');
  return sendTabMessage<ChromeMessage<T, P>, R>(tabId, message);
};
