# Contributing Guide

## What makes a good entry

This list is for people looking for trustworthy alternatives to services that don't respect their privacy. It is not a place to promote projects: things are added once they have shown they last, not to help them get noticed. Most new suggestions are declined, and that is fine. A project is a good fit when:

- **Its code is public**, linked from the entry, and you can build it yourself. An open source license is preferred; source-available code is accepted and marked `source-available`. A *service* whose servers you cannot inspect anyway (a mail provider, a VPN) can qualify on a long, public privacy record, and its client apps should still be open where it has them. Closed-source apps are a rare exception for long-trusted projects, marked `closed source`.
- **It is mature and maintained**: at least 6 months of steady work, usable today rather than a concept or a waitlist, and updated within the last year. A beta or 0.x version is fine if people already rely on it. Age counts from when the current code started, not from when the repository was created; if the history looks short for a good reason (it moved from another host, or the code was opened later), say so in the pull request.
- **People actually use it**: a real user base, packaged releases (F-Droid, Flathub, distro repositories), or a community around it. A fresh repository with a handful of stars is not there yet; come back when it is. A single developer is fine, and building a community around the project helps.
- **It is private by default.** No account where none is needed, data kept local or end-to-end encrypted where it matters, and you can export or delete it. Telemetry or cloud features that you cannot turn off rule a project out. If they are on by default but a setting turns them off easily, the entry is marked `telemetry opt-out`.
- **It is secure.** No open critical vulnerabilities, and past ones were fixed promptly and in the open.
- **Security tools need a longer track record.** If people trust it with secrets or money (encryption, password managers, 2FA, secret sharing, wallets), six months isn't enough: look for about a year or more of steady maintenance, with issues and fixes handled in the open. A project that invents its own encryption or protocol instead of using well-known ones should have an independent audit.
- **It is transparent.** It is clear who makes it and how it is funded.
- **It replaces something.** Say what mainstream tool it is an alternative to.

Trackers on a project's *website* don't rule it out, but the entry is marked `website trackers`. Cookieless analytics don't count: the tools in the [Analytics](https://github.com/pluja/awesome-privacy#analytics) section, Fathom, Simple Analytics and Cloudflare Web Analytics are fine.

Every listing is open to discussion. If something here looks wrong, open an issue.

If you build or work on the project, say so in the pull request. Self-submissions are welcome when they meet the bar, but undisclosed ones are closed. Low-effort or generated submissions (a one-line pitch for a brand-new tool, a site listing "50+ free tools", a project with no source code) are closed without review.

## Adding a project

New projects are added through pull requests. The list lives in `data/sections/`, one YAML file per section; `README.md` is generated from it, so please don't edit the README.

Add your entry to the right section file:

```yaml
- name: Example
  url: https://example.org                    # the project's website
  repo: https://github.com/example/example    # its source code
  description: What it is, plus the privacy property that matters.
```

Optional fields: `platforms` (only if it runs on some platforms, e.g. `[android]`), `tags` (`self-host`, `e2ee`, `p2p`, `no-account`, `tor`, `offline`...) and `package_id` for Android apps. Leave out `license`, `added` and `fdroid`: CI checks the license, stamps the date after merge, and links the F-Droid build when the app is on F-Droid. The full schema is in `schema/schema.ts`.

The description is one plain sentence: what the project is and why it's better for privacy. No marketing words, no license or platform list (those are fields).

To check your change locally: `npm ci && npm run validate`. To preview the README: `npm run build`, then discard the README change before committing.

A new section needs a file in `data/sections/` and a line in `data/meta.yaml`, under the category it belongs to.

### Reporting a problem

If a listed project is dead, changed hands, added trackers or changed its license, open an issue with a link that shows it.

## Maintenance policy

### When a project is unmaintained

A gap in commits does not mean a project is dead. Some tools are finished and need no changes. Judge a project by whether it still works and whether a maintained alternative exists:

- Dead, and a maintained alternative exists: remove it.
- Dead, still works, and no real alternative: keep it and mark it 💀.
- Dead and broken or insecure (relies on a defunct API, has unpatched security holes): remove it.

The 💀 icon means "unmaintained but still the best available option", not "quiet lately".

### Review cadence

Pull requests are reviewed in monthly batches. A slow response is not a rejection.

### Automated checks

- Every pull request validates the data and posts a comment with checks on each added project: age, releases, activity, license, unpatched security advisories, website trackers, telemetry libraries in the code, duplicates, and whether the submitter owns the project. These are signals for the reviewer, not a verdict.
- After a merge, CI stamps the `added` date on new entries and regenerates `README.md`.
- On the first of each month a job checks every entry: dead links, repositories that are gone, archived, stale or moved, license changes, inactive entries that came back, website trackers that don't match the `website trackers` badge, and known trackers in Android apps through [Exodus Privacy](https://exodus-privacy.eu.org). It opens a single "Health report" issue; delisting and 💀 flagging happen from that report.
