type MessageSender = chrome.runtime.MessageSender;

/**
 * Type union of possible message
 */
export type ChromeMessageType = string;

/**
 * Type union of possible message payloads
 */
export type ChromeMessagePayload = any;

/**
 * Message interface for communication between content & background
 */
export interface ChromeMessage<T extends ChromeMessageType = ChromeMessagePayload, P extends ChromeMessagePayload = ChromeMessagePayload> {
  type: T;
  payload?: P;
}

/**
 * Type union of possible message payloads
 */
export type ChromeResponsePayload = any;

/**
 * Response wrapper for payload proxy
 */
export type ChromeResponse<P extends ChromeResponsePayload = ChromeResponsePayload> = {
  success: boolean;
  payload?: P;
  error?: Error;
};

/**
 * Message handler signature for Rxjs wrapping.
 */
export type ChromeMessageHandler<T extends ChromeMessageType, P extends ChromeMessagePayload, R extends ChromeResponsePayload> = {
  message: ChromeMessage<T, P>;
  sender: MessageSender;
  sendResponse: (response?: ChromeResponse<R>) => void;
};
