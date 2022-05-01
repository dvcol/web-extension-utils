import { buildUrl } from '@lib/http/utils';

import { throwError } from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import type { BaseHttpRequest } from '@lib/http/models';
import type { Observable } from 'rxjs';

export const rxFetch = <T>({ url, method, headers, params, body, redirect }: BaseHttpRequest): Observable<T> => {
  let _url: string;
  try {
    _url = buildUrl(url, params).toString();
  } catch (error) {
    console.debug('Failed to build url for ', url, params);
    return throwError(() => error);
  }
  return fromFetch<T>(_url, {
    method,
    headers,
    body,
    redirect: redirect ?? 'follow',
    selector: res => res.json(),
  });
};
