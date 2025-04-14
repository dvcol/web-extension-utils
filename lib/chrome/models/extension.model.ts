export type EventTypes = `${chrome.runtime.OnInstalledReason}`;
export type InstalledDetails = chrome.runtime.InstalledDetails;
export type VersionUpdateDetails = InstalledDetails & { nextVersion: string };
export type VersionUpdateCallback = (details: VersionUpdateDetails) => void | Promise<void>;

export type Manifest = chrome.runtime.Manifest;
export type ManifestV2 = chrome.runtime.ManifestV2;
export type ManifestV3 = chrome.runtime.ManifestV3;

export type ContentScript = {
  matches?: string[] | undefined;
  exclude_matches?: string[] | undefined;
  css?: string[] | undefined;
  js?: string[] | undefined;
  run_at?: string | undefined;
  all_frames?: boolean | undefined;
  match_about_blank?: boolean | undefined;
  include_globs?: string[] | undefined;
  exclude_globs?: string[] | undefined;
};
