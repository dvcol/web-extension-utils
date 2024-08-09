export const cookies: typeof chrome.cookies | undefined = globalThis?.chrome?.cookies;

export const getCookie: typeof chrome.cookies.get | undefined = cookies?.get;
export const getAllCookies: typeof chrome.cookies.getAll | undefined = cookies?.getAll;
export const setCookie: typeof chrome.cookies.set | undefined = cookies?.set;
export const removeCookie: typeof chrome.cookies.remove | undefined = cookies?.remove;
export const getAllCookieStores: typeof chrome.cookies.getAllCookieStores | undefined = cookies?.getAllCookieStores;
export const onCookieChanged: typeof chrome.cookies.onChanged | undefined = cookies?.onChanged;
