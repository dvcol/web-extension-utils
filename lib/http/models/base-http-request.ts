import type { HttpBody, HttpHeaders, HttpMethod, HttpParameters } from '@lib/http/models';

/** Base Http request interface */
export interface BaseHttpRequest {
  url: string | URL | { path: string | URL; base: string | URL };
  method?: HttpMethod;
  headers?: HttpHeaders;
  params?: HttpParameters;
  body?: HttpBody;
  redirect?: RequestRedirect;
}
