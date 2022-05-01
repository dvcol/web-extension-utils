import type { URLSearchParams } from 'url';

/** Allowed Body types */
export type HttpBody = string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined;
