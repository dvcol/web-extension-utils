import { ProxyLogger } from '@lib/common';
import { buildUrl } from '@lib/http/utils';

import { throwError } from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import type { BaseHttpRequest } from '@lib/http/models';
import type { Observable } from 'rxjs';

/**
 * rxjs helper to build valid URL and doing fetch
 * @param url
 * @param params
 * @param redirect
 * @param init
 */
export const rxFetch = <T>({ url, params, redirect, ...init }: BaseHttpRequest): Observable<T> => {
  let _url: string;
  try {
    _url = buildUrl(url, params).toString();
  } catch (error) {
    ProxyLogger.debug('Failed to build url for ', url, params);
    return throwError(() => error);
  }
  return fromFetch<T>(_url, {
    ...init,
    redirect: redirect ?? 'follow',
    selector: res => res.json(),
  });
};
