import type { HttpBody, HttpHeaders, HttpMethod, HttpParameters } from '@lib/http/models';

/** Base Http request interface */
export interface BaseHttpRequest extends RequestInit {
  url: string | URL | { path: string | URL; base: string | URL };
  params?: HttpParameters;
  method?: HttpMethod;
  headers?: HttpHeaders;
  body?: HttpBody;
  redirect?: RequestRedirect;
}
