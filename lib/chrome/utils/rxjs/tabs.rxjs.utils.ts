import { from, map } from 'rxjs';

import type { QueryInfo, Tab } from '@lib/chrome/models/tabs.model';
import type { Observable } from 'rxjs';

/**
 * Return the active tab
 * @param queryInfo Query info for active scope
 */
export const getActiveTab = (queryInfo: QueryInfo = { active: true, lastFocusedWindow: true }): Observable<Tab> =>
  from(globalThis?.chrome.tabs?.query(queryInfo)).pipe(map(([tab]) => tab));
