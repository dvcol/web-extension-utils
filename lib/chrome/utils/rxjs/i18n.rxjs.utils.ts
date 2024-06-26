import { Observable } from 'rxjs';

import type { ChromeI18nInput } from '@lib/chrome/models/i18n.model';

/**
 * Convert translation using chrome i18n
 * @param value key string or object to translate
 * @param modules optionals modules names
 * @see chrome.i18n.getMessage
 */
export const i18n = (value: string | ChromeI18nInput, ...modules: string[]): string => {
  const path: string = Array.isArray(modules) ? modules.join('__') : modules;

  let key: string;
  let substitution;
  if (typeof value === 'string') {
    key = path ? `${path}__${value}` : value;
  } else {
    key = path ? `${path}__${value.key}` : value.key;
    substitution = value?.substitutions;
  }
  return globalThis?.chrome.i18n?.getMessage?.(key, substitution) || key;
};
/**
 * Setup i18n function with modules names
 * @param roots modules names
 * @see chrome.i18n.getMessage
 */
export const useI18n =
  (...roots: string[]): typeof i18n =>
  (value, ...modules): string =>
    i18n(value, ...(modules?.length ? modules : roots));

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
