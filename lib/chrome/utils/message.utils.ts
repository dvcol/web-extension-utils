import type {
  ChromeMessage,
  ChromeMessageListener,
  ChromeMessageOptions,
  ChromeMessagePayload,
  ChromeMessageType,
  ChromeResponsePayload,
} from '@lib/chrome';

export const onMessage: typeof chrome.runtime.onMessage | undefined = globalThis?.chrome?.runtime.onMessage;

/**
 * Wrapper for chrome.runtime.onMessage event listener
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
  if (!onMessage) throw new Error('chrome.runtime.onMessage is not available');

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

export const sendMessage: typeof chrome.runtime.sendMessage | undefined = globalThis?.chrome?.runtime.sendMessage;

/**
 * Wrapper for chrome.runtime.sendMessage event sender
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
  if (!sendMessage) throw new Error('chrome.runtime.sendMessage is not available');
  return sendMessage<ChromeMessage<T, P>, R>(message, options);
};

export const sendTabMessage: typeof chrome.tabs.sendMessage | undefined = globalThis?.chrome?.tabs.sendMessage;

export const sendTabMessageEvent = async <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  tabId: number,
  message: ChromeMessage<T, P>,
) => {
  if (!sendTabMessage) throw new Error('chrome.tabs.sendMessage is not available');
  return sendTabMessage<ChromeMessage<T, P>, R>(tabId, message);
};
