// Display wording for platforms, tags and caveats, and the evidence links behind avoid reasons.
import type { AvoidItem, CAVEATS, Entry, PLATFORMS, TAGS } from "../schema/schema.ts";

export const PLATFORM_LABEL: Record<(typeof PLATFORMS)[number], string> = {
  android: "Android", ios: "iOS", linux: "Linux", macos: "macOS", windows: "Windows",
  desktop: "Desktop", web: "Web", browser: "Browser", cli: "CLI",
};

export const TAG_LABEL: Record<(typeof TAGS)[number], string> = {
  "self-host": "self-host", e2ee: "end-to-end encrypted", p2p: "peer-to-peer", "no-account": "no account", "anonymous-account": "anonymous account",
  "no-kyc": "no ID checks", tor: "Tor", offline: "offline", activitypub: "ActivityPub", audited: "audited", fork: "fork",
};
// Tags the README shows; the rest are already clear from the description there.
export const README_TAGS: readonly (typeof TAGS)[number][] = ["self-host", "activitypub", "fork"];

// play-store-trackers is shown next to the F-Droid link instead of as a badge.
export const CAVEAT_LABEL: Record<Exclude<(typeof CAVEATS)[number], "play-store-trackers">, string> = {
  "closed-source": "closed source",
  "source-available": "source-available",
  "website-trackers": "website trackers",
  "telemetry-opt-out": "telemetry opt-out",
  "closed-server": "closed server",
  "account-required": "account required",
};

export const CAVEAT_MEANING: Record<keyof typeof CAVEAT_LABEL | "inactive", string> = {
  inactive: "development has stalled. It still works and has no maintained alternative, so check before relying on it.",
  "closed-source": "the code isn't public. Listed only because of a long, trusted record.",
  "source-available": "the code is public, but the license isn't an open source one.",
  "website-trackers": "the project's website loads third-party trackers. That says nothing about the app itself.",
  "telemetry-opt-out": "the app sends usage data by default, but a setting turns it off.",
  "closed-server": "the server code isn't public.",
  "account-required": "an account is needed to use it.",
};

export const PLAY_STORE_TRACKERS = "Play Store version has trackers";

export type Warning = { key: keyof typeof CAVEAT_MEANING; label: string };

export function warnings(e: Entry): Warning[] {
  return [
    ...(e.caveats ?? []).filter((c) => c !== "play-store-trackers").map((c) => ({ key: c, label: CAVEAT_LABEL[c] })),
    ...(e.status === "inactive" ? [{ key: "inactive" as const, label: "inactive" }] : []),
  ];
}

export function fdroidUrl(e: Entry): string | undefined {
  return e.fdroid && e.package_id ? `https://f-droid.org/packages/${e.package_id}/` : undefined;
}

export type Evidence = { label: "ToS;DR" | "Exodus" | "Source"; url: string };

export function evidenceLinks(a: AvoidItem): Evidence[] {
  const links: (Evidence | false)[] = [
    !!a.tosdr && { label: "ToS;DR", url: `https://tosdr.org/en/service/${a.tosdr.replace(/^en_/, "")}` },
    !!a.exodus && { label: "Exodus", url: `https://reports.exodus-privacy.eu.org/en/reports/${a.exodus}/latest/` },
    !!a.source && { label: "Source", url: a.source },
  ];
  return links.filter((l): l is Evidence => !!l);
}

export const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

// GitHub's heading anchor: lowercase, drop punctuation and emoji, spaces to hyphens.
export const headingId = (title: string) => title.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/ /g, "-");
