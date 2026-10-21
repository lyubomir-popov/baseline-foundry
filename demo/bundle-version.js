export const BUNDLE_VERSION_OPTIONS = [
  { value: "before", label: "Before" },
  { value: "after", label: "After" }
];

const stylesheetQueues = new WeakMap();
const loadedStylesheets = new WeakMap();

export function readBundleVersion(location = window.location) {
  return new URLSearchParams(location.search).get("bundle") === "before" ? "before" : "after";
}

export function bundleStylesheetUrl(version, tier) {
  const relativePath = version === "before"
    ? `./spec-028/before/${tier}.css`
    : `../dist/tiers/${tier}/styles.css`;
  return new URL(relativePath, import.meta.url).href;
}

export function writeBundleVersion(version) {
  const url = new URL(window.location.href);
  url.searchParams.set("bundle", version === "before" ? "before" : "after");
  window.history.replaceState(window.history.state, "", url);
  for (const anchor of document.querySelectorAll("[data-page-chrome] a[href]")) {
    if (anchor instanceof HTMLAnchorElement) {
      anchor.href = preserveBundleVersion(anchor.href);
    }
  }
}

export function preserveBundleVersion(href) {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) {
    return href;
  }
  url.searchParams.set("bundle", readBundleVersion());
  return `${url.pathname}${url.search}${url.hash}`;
}

async function performStylesheetSwap(stylesheetLink, version, tier) {
  const targetUrl = bundleStylesheetUrl(version, tier);
  const previous = loadedStylesheets.get(stylesheetLink);
  delete stylesheetLink.dataset.bundleVersion;
  delete stylesheetLink.dataset.bundleTier;
  delete stylesheetLink.dataset.bundleError;
  stylesheetLink.dataset.bundlePending = `${version}:${tier}`;
  const load = async url => {
    const loaded = new Promise((resolve, reject) => {
      const cleanup = () => {
        stylesheetLink.removeEventListener("load", onLoad);
        stylesheetLink.removeEventListener("error", onError);
      };
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error(`Unable to load BF bundle stylesheet ${url}.`));
      };
      stylesheetLink.addEventListener("load", onLoad);
      stylesheetLink.addEventListener("error", onError);
    });
    stylesheetLink.href = url;
    await loaded;
  };
  try {
    if (stylesheetLink.href !== targetUrl || (previous && previous.url !== targetUrl)) {
      await load(targetUrl);
    }
  } catch (error) {
    if (previous?.url && stylesheetLink.href !== previous.url) {
      try {
        await load(previous.url);
        stylesheetLink.dataset.bundleVersion = previous.version;
        stylesheetLink.dataset.bundleTier = previous.tier;
      } catch {
        // A failed recovery remains unready and reports the requested target.
      }
    }
    delete stylesheetLink.dataset.bundlePending;
    stylesheetLink.dataset.bundleError = `${version}:${tier}`;
    throw error;
  }
  loadedStylesheets.set(stylesheetLink, { tier, url: targetUrl, version });
  stylesheetLink.dataset.bundleVersion = version;
  stylesheetLink.dataset.bundleTier = tier;
  delete stylesheetLink.dataset.bundlePending;
}

export function swapBundleStylesheet(stylesheetLink, version, tier) {
  const prior = stylesheetQueues.get(stylesheetLink) ?? Promise.resolve();
  const swap = prior.catch(() => {}).then(() => performStylesheetSwap(stylesheetLink, version, tier));
  stylesheetQueues.set(stylesheetLink, swap);
  return swap.finally(() => {
    if (stylesheetQueues.get(stylesheetLink) === swap) {
      stylesheetQueues.delete(stylesheetLink);
    }
  });
}
