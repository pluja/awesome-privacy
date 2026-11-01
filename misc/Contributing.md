# Contributing Guide

## Requirements for a service to be listed:

- [x] Clear privacy-oriented / own your data policy.
- [x] No user-tracking on project website. Only tracking listed under [Analytics](https://github.com/pluja/awesome-privacy#analytics) allowed.
- [x] Open source code is very valuable since it allows you to trust in the project (you can review the code) and not just trust the words. But some service without Open Source code may be added if there is special trust from community and has a good history privacy-wise.

> Every project will need investigation. And of course all listings / additions / PRs and issues are open to discussion as I am human and I may make mistakes.

## What makes a good entry

This list recommends tools people can rely on. Most new suggestions are declined, and that is fine. A project is a good fit when:

- **It is open source**, with the code public and linked from the entry. For apps and tools this is required: without the code, nobody can check the privacy claims. A *service* whose servers you cannot inspect anyway (a mail provider, a VPN) can qualify on a long, public privacy record, and its client apps should still be open source where it has them.
- **It is mature and maintained**: at least 6 months old, a stable release rather than a beta or a concept, and updated within the last year.
- **People actually use it**: a real user base, packaged releases (F-Droid, Flathub, distro repositories), or a community around it. A fresh repository with a handful of stars is not there yet; come back when it is.
- **It is private by default.** No trackers on the website (analytics tools from the [Analytics](https://github.com/pluja/awesome-privacy#analytics) section are fine), no telemetry or cloud features switched on without asking, no account where none is needed, and data kept local or end-to-end encrypted where it matters. You stay in control of your data and can export or delete it.
- **It is secure.** No open critical vulnerabilities, and past ones were fixed promptly and in the open.
- **It is transparent.** It is clear who makes it and how it is funded.
- **It replaces something.** Say what mainstream tool it is an alternative to.

If you build or work on the project, say so in the pull request. Self-submissions are welcome when they meet the bar, but undisclosed ones are closed. Low-effort or generated submissions (a one-line pitch for a brand-new tool, a site listing "50+ free tools", a project with no source code) are closed without review.

## Pull Requests

If you are familiar you can add a *section* or a *service* yourself via **pull request**. This is the better way.

If you are not familiar with Github and PRs you can open a new issue and explain what you want to add there.

### Adding a new section
To add a new section copy the following template and complete with the information:

```
## Section Title

<img width="16" src="misc/forbidden.png"> </img> **Avoid**

[OPTIONAL EXPLANATION OF WHY THESE SERVICES ARE BAD]

- Bad Service 1
- Bad Service 2
- Bad Service 3

<img width="16" src="misc/check.png"> </img>  **Instead use**

[OPTIONAL EXPLANATION OF WHY THESE SERVICES ARE GOOD]

- [Good Service 1](https://link-to-source-or-page1) - Little description of the service.
- [Good Service 2](https://link-to-source-or-page2) - Little description of the service.
- [Good Service 2](https://link-to-source-or-page3) - Little description of the service.
```
You also need to add the section to the **Table of Contents (Contents)** at the top of the document:

`- [Section Title](#section-title)`

### Adding a new service

To add a new service just take the following template and add it to the section where it belongs:

`- [Service Name](https://link-to-source-or-page) - Little description of the service`

Every entry needs a description. Keep it to one sentence: say what the tool does and what it replaces. Where it applies, note the license, the platform, and whether the tool is self-hostable.

> You can add either a *good* (use) or a *bad* (avoid) service.

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

- Every pull request that touches `README.md` runs a link check and an entry-format check. Fix the reported problems before asking for a review.
- On the first of each month a job scans the whole list for dead links and for archived or stale repositories, then opens a single "Health report" issue. Delisting and 💀 flagging happen from that report.
