import { buildUrl } from '@lib/http/utils';

import { throwError } from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import type { BaseHttpRequest } from '@lib/http/models';
import type { Observable } from 'rxjs';

export const rxFetch = <T>({ url, params, redirect, ...init }: BaseHttpRequest): Observable<T> => {
  let _url: string;
  try {
    _url = buildUrl(url, params).toString();
  } catch (error) {
    console.debug('Failed to build url for ', url, params);
    return throwError(() => error);
  }
  return fromFetch<T>(_url, {
    ...init,
    redirect: redirect ?? 'follow',
    selector: res => res.json(),
  });
};
