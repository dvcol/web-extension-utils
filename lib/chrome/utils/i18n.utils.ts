import { Observable } from 'rxjs';

/**
 * Wrap getAcceptLanguages in observable
 * @see chrome.i18n.getAcceptLanguages
 */
export const getAcceptLanguages = () =>
  new Observable<string[]>(subscriber =>
    chrome.i18n.getAcceptLanguages(languages => {
      subscriber.next(languages);
      subscriber.complete();
    }),
  );
