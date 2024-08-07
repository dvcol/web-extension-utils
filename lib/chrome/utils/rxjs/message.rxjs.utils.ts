import { ProxyLogger } from '@dvcol/common-utils/common/logger';

import { getActiveTab } from '@lib/chrome/utils/rxjs';

import { filter, fromEventPattern, Observable, switchMap, throwError } from 'rxjs';

import type {
  ChromeConnectListener,
  ChromeMessage,
  ChromeMessageHandler,
  ChromeMessageListener,
  ChromeMessagePayload,
  ChromeMessageType,
  ChromePort,
  ChromeResponse,
  ChromeResponsePayload,
} from '@lib/chrome/models/message.model';
import type { Subscriber } from 'rxjs';

/**
 * Rxjs wrapper for chrome.runtime.onMessage event listener
 * @param async if the listener waits for async response or not
 * @param types optional type filtering
 * @see chrome.runtime.onMessage
 */
export const onMessage = <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  types?: ChromeMessageType[],
  async = true,
): Observable<ChromeMessageHandler<T, P, R>> =>
  fromEventPattern<ChromeMessageHandler<T, P, R>>(
    handler => {
      const wrapper: ChromeMessageListener<T, P, R> = (message, sender, sendResponse) => {
        handler({ message, sender, sendResponse });
        return async;
      };
      chrome.runtime.onMessage.addListener(wrapper);
      return wrapper;
    },
    (_handler, wrapper) => chrome.runtime.onMessage.removeListener(wrapper),
  ).pipe(filter(({ message }) => !types?.length || !!types?.includes(message?.type)));

/**
 * Callback for response handling when sending messages wrapped in observables
 * @param subscriber the subscriber to notify
 */
const sendMessageCallback =
  <R extends ChromeResponsePayload = ChromeResponsePayload>(subscriber: Subscriber<R>) =>
  (response: ChromeResponse<R> | any) => {
    if (response?.success === false) {
      subscriber.error(response?.error);
    } else if (response?.success) {
      subscriber.next(response?.payload);
      subscriber.complete();
    } else {
      subscriber.next(response);
      subscriber.complete();
    }
  };

/**
 * Rxjs wrapper for chrome.runtime.sendMessage event sender
 * @param message the ChromeMessage to send
 * @see chrome.runtime.sendMessage
 */
export const sendMessage = <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  message: ChromeMessage<T, P>,
): Observable<R> => new Observable<R>(subscriber => chrome.runtime.sendMessage(message, sendMessageCallback<R>(subscriber)));

/**
 * Rxjs wrapper for chrome.tabs.sendMessage event sender
 * @param tabId the id of the target tab
 * @param message the ChromeMessage to send
 * @see chrome.tabs.sendMessage
 */
export const sendTabMessage = <
  T extends ChromeMessageType = ChromeMessageType,
  P extends ChromeMessagePayload = ChromeMessagePayload,
  R extends ChromeResponsePayload = ChromeResponsePayload,
>(
  tabId: number,
  message: ChromeMessage<T, P>,
): Observable<R> => new Observable<R>(subscriber => chrome.tabs.sendMessage(tabId, message, sendMessageCallback<R>(subscriber)));

/**
 * Rxjs wrapper for chrome.runtime.onConnect event listener
 * @param async if the listener waits for async response or not
 * @param types optional type filtering
 * @see chrome.runtime.onConnect
 */
export const onConnect = <T extends string>(types?: T[], async = true): Observable<ChromePort> =>
  fromEventPattern<ChromePort>(
    handler => {
      const wrapper: ChromeConnectListener = port => {
        handler(port);
        return async;
      };
      chrome.runtime.onConnect.addListener(wrapper);
      return wrapper;
    },
    (_handler, wrapper) => chrome.runtime.onConnect.removeListener(wrapper),
  ).pipe(filter(({ name }) => !types?.length || !!types?.map(String).includes(name)));

/** @see chrome.runtime.connect */
export const portConnect = chrome.runtime.connect;

/**
 * Rxjs wrapper for chrome.tabs.sendMessage event sender and chrome.tabs.query
 * @param message the ChromeMessage to send
 * @see chrome.tabs.sendMessage
 * @see chrome.tabs.sendMessage
 */
export const sendActiveTabMessage = <P extends ChromeMessagePayload = ChromeMessagePayload, R = void>(
  message: ChromeMessage<ChromeMessageType, P>,
): Observable<R> =>
  getActiveTab().pipe(
    switchMap(tab => {
      if (tab?.id) {
        ProxyLogger.logger.debug(`Sending '${message.type}' message to active tab '${tab.id}'`, { message, tab });
        return sendTabMessage<ChromeMessageType, P, R>(tab.id, message);
      }
      return throwError(() => new Error('No active tab found'));
    }),
  );
