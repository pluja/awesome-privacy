# Awesome Privacy
<p align="center"><a href="https://awesomeprivacy.org"><img width="500" src="misc/logo.png" alt="Awesome Privacy"></a></p>
<h3 align="center"><a href="https://awesomeprivacy.org">awesomeprivacy.org</a></h3>
<p align="center">
	<img src="https://awesome.re/badge.svg" alt="Awesome">
	<a href="https://codeberg.org/pluja/awesome-privacy"><img alt="Mirror" src="https://img.shields.io/badge/Mirror-Codeberg-blue"></img></a>
</p>
<p align="center">List of free, open source and privacy respecting services and alternatives to privative services.</p>
<p align="center">
	<a href="https://github.com/pluja/awesome-privacy/blob/main/misc/ABOUT.md"> About </a> | 
	<a href="https://github.com/pluja/awesome-privacy/blob/main/misc/Contributing.md"> Contributing </a> | 
	<a href="https://github.com/pluja/awesome-privacy/blob/main/misc/QUOTES.md"> Quotes </a> | 
	<a href="https://github.com/pluja/awesome-privacy/discussions"> Discussions </a>
</p>

> [!IMPORTANT]
> Anonymity, Privacy, and Security are often used interchangeably, but they actually represent distinct concepts. It is important to understand the differences between them. [Read more in this section below](#privacy-vs-security-vs-anonymity).
> 
> The primary focus of this list is to provide alternatives that prioritize privacy. These alternatives give you control over your data and do not collect or sell it.

## Contents

**💬 Communication & Social**<br>
[Instant Messaging](#instant-messaging) · [Mail Services](#mail-services) · [Online Phone Providers](#online-phone-providers) · [Video and Audio Conferencing](#video-and-audio-conferencing) · [Teamworking Tools](#teamworking-tools) · [Social Networks and Platforms](#social-networks-and-platforms) · [Commenting Engines](#commenting-engines) · [Translation](#translation) · [RSS Readers](#rss-readers)

**🌐 Networking & Web**<br>
[VPNs](#vpns) · [Web Browser](#web-browser) · [Search Engines](#search-engines) · [Domains & Hosting](#domains--hosting) · [Link Shorteners](#link-shorteners) · [Link in Bio Tools](#link-in-bio-tools) · [Captchas](#captchas) · [Analytics](#analytics) · [Routers](#routers)

**🔐 Security & Encryption**<br>
[2FA](#2fa) · [Password Managers](#password-managers) · [Encryption](#encryption) · [Pastebin and Secret Sharing](#pastebin-and-secret-sharing) · [Privacy Tools](#privacy-tools) · [Whistleblowing](#whistleblowing)

**📁 Files & Productivity**<br>
[Cloud Storage](#cloud-storage) · [File Management and Sharing](#file-management-and-sharing) · [Download Manager](#download-manager) · [Notes and Tasks](#notes-and-tasks) · [Office](#office) · [PDF Tools](#pdf-tools) · [Calendar](#calendar) · [Bookmarking](#bookmarking) · [Forms](#forms) · [Databases](#databases)

**🎬 Media & Creative**<br>
[Media Streaming Platforms](#media-streaming-platforms) · [Music Recognition](#music-recognition) · [Photo Storage](#photo-storage) · [Photo Editing and Management](#photo-editing-and-management) · [Video Editing](#video-editing) · [Screen Recording](#screen-recording) · [Design Tools](#design-tools) · [Creator Tools](#creator-tools) · [Fonts](#fonts) · [Games](#games) · [Ebooks](#ebooks)

**📱 Mobile & OS**<br>
[Android](#android-2) · [Operating Systems](#operating-systems) · [Home Assistants](#home-assistants)

**🛠️ Developer & Self-hosting**<br>
[Developer Tools](#developer-tools) · [Version Control](#version-control) · [Remote Access and Control](#remote-access-and-control) · [Artificial Intelligence](#artificial-intelligence) · [Automation](#automation)

**💸 Money**<br>
[Payments](#payments) · [Personal Finances](#personal-finances)

**🧭 Everyday**<br>
[Maps and Navigation](#maps-and-navigation) · [Fitness and Health](#fitness-and-health) · [Dating Apps](#dating-apps) · [Location Tracking](#location-tracking) · [Utilities](#utilities)

## 💬 Communication & Social

### Instant Messaging

Mainstream messengers collect who you talk to, when and from where, even when the messages themselves are encrypted. Look for end-to-end encryption by default, open source clients, and as little metadata and identifying info (like a phone number) as possible; [this site](https://www.securemessagingapps.com/) compares many of them.

🚫 **Avoid**

- **WhatsApp**: in 2021 Ireland fined it €225 million for not properly explaining what data it shares with Facebook. <sub>[ToS;DR](https://tosdr.org/en/service/198) · [Source](https://www.dataprotection.ie/en/news-media/press-releases/data-protection-commission-announces-decision-whatsapp-inquiry)</sub>
- **Facebook Messenger**: chats have been encrypted since 2023, but Meta still sees who you message, when, and who your contacts are. <sub>[ToS;DR](https://tosdr.org/en/service/182) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.facebook.orca/latest/) · [Source](https://www.eff.org/deeplinks/2023/12/meta-announces-end-end-encryption-default-messenger)</sub>
- **Instagram DM**: in 2026 Meta ended its opt-in end-to-end encryption for Instagram DMs, so Meta can read every message. <sub>[ToS;DR](https://tosdr.org/en/service/219) · [Source](https://www.helpnetsecurity.com/2026/03/16/instagram-end-to-end-encrypted-messaging-ending/)</sub>
- **Google Chat**: messages aren't end-to-end encrypted and sit on Google's servers. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

#### Decentralized

Many independently run servers talk to each other, so there is no single point of control or failure and you can pick a server or run your own. Federation is more complex and leaves some extra metadata on the servers involved.

- **[DeltaChat](https://delta.chat/)** - Messenger that runs over email, with end-to-end encryption and no phone number needed. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.b44t.messenger/)</sub>
- **[Jabber / XMPP (Protocol)](https://xmpp.org/)** - Long-standing open messaging standard with many servers and clients, and OMEMO for end-to-end encryption.
  - **[Conversations](https://conversations.im/)** - XMPP client built for phones, with OMEMO encryption on by default. <sub>Android · [F-Droid](https://f-droid.org/packages/eu.siacs.conversations/)</sub>
  - **[Dino](https://dino.im/)** - Desktop XMPP client with OMEMO and OpenPGP end-to-end encryption. <sub>Linux · GPL-3.0</sub>
  - **[Gajim](https://gajim.org/)** - Desktop XMPP client with OMEMO encryption. <sub>Linux · macOS · Windows · GPL-3.0</sub>
  - **[Snikket](https://snikket.org/)** - Self-hosted XMPP service you set up with one command, with matching apps for your family or group. <sub>self-host · Apache-2.0 · [F-Droid](https://f-droid.org/packages/org.snikket.android/)</sub>
- **[Matrix (Protocol)](https://matrix.org/)** - Open standard for federated chat and calls, with end-to-end encryption between clients. <sub>Apache-2.0</sub>
  - **[Cinny](https://cinny.in/)** - Matrix client with a clean, minimal interface. <sub>AGPL-3.0</sub>
  - **[Element](https://element.io/)** - The flagship Matrix client, with end-to-end encryption on by default for private chats. `⚠️ website trackers` <sub>AGPL-3.0</sub>
- **[Session](https://getsession.org/)** - Messenger that needs no phone number and routes messages through an onion network of community-run nodes. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/network.loki.messenger.fdroid/)</sub>
- **[SimpleX Chat](https://simplex.chat/)** - Messenger with no user IDs at all, so its servers can't see who talks to whom. <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/chat.simplex.app/)</sub>

#### Centralized

One provider runs the servers, which is a single point of failure and control. That can still be trustworthy when the protocol and code are open and audited.

- **[Signal](https://signal.org/)** - Messenger with end-to-end encryption for everything by default, run by a nonprofit that keeps almost no user data. <sub>AGPL-3.0</sub>
- **[Threema](https://threema.com/en)** - Paid messenger from Switzerland that works without a phone number or email. <sub>AGPL-3.0</sub>
- **[Wire](https://wire.com/)** - End-to-end encrypted messaging, calls and file sharing, with public and audited code for both the apps and the server. `⚠️ website trackers` <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.wire/) (Play Store version has trackers)</sub>

#### P2P

Messages go straight from one device to another, with no server to control or fail. You lose some features and delivery can be slower, but it's the strongest option for sensitive chats.

- **[Berty](https://berty.tech/)** - Peer-to-peer messenger that works with or without internet access, with no phone number or email.
- **[Briar](https://briarproject.org/)** - Peer-to-peer messenger that syncs over Tor, Wi-Fi or Bluetooth, so it keeps working when the internet is down.
- **[Tinfoil Chat](https://github.com/maqp/tfc)** - Onion-routed messaging system that keeps keys on separate, isolated computers to resist endpoint compromise.
- **[Tox](https://tox.chat/)** - Peer-to-peer protocol for encrypted chat and calls, with no central servers or accounts. <sub>GPL-3.0</sub>

---

### Mail Services

Free webmail is paid for with your data. And email itself was never built for privacy: unless both sides use the same encrypted provider or [PGP](https://ssd.eff.org/module/deep-dive-end-end-encryption-how-do-public-key-encryption-systems-work), every message reaches the provider in a readable form, and the sender and their provider keep a copy too. A provider that encrypts your mailbox protects what's stored there afterwards, from a breach or a later request for your data, not the message on its way in. So pick one that doesn't profile you, asks for as little as possible about you, and encrypts what it stores, or run your own server. For anything really sensitive, use an encrypted messenger instead.

> [!TIP]
> An old mailbox is an archive of your life on someone else's server. Moving mail you've dealt with to your own encrypted device limits what a breach or a court order can expose. [Here's why and how](https://xn--gckvb8fzb.com/inbox-zero-for-privacy-not-productivity/).

🚫 **Avoid**

- **Gmail**: in 2019 Google was found listing every purchase from your Gmail receipts, even after the emails were deleted. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.cnbc.com/2019/07/05/google-gmail-purchase-history-cant-be-deleted.html)</sub>
- **Outlook**: since 2023 the new Outlook app sends your other accounts' IMAP passwords and mail to Microsoft's servers. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.microsoft.office.outlook/latest/) · [Source](https://www.heise.de/en/news/Microsoft-lays-hands-on-login-data-Beware-of-the-new-Outlook-9608798.html)</sub>
- **Yahoo! Mail**: in 2015 Yahoo secretly scanned all users' incoming mail for US intelligence, Reuters reported. <sub>[ToS;DR](https://tosdr.org/en/service/309) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.yahoo.mobile.client.android.mail/latest/) · [Source](https://finance.yahoo.com/news/exclusive-yahoo-secretly-scanned-customer-170557779.html)</sub>
- **Yandex Mail**: in 2019 Russia's FSB demanded that Yandex hand over the encryption keys for Yandex Mail. <sub>[ToS;DR](https://tosdr.org/en/service/860) · [Source](https://www.themoscowtimes.com/2019/06/04/russias-yandex-pushes-back-against-pressure-to-share-encryption-keys-2-a65870)</sub>

✅ **Use instead**

#### Third-party

A company or organization runs it for you: sign up and use it. It's the easiest way to start, but you trust them with your data, so look for end-to-end encryption and a good track record.

- **[Forward Email](https://forwardemail.net)** - Email forwarding and hosting for your own domain, with its server code published. `⚠️ source-available`
- **[mailbox.org](https://mailbox.org/)** - Paid email, calendar and office suite from Germany, with built-in PGP encryption and no ads.
- **[Mailfence](https://mailfence.com)** - Email suite from Belgium with built-in OpenPGP encryption.
- **[Posteo](https://posteo.de/en)** - Ad-free email from Germany, funded only by its users, with optional encrypted storage and sign-up and payment that need no personal details.
- **[Proton Mail](https://proton.me/mail)** - Email from Switzerland, end-to-end encrypted between Proton users and with PGP, and stored encrypted otherwise, where a court order can still force it to log your IP ([2021 case](https://proton.me/blog/climate-activist-arrest)). <sub>GPL-3.0</sub>
- **[Riseup](https://riseup.net/en/about-us)** - Email and other tools for activists, run by a collective that doesn't log your IP address.
- **[Tuta](https://tuta.com/)** - Email and calendar from Germany, end-to-end encrypted between Tuta users, that stores everything encrypted, subject lines included. <sub>GPL-3.0</sub>

#### Self-hosted

You install and run it yourself, on a computer at home or a rented server. Your data stays with you, but setup, updates and backups are up to you.

- **[Docker Mailserver](https://docker-mailserver.github.io/docker-mailserver/latest/)** - Complete mail server (SMTP, IMAP, antispam, antivirus) in a single Docker container, configured with files. <sub>self-host · MIT</sub>
- **[Mail-in-a-box](https://mailinabox.email/)** - Turns a fresh Ubuntu server into a complete mail server with one setup script. <sub>self-host · CC0-1.0</sub>
- **[Mailcow: dockerized](https://mailcow.email)** - Docker-based mail server suite with a web admin panel, webmail and groupware. <sub>self-host · GPL-3.0</sub>
- **[Mox](https://www.xmox.nl)** - Self-contained mail server in a single binary, built to need little maintenance. <sub>self-host · MIT</sub>
- **[Stalwart](https://stalw.art/)** - All-in-one mail and collaboration server in Rust covering SMTP, IMAP and JMAP, with two independent security audits. <sub>self-host</sub>

#### Clients

Email is an open standard, so these apps work with most providers, including the ones above. Proton Mail needs its Bridge app for that, and Tuta only works in its own apps.

##### Android / iOS

- **[FairEmail](https://email.faircode.eu/)** - Full-featured email app that blocks tracking images and keeps everything on your device. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/eu.faircode.email/)</sub>
- **[Thunderbird for Android](https://www.thunderbird.net/en-US/mobile/)** - Mozilla's email app for Android, built on K-9 Mail, which still ships from the same code. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/net.thunderbird.android/)</sub>

##### Desktop

- **[NeoMutt](https://neomutt.org/)** - Terminal email client with built-in PGP/GPG support, a maintained fork of Mutt. <sub>Linux · macOS · CLI · GPL-2.0</sub>
- **[Thunderbird](https://www.thunderbird.net)** - Email, calendar and contacts app with built-in OpenPGP encryption ([setup guide](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq)).

#### Email Alias Services (Anonymous Forwarding)

An alias service gives you a different address for each website, forwarded to your real inbox, so you can cut off spam and see who leaked your address. You can use their hosted service or run your own.

- **[addy.io](https://addy.io)** - Email alias and forwarding service you can host yourself, formerly AnonAddy. <sub>self-host · AGPL-3.0</sub>
- **[SimpleLogin](https://simplelogin.io)** - Email alias service you can host yourself, owned by Proton. <sub>self-host · AGPL-3.0</sub>

---

### Online Phone Providers

Many sites demand a phone number for verification, which ties your account to your real identity. These paid services give you a number to receive (and sometimes send) SMS without handing over your own.

#### No email verification, accepting monero

- **[Crypton](https://crypton.sh/)** - Rents real SIM cards hosted in the cloud, with incoming SMS encrypted under a key you choose.
- **[MoneroSMS](https://monerosms.com/)** - Virtual numbers for sending and receiving SMS, paid in Monero, with a web app, a CLI and Tor support.

#### Email verification required, accepting monero

- **[Onlinesim](https://onlinesim.io/)** - Temporary virtual numbers for receiving verification codes. `⚠️ website trackers`

#### Email verification required, accepting crypto

- **[SmsPVA](https://smspva.com/)** - Temporary virtual numbers in many countries for receiving verification codes. `⚠️ website trackers`

---

### Video and Audio Conferencing

The big meeting apps log who you call and when, and their apps ship with ad and analytics trackers. Prefer tools you can self-host or that connect participants directly, with encryption you don't have to trust a company for.

🚫 **Avoid**

- **Zoom**: paid $85 million in 2021 to settle claims it shared user data with Facebook, Google and LinkedIn. <sub>[ToS;DR](https://tosdr.org/en/service/2198) · [Source](https://www.cnbc.com/2021/08/01/zoom-reaches-85-million-settlement-over-user-privacy-and-hacker-zoombombing.html)</sub>
- **Google Meet**: calls run through Google and are tied to your Google account. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>
- **Microsoft Teams**: meetings are tied to a Microsoft account, under a very poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/244)</sub>
- **WhatsApp**: in 2021 Ireland fined it €225 million for not properly explaining what data it shares with Facebook. <sub>[ToS;DR](https://tosdr.org/en/service/198) · [Source](https://www.dataprotection.ie/en/news-media/press-releases/data-protection-commission-announces-decision-whatsapp-inquiry)</sub>
- **Discord**: a 2025 breach at a support vendor exposed government ID photos of about 70,000 users. <sub>[ToS;DR](https://tosdr.org/en/service/536) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.discord/latest/) · [Source](https://discord.com/press-releases/update-on-security-incident-involving-third-party-customer-service)</sub>

✅ **Use instead**

- **[BigBlueButton](https://bigbluebutton.org/)** - Self-hosted web conferencing built for online classes, with whiteboard, breakout rooms and recordings. `⚠️ website trackers` <sub>self-host · LGPL-3.0</sub>
- **[Briefing](https://brie.fi/ng)** - Group video chat in the browser over direct WebRTC connections, with no account. <sub>self-host · AGPL-3.0</sub>
- **[Chitchatter](https://chitchatter.im/)** - Serverless, ephemeral peer-to-peer chat with audio, video, screen and file sharing. <sub>GPL-2.0</sub>
- **[Jami](https://jami.net/)** - Peer-to-peer audio and video calls and chat with no central servers or account needed. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/cx.ring/)</sub>
- **[Jitsi Meet](https://jitsi.org/jitsi-meet/)** - Video conferencing you can self-host; the official instance requires you to log in. <sub>self-host · Apache-2.0 · [F-Droid](https://f-droid.org/packages/org.jitsi.meet/) (Play Store version has trackers)</sub>
- **[MiroTalk P2P](https://p2p.mirotalk.com/)** - Browser-based peer-to-peer video calls up to 4K, with nothing to install. <sub>AGPL-3.0</sub>
- **[Mumble](https://www.mumble.info/)** - Low-latency voice chat with encrypted connections, on servers you can run yourself. <sub>self-host</sub>
- **[Nextcloud Talk](https://nextcloud.com/talk/)** - Video calls and chat that run inside your own Nextcloud server. <sub>self-host · AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.nextcloud.talk2/)</sub>

#### Alternative clients/modifications of Discord

An unofficial app for a service you already use, usually without its ads or tracking. Your account stays with that service, and using an unofficial app can break its rules.

> [!WARNING]
> Discord still sees your IP and your messages, which are not end-to-end encrypted.\
> Client mods [violate](https://x.com/discord/status/1006178587731550208) the [Discord ToS](https://discord.com/terms), so your account could be suspended, although this has [not been enforced so far](https://github.com/GooseMod/GooseMod/wiki/FAQ#is-goosemod-against-discord-tos).

- **[Aliucord](https://github.com/Aliucord/Aliucord)** - Mod for the Android Discord app that [disables Discord's tracking](https://github.com/Aliucord/Aliucord/blob/main/Aliucord/src/main/java/com/aliucord/coreplugins/NoTrack.java). <sub>Android · OSL-3.0</sub>
- **[BetterDiscord](https://betterdiscord.app/)** - Discord client mod; add the [DoNotTrack](https://betterdiscord.app/plugins/DoNotTrack) plugin to block trackers. <sub>Apache-2.0</sub>
- **[Legcord](https://legcord.app)** - Lightweight Discord client that blocks Discord's known trackers by default, formerly ArmCord. <sub>OSL-3.0</sub>
- **[OpenAsar](https://openasar.dev/)** - Drop-in replacement for part of the Discord desktop app, with a [No Tracking](https://github.com/GooseMod/OpenAsar#readme) option that turns off crash and error reporting. <sub>AGPL-3.0</sub>
- **[Replugged](https://replugged.dev/)** - Discord client mod that continues the discontinued Powercord. <sub>MIT</sub>
- **[Vencord](https://vencord.dev)** - Discord client mod with plugins, including one that blocks Discord's tracking. <sub>GPL-3.0</sub>
- **[Vesktop](https://vesktop.dev/)** - Desktop Discord client with Vencord built in, which blocks Discord's telemetry. <sub>GPL-3.0</sub>
- **[WebCord](https://github.com/SpacingBat3/WebCord)** - Discord client that loads the web app in Electron instead of using the Discord API, with extra privacy settings. <sub>MIT</sub>

---

### Teamworking Tools

Workplace chat holds your team's most sensitive conversations on someone else's servers. Prefer tools you can host yourself, so the messages and files stay with your organization.

🚫 **Avoid**

- **Slack**: your messages feed its recommendation models unless a workspace owner emails Slack to opt out. <sub>[ToS;DR](https://tosdr.org/en/service/206) · [Source](https://slack.com/trust/data-management/privacy-principles)</sub>
- **Google Meet**: calls run through Google and are tied to your Google account. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>
- **Microsoft Teams**: chats aren't end-to-end encrypted, under a very poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/244)</sub>
- **Discord**: a 2025 breach at a support vendor exposed government ID photos of about 70,000 users. <sub>[ToS;DR](https://tosdr.org/en/service/536) · [Source](https://discord.com/press-releases/update-on-security-incident-involving-third-party-customer-service)</sub>

✅ **Use instead**

- **[Mattermost](https://mattermost.com/)** - Self-hosted Slack alternative for teams. `⚠️ website trackers` <sub>self-host</sub>
- **[Nextcloud Talk](https://nextcloud.com/talk/)** - Chat and video calls that run inside your own Nextcloud server. <sub>self-host · AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.nextcloud.talk2/)</sub>
- **[Rocket.Chat](https://www.rocket.chat/)** - Self-hosted team chat with end-to-end encrypted rooms and federation. `⚠️ website trackers` <sub>self-host</sub>
- **[Stoat](https://stoat.chat/)** - Discord-like chat platform with servers and channels, which you can host yourself, formerly Revolt. <sub>self-host</sub>
- **[Twake Chat](https://twake.app/)** - Workplace chat built on Matrix, part of Linagora's Twake Workplace suite. <sub>AGPL-3.0</sub>
- **[Wire](https://wire.com/)** - End-to-end encrypted messaging, calls and file sharing for teams, with public and audited code for both the apps and the server. `⚠️ website trackers` <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.wire/) (Play Store version has trackers)</sub>
- **[Zulip](https://zulip.com/)** - Team chat organized into topic threads, which you can host yourself. <sub>self-host · Apache-2.0 · [F-Droid](https://f-droid.org/packages/com.zulipmobile/)</sub>

Discord mods and alternative clients, and the risks of using them, are listed under [Alternative clients/modifications of Discord](#alternative-clientsmodifications-of-discord).

---

### Social Networks and Platforms

The big platforms profile you from everything you read, watch and like, and their feeds are built to keep you there. Federated networks let you choose your server and still reach everyone, and alternative frontends let you read the big sites without an account or their tracking.

> [!NOTE]
> **The fediverse**
>
> The fediverse is a network of independent servers and apps that talk to each other over the open ActivityPub protocol. You can follow people on any of them from whichever one you join, and move elsewhere if you're unhappy. [This video by Framasoft](https://framatube.org/w/9dRFC6Ya11NCVeYKn8ZhiD?start=8s) explains the idea.
>
> Apps that speak ActivityPub carry the `ActivityPub` badge.

> [!NOTE]
> **Alternative frontends and clients**
>
> Frontends let you read these services without an account, ads or their scripts. The service still sees requests for the content you view, and only frontends that route everything through their own server hide your IP address from it. Public instances get blocked often, so expect to switch instances or self-host.
>
> These tools redirect links to alternative frontends automatically:
> - [LibRedirect](https://github.com/libredirect/browser_extension#get): browser extension that sends YouTube, Reddit, X and other links to alternative frontends.
> - [UntrackMe](https://www.f-droid.org/en/packages/app.fedilab.nitterizeme/): Android app that rewrites YouTube, Twitter and other links to their open source alternatives.

#### Blogging platforms (Medium)

🚫 **Avoid**

- **Medium**: the site carries trackers, under a poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/1003)</sub>
- **Blogger**: owned by Google, with Google trackers and ads. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

- **[Plume](https://joinplu.me/)** - Federated blogging engine where readers can follow and comment from any ActivityPub account. `💀 inactive` <sub>ActivityPub</sub>
- **[WriteFreely](https://writefreely.org/)** - Minimal, distraction-free blogging platform that can federate posts over ActivityPub. <sub>ActivityPub · AGPL-3.0</sub>

#### Instagram

🚫 **Avoid**

- **Instagram**: Ireland fined Meta €405 million in 2022 for exposing children's emails and phone numbers on Instagram. <sub>[ToS;DR](https://tosdr.org/en/service/219) · [Source](https://www.dataprotection.ie/en/news-media/press-releases/data-protection-commission-announces-decision-instagram-inquiry)</sub>

✅ **Use instead**

- **[Pixelfed](https://pixelfed.org/)** - Federated photo sharing with posts, stories and a chronological feed, without ads. <sub>ActivityPub · AGPL-3.0</sub>

#### YouTube

🚫 **Avoid**

- **YouTube**: Google paid a record $170 million in 2019 for collecting children's data on YouTube without parental consent. <sub>[ToS;DR](https://tosdr.org/en/service/274) · [Source](https://www.ftc.gov/news-events/news/press-releases/2019/09/google-youtube-will-pay-record-170-million-alleged-violations-childrens-privacy-law)</sub>

✅ **Use instead**

- **[PeerTube](https://joinpeertube.org/en/)** - Federated video hosting where anyone can run an instance and follow channels across others. <sub>ActivityPub · AGPL-3.0</sub>

##### Frontends

- **[Invidious](https://invidious.io/)** - YouTube frontend with no ads or Google scripts and subscriptions without an account; see the [public instances](https://docs.invidious.io/instances/). <sub>AGPL-3.0</sub>
- **[Piped](https://github.com/TeamPiped/Piped)** - YouTube frontend that never connects your browser to Google, with feeds, playlists and SponsorBlock. <sub>AGPL-3.0</sub>
- **[ViewTube](https://github.com/ViewTube/viewtube)** - YouTube frontend without ads or tracking, with its own accounts, subscriptions and SponsorBlock. <sub>AGPL-3.0</sub>
- **[youtube-local](https://github.com/user234683/youtube-local)** - YouTube client that runs on your computer and opens in the browser, with local subscriptions and optional routing through Tor. <sub>Desktop · AGPL-3.0</sub>

##### Apps

- **[FreeTube](https://freetubeapp.io/)** - Desktop YouTube app that keeps subscriptions, playlists and history on your computer, without Google's cookies or scripts. <sub>Desktop · AGPL-3.0</sub>
- **[LibreTube](https://libretube.dev/)** - Android YouTube app that fetches videos through Piped instead of Google's servers. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.github.libretube/)</sub>
- **[NewPipe](https://newpipe.net/)** - Lightweight Android YouTube app with background play and downloads, no Google services or account needed. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.schabi.newpipe/)</sub>
- **[SkyTube](https://github.com/SkyTubeTeam/SkyTube)** - Android YouTube app with local subscriptions, downloads and a channel and video blocker. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/free.rm.skytube.oss/)</sub>
- **[Yattee](https://github.com/yattee/yattee)** - Native YouTube player for iPhone, iPad, Apple TV and Mac that works through Invidious or Piped. <sub>iOS · macOS · AGPL-3.0</sub>

#### Twitter

🚫 **Avoid**

- **Twitter (X)**: paid $150 million in 2022 for using phone numbers given for account security to target ads. <sub>[ToS;DR](https://tosdr.org/en/service/195) · [Source](https://www.ftc.gov/news-events/news/press-releases/2022/05/ftc-charges-twitter-deceptively-using-account-security-data-sell-targeted-ads)</sub>

✅ **Use instead**

##### Decentralized

- **[Mastodon](https://joinmastodon.org/)** - Federated microblogging, the largest network in the fediverse. <sub>ActivityPub · AGPL-3.0 · [F-Droid](https://f-droid.org/packages/org.joinmastodon.android/)</sub>
  - **[Mastodon Apps](https://joinmastodon.org/apps)** - Official directory of Mastodon apps for Android, iOS, web and desktop.
- **[Nostr](https://nostr.com/)** - Open protocol where posts are signed with your own keys and spread across relays, so no single server controls your account.
- **[Pleroma](https://git.pleroma.social/pleroma/pleroma)** - Lightweight federated social network server. <sub>ActivityPub</sub>
  - **[Soapbox](https://gitlab.com/soapbox-pub/soapbox-fe)** - Web frontend for Pleroma focused on custom branding and ease of use.

##### Frontends

- **[Nitter](https://github.com/zedeus/nitter)** - Twitter frontend without JavaScript or ads that proxies every request; see the [instances list](https://github.com/zedeus/nitter/wiki/Instances). `💀 inactive` <sub>AGPL-3.0</sub>
- **[Squawker](https://github.com/j-fbriere/squawker)** - Android Twitter client with no account, tracking or ads, keeping subscriptions on the device; the maintained fork of Fritter. <sub>Android · MIT · [F-Droid](https://f-droid.org/packages/org.ca.squawker/)</sub>

#### Reddit

🚫 **Avoid**

- **Reddit**: sold Google the right to train AI on users' posts in a 2024 deal valued at about $60 million. <sub>[ToS;DR](https://tosdr.org/en/service/194) · [Source](https://www.cbsnews.com/news/google-reddit-60-million-deal-ai-training/)</sub>

✅ **Use instead**

##### Alternatives

- **[Lemmy](https://join-lemmy.org/)** - Federated link aggregator and discussion forum, organized into communities like subreddits. <sub>ActivityPub · AGPL-3.0</sub>
- **[Mbin](https://joinmbin.org/)** - Federated link aggregator with microblogging, the community-run continuation of kbin. <sub>ActivityPub · AGPL-3.0</sub>

##### Apps and frontends

- **[Redlib](https://github.com/redlib-org/redlib)** - Reddit frontend without JavaScript that proxies all requests, media included; see the [instances](https://github.com/redlib-org/redlib-instances). Formerly Libreddit. <sub>AGPL-3.0</sub>

#### Streaming Platforms (Twitch)

🚫 **Avoid**

- **Twitch**: a 2021 breach leaked 125GB of its data, including source code and three years of creator payouts. <sub>[ToS;DR](https://tosdr.org/en/service/200) · [Source](https://fortune.com/2021/10/06/twitch-data-leak-hack-source-code-creator-payouts-4chan/)</sub>

✅ **Use instead**

- **[Owncast](https://owncast.online/)** - Self-hosted live streaming server with built-in chat, so you own the stream and your viewers' data. <sub>self-host · MIT</sub>

##### Apps

- **[Twire](https://github.com/twireapp/Twire)** - Android Twitch client with built-in ad blocking, VODs with chat replay, and optional login. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.perflyst.twire/)</sub>

#### Imgur

🚫 **Avoid**

- **Imgur**: a 2014 hack stole about 1.7 million email addresses and passwords, which it only learned of in 2017. <sub>[ToS;DR](https://tosdr.org/en/service/325) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.imgur.mobile/latest/) · [Source](https://techcrunch.com/2017/11/27/imgur-says-1-7m-emails-and-passwords-were-breached-in-2014-hack/)</sub>

✅ **Use instead**

- **[rimgo](https://codeberg.org/rimgo/rimgo)** - Read-only Imgur frontend that works without JavaScript; see the [instances](https://rimgo.codeberg.page/).

#### IMDb

🚫 **Avoid**

- **IMDb**: owned by Amazon, with 8 trackers in its Android app. <sub>[ToS;DR](https://tosdr.org/en/service/313) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.imdb.mobile/latest/)</sub>

✅ **Use instead**

- **[libremdb](https://github.com/zyachel/libremdb)** - IMDb frontend without ads or tracking that proxies images and video through the instance. <sub>self-host · AGPL-3.0</sub>

#### Fandom

🚫 **Avoid**

- **Fandom**: wikis loaded with ads and autoplaying video, and 8 trackers in the app. <sub>[ToS;DR](https://tosdr.org/en/service/2256) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.fandom.app/latest/)</sub>

✅ **Use instead**

- **[BreezeWiki](https://breezewiki.com/)** - Fandom frontend that strips ads, video and suggested content; also on several [mirrors](https://docs.breezewiki.com/Links.html). <sub>self-host</sub>

---

### Commenting Engines

Embedded comment widgets load third-party trackers on every page that uses them, profiling your readers across sites. A self-hosted engine keeps comments and reader data on your own server.

🚫 **Avoid**

- **Disqus**: tracked visitors across sites for ad profiling without consent, Norway's regulator said in 2021. <sub>[ToS;DR](https://tosdr.org/en/service/239) · [Source](https://www.datatilsynet.no/en/news/2021/intent-to-issue--25-million-fine-to-disqus-inc/)</sub>

✅ **Use instead**

- **[Comentario](https://comentario.app)** - Small self-hosted comment engine that adds discussions to static pages. <sub>self-host · MIT</sub>
- **[Disgus](https://github.com/carlitoplatanito/disgus)** - Embeddable comments for your website, stored on Nostr instead of a company's servers. <sub>GPL-2.0</sub>
- **[Giscus](https://giscus.app)** - Comments stored in GitHub Discussions, with no database, ads or tracking; readers need a GitHub account to post. <sub>MIT</sub>
- **[Isso](https://isso-comments.de)** - Lightweight self-hosted comment server, meant as a drop-in replacement for Disqus. <sub>self-host · MIT</sub>
- **[Remark42](https://remark42.com)** - Lightweight self-hosted comment engine that doesn't track your readers. <sub>self-host · MIT</sub>

---

### Translation

Online translators keep the text you paste in, which often includes private messages and documents. Translating on your own device, or through a self-hosted or proxy frontend, keeps that text away from big providers.

🚫 **Avoid**

- **Google Translate**: sends everything you translate to Google. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>
- **DeepL**: the free version may train on your texts, and its terms forbid entering any personal data. <sub>[ToS;DR](https://tosdr.org/en/service/2073) · [Source](https://www.deepl.com/en/terms-of-use)</sub>
- **Bing Translator**: sends everything you translate to Microsoft. <sub>[ToS;DR](https://tosdr.org/en/service/244)</sub>

✅ **Use instead**

#### Text translation

- **[Apertium](https://apertium.org/)** - Rule-based machine translation platform that can run offline on your computer. <sub>GPL-2.0</sub>
- **[LibreTranslate](https://libretranslate.com/)** - Self-hosted machine translation API and web app with no ties to proprietary services. <sub>self-host · AGPL-3.0</sub>
- **[Linguist](https://linguister.io)** - Browser extension for translating pages and selected text, with a built-in offline translator and [custom translators](https://linguister.io/docs/CustomTranslator). <sub>Browser · BSD-3-Clause</sub>
- **[Softcatala](https://www.softcatala.org/traductor/)** - Online translator between Catalan and languages such as Spanish, English, French and Portuguese, run by a nonprofit. `⚠️ website trackers`

#### Alternative Google Translate frontends

A website that shows content from a service, like videos or articles, without its account, ads or scripts. The service still sees what you view, and only frontends that relay everything through their own server hide your IP address. Public instances get blocked often, so expect to switch or self-host.

- **[Mozhi](https://codeberg.org/aryak/mozhi)** - Frontend that proxies Google Translate, DeepL, Yandex and other engines behind one interface. <sub>self-host</sub>
- **[SimplyTranslate](https://simplytranslate.org/)** - Frontend that proxies your requests to Google Translate and other engines. <sub>self-host</sub>

---

### RSS Readers

These services build a profile from everything you read. A local or self-hosted reader fetches feeds directly, so nobody sees your reading list.

🚫 **Avoid**

- **Google News**: records what you read for Google's profile of you. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

- **[Capy Reader](https://github.com/jocmp/capyreader)** - Small RSS reader, local or synced with Miniflux and FreshRSS. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.capyreader.app/) (Play Store version has trackers)</sub>
- **[Feeder](https://github.com/spacecowboy/Feeder)** - RSS reader that fetches feeds directly on your device, with no account. <sub>Android · GPL-3.0</sub>
- **[Fluent Reader](https://github.com/yang991178/fluent-reader)** - Desktop RSS reader that keeps your feeds locally, with optional sync to self-hosted services. <sub>Linux · Windows · macOS · BSD-3-Clause</sub>
- **[FreshRSS](https://freshrss.org/)** - Self-hosted feed aggregator with a web interface, multi-user support and an API for mobile apps. <sub>self-host · AGPL-3.0</sub>
- **[Miniflux](https://miniflux.app/)** - Minimalist self-hosted feed reader with no tracking, written in Go. <sub>self-host · Apache-2.0</sub>
- **[NetNewsWire](https://netnewswire.com/)** - RSS reader for Mac, iPhone and iPad that works locally or syncs with self-hosted services. <sub>macOS · iOS · MIT</sub>
- **[Newsboat](https://newsboat.org/)** - RSS reader for the terminal, configured with plain text files. <sub>Linux · macOS · CLI · MIT</sub>
- **[NewsFlash](https://gitlab.com/news-flash/news_flash_gtk)** - RSS reader for Linux that works locally or with self-hosted services such as Miniflux and FreshRSS. <sub>Linux · GPL-3.0</sub>
- **[Read You](https://github.com/ReadYouApp/ReadYou)** - Material You RSS reader, local or synced with self-hosted services. <sub>Android · GPL-3.0</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 🌐 Networking & Web

### VPNs

A VPN doesn't make you anonymous; it moves the trust from your ISP to the VPN provider. Pick one that asks for no personal details, takes anonymous payment and publishes the source of its apps.

🚫 **Avoid**

- **Free VPNs**: a 2017 study of 283 Android VPN apps found 75% used trackers and 38% contained malware. <sub>[Source](https://torrentfreak.com/researchers-issue-security-warning-over-android-vpn-apps-170125/)</sub>

✅ **Use instead**

- **[Amnezia VPN](https://amnezia.org)** - VPN client that sets up a server on a VPS you rent, with protocols designed to get past censorship. <sub>self-host · GPL-3.0</sub>
- **[Find more at kycnot.me (VPN Category)](https://kycnot.me/?categories=vpn)** - Directory of VPN providers that don't ask for identity documents.
- **[IVPN](https://ivpn.net)** - No-logs VPN that needs no email to sign up and takes cash, Monero or Bitcoin. <sub>[F-Droid](https://f-droid.org/packages/net.ivpn.client/)</sub>
- **[Mullvad VPN](https://mullvad.net)** - No-logs VPN with anonymous numbered accounts instead of email, payable in cash or cryptocurrency. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/net.mullvad.mullvadvpn/)</sub>
- **[nadanada](https://nadanada.me)** - Pay-per-use WireGuard VPN with no account, payable in Bitcoin, Monero and other cryptocurrencies, formerly LNVPN.
- **[Proton VPN](https://protonvpn.com)** - Swiss no-logs VPN with audited apps and a free tier with no data cap. `⚠️ telemetry opt-out` <sub>[F-Droid](https://f-droid.org/packages/ch.protonvpn.android/)</sub>
- **[SPN](https://safing.io/spn/)** - Paid add-on to the Portmaster firewall that routes each app's connections over separate multi-hop paths. <sub>Linux · Windows · GPL-3.0</sub>

---

### Web Browser

Your browser sees everything you do online, and the big ones are built by ad and data companies. Prefer one that blocks trackers out of the box and doesn't tie your browsing to an account.

🚫 **Avoid**

- **Google Chrome**: Google agreed in 2024 to delete billions of records it collected from people browsing in Incognito. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.nbcnews.com/tech/tech-news/google-destroy-browsing-data-settle-consumer-privacy-lawsuit-rcna145881)</sub>
- **Microsoft Edge**: in 2023 an on-by-default feature sent nearly every page address you visited to Microsoft's Bing. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.microsoft.emmx/latest/) · [Source](https://9to5google.com/2023/04/26/microsoft-edge-bing-urls/)</sub>
- **Opera**: 6 trackers in its Android app, and owned by a Chinese consortium since 2016. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.opera.browser/latest/) · [Source](https://en.wikipedia.org/wiki/Opera_(web_browser))</sub>

✅ **Use instead**

#### Android / iOS

- **[Brave](https://brave.com/)** - Chromium-based browser that blocks ads and trackers out of the box. `⚠️ telemetry opt-out` <sub>MPL-2.0</sub>
- **[Cromite](https://github.com/uazo/cromite)** - Chromium fork, successor to Bromite, with built-in ad blocking and anti-fingerprinting measures. <sub>Android · Linux · Windows · GPL-3.0</sub>
- **[Firefox](https://www.firefox.com/en-US/mobile/)** - Mozilla's browser, with its own engine on Android and Enhanced Tracking Protection on by default. `⚠️ website trackers` `⚠️ telemetry opt-out`
  - **[IronFox](https://gitlab.com/ironfox-oss/IronFox)** - Hardened Firefox for Android with proprietary blobs removed, a fork of the discontinued Mull. <sub>Android</sub>
- **[Privacy Browser](https://www.stoutner.com/privacy-browser-android/)** - Browser that keeps JavaScript, cookies and other tracking features off until you allow them per site. <sub>Android</sub>
- **[Tor Browser](https://www.torproject.org/)** - Hardened Firefox that routes your traffic through the Tor network to resist tracking and censorship. <sub>Android · Linux · macOS · Windows</sub>
- **[Vanadium](https://grapheneos.org/features#vanadium)** - Hardened Chromium from the GrapheneOS project, and the default browser on GrapheneOS. <sub>Android</sub>

#### Desktop

> [!TIP]
> The [Hitchhiker's Guide to Online Anonymity](https://anonymousplanet.net/guide/#hardening-browsers) explains how to harden your browser. If you don't understand a change, leave it alone; it can hurt your privacy more than it helps.

- **[Brave](https://brave.com/)** - Chromium-based browser that blocks ads and trackers out of the box. `⚠️ telemetry opt-out` <sub>MPL-2.0</sub>
- **[Firefox](https://www.firefox.com/en-US/)** - Independent browser from Mozilla that needs some [hardening](https://anonymousplanet.net/guide/#hardening-firefox) for strong privacy. `⚠️ website trackers` `⚠️ telemetry opt-out`
  - **[LibreWolf](https://librewolf.net/)** - Firefox fork with telemetry removed, stricter defaults and uBlock Origin built in. <sub>Linux · macOS · Windows</sub>
- **[Floorp](https://floorp.app/)** - Firefox fork with telemetry disabled and extensive layout customization. <sub>Linux · macOS · Windows · MPL-2.0</sub>
- **[Mullvad Browser](https://mullvad.net/en/browser/)** - Tor Browser's anti-fingerprinting without the Tor network, made by the Tor Project and Mullvad. <sub>Linux · macOS · Windows</sub>
- **[Tor Browser](https://www.torproject.org/)** - Hardened Firefox that routes your traffic through the Tor network to resist tracking and censorship. <sub>Android · Linux · macOS · Windows</sub>
- **[Ungoogled Chromium](https://github.com/ungoogled-software/ungoogled-chromium)** - Chromium with Google's web services and background requests stripped out. <sub>Linux · macOS · Windows · BSD-3-Clause</sub>
- **[Zen Browser](https://zen-browser.app/)** - Firefox-based browser with vertical tabs and workspaces, keeping Firefox's tracking protection on by default. <sub>Linux · macOS · Windows · MPL-2.0</sub>

#### Browser Addons

##### Anti-tracking

Read what an add-on does before installing it. A badly chosen one can hurt your privacy, and too many slow your browser down.

> [!TIP]
> In uBlock Origin, read about the [blocking modes](https://github.com/gorhill/uBlock/wiki/Blocking-mode) and pick one. Turning on EasyList Cookie under Filter lists > Annoyances hides most cookie banners.

- **[ClearURLs](https://clearurls.xyz/)** - Strips tracking parameters from links and URLs. <sub>Browser · LGPL-3.0</sub>
- **[LibRedirect](https://libredirect.manerakai.com/)** - Redirects YouTube, Reddit, Google Maps and other sites to privacy-friendly front ends, successor to Privacy Redirect. <sub>Browser · GPL-3.0</sub>
  - **[Predirect](https://github.com/pritkr/predirect)** - Similar extension built on Manifest V3 with minimal permissions, for Chromium browsers that no longer run older extensions. <sub>Browser · GPL-3.0</sub>
- **[Privacy Badger](https://privacybadger.org/)** - EFF extension that learns to block trackers by watching them follow you across sites. <sub>Browser</sub>
- **[uBlock Origin](https://github.com/gorhill/uBlock)** - Light, efficient ad and tracker blocker, in full only on Firefox since Chrome dropped Manifest V2 extensions. <sub>Browser · GPL-3.0</sub>

##### Useful Tools

- **[SingleFile](https://github.com/gildas-lormeau/SingleFile)** - Saves a complete web page as a single HTML file you can open offline. <sub>Browser · AGPL-3.0</sub>

#### Browser Sync

- **[xBrowserSync](https://www.xbrowsersync.org/)** - Syncs bookmarks between browsers with client-side encryption and no account, just a sync ID. `💀 inactive` <sub>GPL-3.0</sub>

---

### Search Engines

Your searches say more about you than almost anything else, and the big engines log them to build ad profiles. These don't profile you, and several run their own index instead of reselling Google's or Bing's results.

🚫 **Avoid**

- **Google**: police can get the IP address of everyone who searched a term from Google, a practice Colorado upheld in 2023. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://statecourtreport.org/our-work/analysis-opinion/colorado-supreme-court-upholds-controversial-google-keyword-warrant)</sub>
- **Bing**: in 2020 an unsecured Bing server exposed 6.5TB of logs with users' search queries and locations. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Source](https://www.wizcase.com/blog/bing-leak-research/)</sub>
- **Yahoo!**: a 2013 breach hit all 3 billion Yahoo accounts, which Yahoo admitted only in 2017. <sub>[ToS;DR](https://tosdr.org/en/service/309) · [Source](https://techcrunch.com/2017/10/03/yahoo-says-all-3b-accounts-were-impacted-by-2013-breach-not-1b-as-thought)</sub>
- **Yandex**: in 2025 researchers found its Android apps, Yandex Search among them, secretly linked browsing to device IDs. <sub>[ToS;DR](https://tosdr.org/en/service/860) · [Source](https://localmess.github.io/)</sub>

✅ **Use instead**

- **[Brave Search](https://search.brave.com)** - Search engine with [its own independent index](https://brave.com/search-independence/), from the makers of Brave.
- **[DuckDuckGo](https://duckduckgo.com)** - Search engine that doesn't build a profile on you, with results drawn largely from Bing.
- **[Marginalia](https://marginalia-search.com/)** - Independent search engine with its own crawler and index that favors text-heavy, non-commercial pages. <sub>self-host</sub>
- **[Mojeek](https://www.mojeek.com/)** - UK search engine with its own crawler and index and a no-tracking policy.
- **[Qwant](https://www.qwant.com/)** - French search engine, hosted in the EU, that doesn't track your searches.
- **[SearXNG](https://docs.searxng.org/)** - Metasearch engine that queries other search services for you; use a [public instance](https://searx.space/) or host your own. <sub>self-host · AGPL-3.0</sub>
- **[YaCy](https://yacy.net/)** - Peer-to-peer search engine where every user runs a node and shares the index.

---

### Domains & Hosting

Most registrars and hosts want your real identity and a card on file, which ties your site straight back to you. These accept anonymous signup and cryptocurrency payment.

- **[1984 Hosting](https://1984.hosting/)** - Icelandic hosting and domain registrar focused on civil liberties, with anonymous signup and Monero payment.
- **[Find more at kycnot.me (VPS Category)](https://kycnot.me/?categories=vps)** - Directory of VPS and hosting providers that don't ask for identity documents.
- **[OrangeWebsite](https://orangewebsite.com/)** - Icelandic web host focused on free speech, with anonymous signup and cryptocurrency or cash payment. `⚠️ website trackers`

---

### Link Shorteners

Hosted shorteners sit between every click and its destination, so they can log who opened what. Host your own, or use one that encrypts the target so the service can't read it.

🚫 **Avoid**

- **Bitly**: built to track every click for marketing analytics. <sub>[ToS;DR](https://tosdr.org/en/service/224)</sub>

✅ **Use instead**

- **[Kutt](https://kutt.to/)** - Shortener with custom domains and password-protected links that you can host yourself. <sub>self-host · MIT</sub>
- **[MagLit](https://maglit.me)** - Shortener that encrypts links with a password and also handles torrent magnet links. <sub>AGPL-3.0</sub>
- **[Shlink](https://shlink.io/)** - Self-hosted shortener that keeps its click statistics on your own server. <sub>self-host · MIT</sub>
- **[tnyr.me](https://tnyr.me)** - Shortener with passwordless end-to-end encryption, so the server can't see where links point. <sub>MIT</sub>
- **[YOURLS](https://yourls.org/)** - Self-hosted shortener written in PHP, with its own click stats and a plugin system. <sub>self-host · MIT</sub>

---

### Link in Bio Tools

Hosted link pages put your profile and everyone who visits it on someone else's platform. These let you host the page yourself, or link your accounts with cryptographic proofs instead.

- **[Keyoxide](https://keyoxide.org/)** - Proves you own your online accounts with cryptographic signatures, with no central service to trust. <sub>[F-Droid](https://f-droid.org/packages/org.keyoxide.keyoxide/)</sub>
- **[LinkStack](https://linkstack.org/)** - Linktree alternative you host yourself. <sub>self-host · AGPL-3.0</sub>

---

### Captchas

Mainstream captchas tell humans from bots by profiling visitors. These make the visitor's browser solve a small proof-of-work puzzle instead, with no tracking needed.

🚫 **Avoid**

- **Google reCAPTCHA**: its own docs tell sites to run it in the background of their pages, not just on forms. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://developers.google.com/recaptcha/docs/v3)</sub>
- **hCaptcha**: its privacy policy says it supplies the answers visitors give to its puzzles as AI training data. <sub>[ToS;DR](https://tosdr.org/en/service/2207) · [Source](https://www.hcaptcha.com/privacy)</sub>

✅ **Use instead**

- **[ALTCHA](https://altcha.org)** - Self-hosted proof-of-work captcha with no cookies or tracking. <sub>self-host · MIT</sub>
- **[mCaptcha](https://mcaptcha.org/)** - Proof-of-work captcha that rate-limits bots by making each request cost some computation. <sub>self-host · AGPL-3.0</sub>
- **[Private Captcha](https://privatecaptcha.com)** - EU-made proof-of-work captcha, as a hosted service or on your own server. `⚠️ source-available` <sub>self-host</sub>

---

### Analytics

Analytics from Google, Facebook or Microsoft feeds your visitors' data into their ad businesses. These tools give you the numbers without profiling visitors, and most can run on your own server.

- **[Ackee](https://ackee.electerious.com/)** - Self-hosted website analytics with no cookies and no tracking of unique users. <sub>self-host · MIT</sub>
- **[Aptabase](https://aptabase.com)** - Analytics for mobile and desktop apps, built to collect no personal data. <sub>AGPL-3.0</sub>
- **[Cabin](https://withcabin.com)** - Lightweight web analytics with no cookies, IP logging or fingerprinting, plus a carbon footprint report.
- **[GoatCounter](https://www.goatcounter.com/)** - Lightweight web analytics, as a hosted service or on your own server.
- **[Matomo](https://matomo.org/)** - Full-featured Google Analytics replacement that keeps the data on your own server. `⚠️ website trackers` <sub>GPL-3.0</sub>
- **[Nullitics](https://nullitics.com/)** - Minimal cookie-free analytics for a flat monthly fee, also usable as a library on your own server. `💀 inactive` <sub>MIT</sub>
- **[Pirsch](https://pirsch.io/)** - Cookie-free web analytics that can also track server-side from your backend. <sub>AGPL-3.0</sub>
- **[Plausible](https://plausible.io/)** - Lightweight, cookie-free web analytics, as a hosted service or on your own server. <sub>AGPL-3.0</sub>
- **[Rybbit](https://rybbit.com)** - Cookie-free web analytics, as a hosted service or on your own server. <sub>AGPL-3.0</sub>
- **[Shynet](https://github.com/milesmcc/shynet)** - Self-hosted web analytics that works without cookies or JavaScript. <sub>Apache-2.0</sub>
- **[Swetrix](https://swetrix.com)** - Cookie-free web analytics, as a hosted service or on your own server. <sub>self-host · AGPL-3.0</sub>
- **[Umami](https://umami.is/)** - Lightweight, cookie-free web analytics, as a hosted service or on your own server. `⚠️ website trackers` <sub>MIT</sub>

---

### Routers

Every byte your household sends passes through the router, yet stock firmware is closed and often goes years without security fixes. Open firmware, or a spare PC running a firewall distribution, puts you back in control.

- **[IPFire](https://www.ipfire.org/)** - Hardened Linux firewall distribution with intrusion prevention and a web interface.
- **[OpenWrt](https://openwrt.org/)** - Linux firmware that replaces the stock software on hundreds of consumer routers and keeps them updated.
- **[OPNsense](https://opnsense.org/)** - FreeBSD-based firewall and router for dedicated hardware or a spare PC. `⚠️ website trackers` <sub>BSD-2-Clause</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 🔐 Security & Encryption

### 2FA

Authenticator apps generate the one-time codes that protect an account even after its password leaks. Pick one that encrypts its vault and lets you export your tokens, so you're never locked in.

🚫 **Avoid**

- **Authy**: needs your phone number, and a 2024 leak exposed 33 million of them. <sub>[Source](https://www.malwarebytes.com/blog/news/2024/07/authy-phone-numbers-accessed-by-cybercriminals-warns-twilio)</sub>
- **Google Authenticator**: since 2023 it can sync your codes to Google, where researchers found Google could read them. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.macrumors.com/2023/04/27/google-authenticator-cloud-sync-no-e2e/)</sub>
- **Microsoft Authenticator**: 5 trackers in its Android app, and no way to export your tokens to another app. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.azure.authenticator/latest/)</sub>

✅ **Use instead**

- **[2FAS Auth](https://2fas.com/auth)** - Authenticator whose browser extension asks your phone for a code and fills it in, no account needed. <sub>GPL-3.0</sub>
- **[Aegis](https://getaegis.app/)** - Encrypted token vault that imports from most other authenticators and exports in plain or encrypted form. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.beemdevelopment.aegis/)</sub>
- **[ente Auth](https://ente.com/auth/)** - Authenticator with end-to-end encrypted sync between your devices, from the makers of ente Photos. `⚠️ website trackers` <sub>AGPL-3.0</sub>
- **[FreeOTPPlus](https://github.com/helloworld1/FreeOTPPlus)** - Fork of FreeOTP with backups, search and dark mode. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/org.liberty.android.freeotpplus/)</sub>
- **[Stratum](https://github.com/stratumauth/app)** - Authenticator with Wear OS support and encrypted backups. <sub>Android · GPL-3.0</sub>

---

### Password Managers

A password manager lets you use a strong, different password for every account without remembering any of them. Prefer one that encrypts your vault on your device, so not even its sync server can read it.

🚫 **Avoid**

- **LastPass**: the UK fined it £1.2 million in 2025 over a 2022 breach that leaked customers' encrypted vaults. <sub>[Source](https://www.bleepingcomputer.com/news/security/uk-fines-lastpass-over-2022-data-breach-impacting-16-million-users/)</sub>

✅ **Use instead**

- **[AliasVault](https://www.aliasvault.com)** - End-to-end encrypted password manager with a built-in email alias server. <sub>self-host · AGPL-3.0</sub>
- **[Bitwarden](https://bitwarden.com)** - Password manager with end-to-end encrypted sync across all your devices. `⚠️ website trackers` <sub>self-host</sub>
  - **[Vaultwarden](https://github.com/dani-garcia/vaultwarden)** - Lightweight, unofficial Bitwarden-compatible server you can host yourself. <sub>self-host · AGPL-3.0</sub>
- **[KeePassXC](https://keepassxc.org/)** - Offline password manager that keeps your vault in an encrypted file you control, with no account or sync service. <sub>Linux · macOS · Windows</sub>
  - **[KeePassDX](https://www.keepassdx.com/)** - KeePass-compatible password manager for Android. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.kunzisoft.keepass.libre/)</sub>
  - **[Strongbox](https://strongboxsafe.com/)** - KeePass-compatible password manager for iPhone, iPad and Mac. <sub>iOS · macOS · AGPL-3.0</sub>
- **[LessPass](https://www.lesspass.com)** - Stateless password manager that computes each password from your master password, so there's nothing to store or sync. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.lesspass.android/)</sub>
- **[Passbolt](https://www.passbolt.com)** - Password manager built for teams, with end-to-end encrypted sharing. `⚠️ website trackers` <sub>self-host · AGPL-3.0</sub>
- **[Passky](https://passky.org)** - Small, simple password manager with a server you can host yourself. <sub>self-host · EUPL-1.2 · [F-Droid](https://f-droid.org/packages/com.rabbitcompany.passky/)</sub>
- **[Proton Pass](https://proton.me/pass)** - End-to-end encrypted password manager with built-in email aliases, from the makers of Proton Mail. <sub>[F-Droid](https://f-droid.org/packages/proton.android.pass.fdroid/)</sub>

---

### Encryption

Encryption keeps your files unreadable to anyone without the key, whether a laptop gets stolen or a cloud provider gets breached. These tools use open, well-reviewed cryptography and keep the keys with you.

🚫 **Avoid**

- **BitLocker**: your recovery key is uploaded to Microsoft by default, and Microsoft has handed such keys to the FBI. <sub>[Source](https://techcrunch.com/2026/01/23/microsoft-gave-fbi-a-set-of-bitlocker-encryption-keys-to-unlock-suspects-laptops-reports)</sub>

✅ **Use instead**

- **[age](https://age-encryption.org)** - Simple, modern file encryption with small keys and nothing to configure. <sub>CLI · BSD-3-Clause</sub>
- **[Cryptomator](https://cryptomator.org/)** - Encrypts files on your device before they reach any cloud storage provider. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.cryptomator.lite/)</sub>
- **[Photok](https://github.com/leonlatsch/Photok)** - Photo vault that stores your pictures encrypted on the device. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/dev.leonlatsch.photok/)</sub>
- **[Shufflecake](https://shufflecake.net/)** - Hidden encrypted volumes for Linux with plausible deniability, so nobody can prove the hidden data exists. <sub>Linux</sub>
- **[Stegcloak](https://stegcloak.surge.sh/)** - Hides password-protected secrets inside ordinary text using invisible characters. `⚠️ website trackers` `💀 inactive`
- **[Tomb](https://dyne.org/software/tomb/)** - Creates and manages encrypted folders on Linux, built on standard LUKS. <sub>Linux · CLI · GPL-3.0</sub>
- **[VeraCrypt](https://veracrypt.io/en/Home.html)** - Encrypts whole disks, partitions or file containers, with support for hidden volumes. <sub>Linux · macOS · Windows</sub>

#### OS Encryption

- **[Cryptsetup](https://gitlab.com/cryptsetup/cryptsetup)** - The standard tool for full disk encryption on Linux, built on the kernel's dm-crypt module. <sub>Linux</sub>

---

### Pastebin and Secret Sharing

Sending a password or a private note over chat or email leaves a copy in every inbox and backup. These tools encrypt the text in your browser and let it expire, so the server never sees it and nothing lingers.

- **[crypt.fyi](https://www.crypt.fyi)** - Self-destructing secret sharing with end-to-end encryption, from the web, the command line or a browser extension.
- **[Deleto](https://dele.to)** - Shares passwords and other secrets with client-side encryption and automatic self-destruction.
- **[NoPaste](https://github.com/bokub/nopaste)** - Pastebin with no server storage at all; the text is compressed into the link you share. <sub>MIT</sub>
- **[PrivateBin](https://github.com/PrivateBin/PrivateBin)** - Minimal pastebin where everything is encrypted in the browser, so the server knows nothing about what you paste. <sub>self-host</sub>
- **[scrt.link](https://scrt.link)** - Shares end-to-end encrypted secrets that disappear after they're read.
- **[Yopass](https://github.com/jhaals/yopass)** - Shares encrypted secrets and files through one-time links that expire. <sub>self-host · Apache-2.0</sub>

---

### Privacy Tools

Tools for checking what your devices and apps leak, and for cutting off what you don't want sent.

#### Desktop

- **[BusKill](https://www.buskill.in/)** - USB dead man's switch that locks or wipes your computer when the cable is pulled away. <sub>GPL-3.0</sub>
- **[dnscrypt-proxy](https://github.com/DNSCrypt/dnscrypt-proxy)** - Local DNS proxy with encrypted DNS and anonymized relays, so resolvers can't link your lookups to your IP. <sub>ISC</sub>
- **[MAT2](https://github.com/jvoisin/mat2)** - Removes metadata from images, documents, audio and many other file types. <sub>Linux · CLI · LGPL-3.0</sub>
- **[Metadata Cleaner](https://gitlab.com/rmnvgr/metadata-cleaner)** - Simple desktop app to view and remove file metadata, built on MAT2. <sub>Linux</sub>
- **[Mobile Verification Toolkit](https://github.com/mvt-project/mvt)** - Amnesty International's tool for checking Android and iOS devices for traces of spyware such as Pegasus. `⚠️ source-available` <sub>CLI</sub>
- **[OpenSnitch](https://github.com/evilsocket/opensnitch)** - Application firewall that asks before any program connects to the internet. <sub>Linux · GPL-3.0</sub>

#### Android

- **[NetGuard](https://netguard.me/)** - Blocks internet access per app, no root needed. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/eu.faircode.netguard/)</sub>
- **[Orbot](https://orbot.app/)** - Routes app traffic through Tor, for all apps or only the ones you choose. Made by the Guardian Project. <sub>Android</sub>
- **[Plexus](https://plexus.techlore.tech/)** - Community database of which apps work on de-Googled Android. <sub>Android · [F-Droid](https://f-droid.org/packages/tech.techlore.plexus/)</sub>
- **[RethinkDNS + Firewall](https://github.com/celzero/rethink-app)** - Firewall and encrypted DNS client in one, no root needed. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/com.celzero.bravedns/) (Play Store version has trackers)</sub>
- **[εxodus](https://reports.exodus-privacy.eu.org/en/)** - Shows which trackers and permissions an Android app contains, before you install it. <sub>AGPL-3.0</sub>
  - **[ClassyShark3xodus](https://f-droid.org/en/packages/com.oF2pks.classyshark3xodus/)** - Checks the apps on your phone for known trackers, using the εxodus database. <sub>Android · [F-Droid](https://f-droid.org/packages/com.oF2pks.classyshark3xodus/)</sub>

---

### Whistleblowing

Platforms for receiving leaks and reports without exposing the source. They run on infrastructure the organisation controls instead of a hosted portal or email inbox.

- **[GlobaLeaks](https://www.globaleaks.org/)** - Whistleblowing platform for organisations, newsrooms and activists, reachable over Tor. <sub>self-host · AGPL-3.0</sub>
- **[SecureDrop](https://securedrop.org/)** - Submission system that lets newsrooms receive documents from anonymous sources over Tor. <sub>self-host</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 📁 Files & Productivity

### Cloud Storage

Mainstream cloud drives can read everything you upload and scan it on their servers. Prefer storage that encrypts files on your device before upload, or a server you run yourself.

🚫 **Avoid**

- **Google Drive**: scans your files, and in 2022 locked a file holding only the digit 1 as copyright infringement. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.bleepingcomputer.com/news/security/google-drive-flags-nearly-empty-files-for-copyright-infringement/)</sub>
- **Dropbox**: a 2012 breach exposed 68 million users' emails and passwords, which Dropbox only confirmed in 2016. <sub>[ToS;DR](https://tosdr.org/en/service/270) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.dropbox.android/latest/) · [Source](https://www.theregister.com/2016/08/31/dropbox_2012_credentials_file_is_real/)</sub>
- **OneDrive**: collects and stores facial scans from your photos to group them by person, Microsoft says. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Source](https://support.microsoft.com/en-us/onedrive/group-photos-by-people-in-microsoft-photos)</sub>

✅ **Use instead**

- **[Filen](https://filen.io/)** - End-to-end encrypted cloud storage from Germany, with desktop, mobile and web clients you can inspect.
- **[Nextcloud](https://nextcloud.com/)** - Self-hosted file sync and sharing platform, with apps for calendars, contacts, office documents and more. <sub>self-host · AGPL-3.0</sub>
- **[Peergos](https://peergos.org/)** - End-to-end encrypted space for files, photos and documents, with calendar, tasks, chat and email built in. <sub>self-host · AGPL-3.0</sub>
- **[PrivateStorage](https://private.storage/)** - Client-side encrypted storage and folder sync with no account, paid for in a way that isn't linked to your files.
- **[Proton Drive](https://proton.me/drive)** - End-to-end encrypted cloud storage from the makers of Proton Mail.
- **[Seafile](https://www.seafile.com/en/home/)** - Fast self-hosted file sync and sharing, with optional per-library client-side encryption and a built-in wiki. <sub>self-host</sub>
- **[Sync-in](https://sync-in.com/)** - Self-hosted file storage, sharing and sync with WebDAV, desktop clients and online document editing. <sub>self-host · AGPL-3.0</sub>

#### Other useful tools

- **[Cryptomator](https://cryptomator.org)** - Encrypts files on your device before they reach any cloud storage provider. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.cryptomator.lite/)</sub>
- **[git-annex](https://git-annex.branchable.com/)** - Manages and syncs large files with git without storing their contents in git, across drives and many cloud and offline backends.
- **[Rclone](https://rclone.org/)** - Command-line tool to manage files on dozens of cloud providers, with an encryption layer so they only see ciphertext. <sub>CLI · MIT</sub>
- **[Restic](https://restic.net/)** - Backup tool that encrypts and deduplicates snapshots before storing them locally or with a cloud provider. <sub>CLI · BSD-2-Clause</sub>
- **[Syncthing](https://syncthing.net/)** - Continuous file sync directly between your own devices, with no central server holding your data. <sub>MPL-2.0</sub>

---

### File Management and Sharing

Upload-and-share services keep a readable copy of your files on their servers and fill their sites with trackers. Prefer tools that send files directly between devices, or encrypt them before they leave yours.

🚫 **Avoid**

- **WeTransfer**: in 2025 it changed its terms to license your uploaded files for machine learning, then backed down. <sub>[ToS;DR](https://tosdr.org/en/service/214) · [Source](https://www.malwarebytes.com/blog/news/2025/07/wetransfer-walks-back-clause-that-said-it-would-train-ai-on-your-files)</sub>

✅ **Use instead**

- **[Blaze](https://blaze.vercel.app/)** - Peer-to-peer file sharing in the browser, between two or more devices at once. `⚠️ website trackers` `💀 inactive` <sub>MIT</sub>
- **[Croc](https://github.com/schollz/croc)** - Sends files between two computers with end-to-end encryption, using a short code phrase. <sub>CLI · MIT</sub>
- **[Gokapi](https://github.com/Forceu/Gokapi)** - Lightweight self-hosted alternative to Firefox Send, where only you can upload and links expire. <sub>self-host · AGPL-3.0</sub>
- **[Localsend](https://localsend.org/)** - Shares files with nearby devices over your local network, with no internet connection or account needed. <sub>Apache-2.0 · [F-Droid](https://f-droid.org/packages/org.localsend.localsend_app/)</sub>
- **[Lufi](https://framagit.org/fiat-tux/hat-softwares/lufi)** - File sharing server that encrypts uploads in your browser, so the server never sees the contents. <sub>self-host</sub>
- **[Magic Wormhole](https://github.com/magic-wormhole/magic-wormhole)** - Sends files from one computer to another with end-to-end encryption, using a short one-time code. <sub>CLI · MIT</sub>
- **[OnionShare](https://github.com/onionshare/onionshare)** - Shares files, hosts websites and runs chat rooms over Tor onion services, anonymously and without a third-party server.
- **[PairDrop](https://github.com/schlagmichdoch/PairDrop)** - Snapdrop fork that shares files in the browser on your local network, and with paired devices beyond it. <sub>fork · GPL-3.0</sub>
- **[Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx)** - Self-hosted document manager that scans, indexes and archives your paperwork on your own server. <sub>self-host · GPL-3.0</sub>
- **[QRcp](https://github.com/claudiodangelis/qrcp)** - Transfers files over Wi-Fi from your computer to your phone by scanning a QR code in the terminal. <sub>CLI · MIT</sub>
- **[scrt.link](https://scrt.link/file)** - End-to-end encrypted file transfer of up to 100 GB, stored in Switzerland for up to 30 days. <sub>MIT</sub>
- **[Send](https://gitlab.com/timvisee/send)** - Fork of Firefox Send that encrypts files in the browser and expires links after a set time or number of downloads. <sub>self-host · fork</sub>
- **[Snapdrop](https://snapdrop.me)** - Local file sharing in the browser, inspired by Apple's AirDrop. <sub>self-host · GPL-3.0</sub>
- **[Winden](https://winden.app/)** - Magic Wormhole in the browser, for end-to-end encrypted transfers without installing anything. <sub>MIT</sub>
- **[Yopass](https://github.com/jhaals/yopass)** - Shares encrypted secrets and files through one-time links that expire. <sub>self-host · Apache-2.0</sub>

---

### Download Manager

A download manager sees every file you fetch and every site you fetch it from. These resume and speed up downloads without ads or bundled extras, and their code is open to inspect.

- **[axel](https://github.com/axel-download-accelerator/axel)** - Lightweight download accelerator for HTTP, HTTPS, FTP and FTPS. <sub>CLI · GPL-2.0</sub>
- **[Motrix](https://motrix.app)** - Full-featured download manager for HTTP, FTP, BitTorrent and magnet links. <sub>Desktop</sub>
- **[Persepolis Download Manager](https://persepolisdm.github.io)** - Graphical front end for aria2 with download scheduling and video grabbing. <sub>Desktop · GPL-3.0</sub>
- **[Xtreme Download Manager](https://xtremedownloadmanager.com/)** - Download accelerator that resumes broken downloads and saves streaming video from many sites. `⚠️ website trackers` <sub>Desktop · GPL-3.0</sub>

---

### Notes and Tasks

Popular note apps store everything you write on their servers, usually readable by the provider and wrapped in trackers. Prefer apps that keep notes on your device or encrypt them end to end before syncing.

🚫 **Avoid**

- **Google Keep**: notes are stored on Google's servers without end-to-end encryption. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>
  - **[Keep To Markdown](https://github.com/erikelisath/keep-to-markdown)** - Converts your Google Keep notes to Markdown files with a YAML header.
- **Evernote**: in 2016 Evernote changed its policy to let staff read users' notes, until users pushed back. <sub>[ToS;DR](https://tosdr.org/en/service/207) · [Source](https://techcrunch.com/2016/12/14/evernotes-new-privacy-policy-allows-employees-to-read-your-notes/)</sub>
- **Notion**: no end-to-end encryption, so Notion can read everything in your workspace. <sub>[ToS;DR](https://tosdr.org/en/service/1817)</sub>
- **OneNote**: notes sync through Microsoft's servers without end-to-end encryption. <sub>[ToS;DR](https://tosdr.org/en/service/244)</sub>

✅ **Use instead**

- **[AppFlowy](https://appflowy.com/)** - Notion alternative for docs, wikis and task boards that you can run locally or host yourself. `⚠️ website trackers` <sub>AGPL-3.0</sub>
- **[HedgeDoc](https://hedgedoc.org/)** - Self-hosted collaborative Markdown editor for writing and sharing notes in real time, formerly CodiMD. <sub>self-host · AGPL-3.0</sub>
- **[Joplin](https://github.com/laurent22/joplin)** - Markdown notes and to-dos with optional end-to-end encrypted sync through a server of your choice. <sub>[F-Droid](https://f-droid.org/packages/net.cozic.joplin/)</sub>
- **[Lockbook](https://lockbook.net)** - End-to-end encrypted notebook for notes, documents and drawings, as an Evernote alternative. <sub>Unlicense</sub>
- **[Logseq](https://logseq.com/)** - Outliner for linked notes and journals, stored as plain Markdown files on your device. `⚠️ telemetry opt-out` <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.logseq.app/)</sub>
- **[Memos](https://github.com/usememos/memos)** - Self-hosted hub for quick notes and memos, shown as a timeline. <sub>self-host · MIT</sub>
- **[Nextcloud Notes](https://github.com/nextcloud/notes/)** - Distraction-free notes app for your Nextcloud server. <sub>self-host · AGPL-3.0</sub>
  - **[Nextcloud Notes app](https://github.com/nextcloud/notes-android)** - Android client for Nextcloud Notes. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/it.niedermann.owncloud.notes/)</sub>
- **[Notally](https://github.com/OmGodse/Notally)** - Minimal notes app that keeps everything on your device, with no sync. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.omgodse.notally/)</sub>
- **[Notesnook](https://notesnook.com/)** - End-to-end encrypted notes app with sync across your devices, as an Evernote alternative. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.streetwriters.notesnook/)</sub>
- **[Obsidian](https://obsidian.md)** - Markdown notes kept as plain files on your device, with optional end-to-end encrypted sync. `⚠️ closed source`
- **[OpenHabitTracker](https://openhabittracker.net/)** - Habit, task and note tracker that keeps your data on the device, or syncs to a server you run yourself. `⚠️ website trackers`
- **[Quillpad](https://quillpad.github.io/)** - Markdown notes and task lists for Android, with optional Nextcloud sync, forked from Quillnote. <sub>Android · fork · GPL-3.0 · [F-Droid](https://f-droid.org/packages/io.github.quillpad/)</sub>
- **[SiYuan](https://github.com/siyuan-note/siyuan)** - Local-first personal knowledge base built from blocks you can link, embed and query. <sub>AGPL-3.0</sub>
- **[Standard Notes](https://standardnotes.com/)** - End-to-end encrypted notes app that syncs across all your devices. <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.standardnotes/)</sub>
- **[Super Productivity](https://super-productivity.com)** - To-do list and time tracker that keeps data local with no account, with optional sync over WebDAV or Dropbox. <sub>MIT</sub>
- **[Tasks.org](https://tasks.org)** - To-do and task manager that works offline, with CalDAV sync. `⚠️ website trackers` <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.tasks/) (Play Store version has trackers)</sub>
- **[TinyList](https://tinylist.app/)** - Notes and checklists you can share without an account, with no ads or tracking. <sub>MIT</sub>
- **[Trilium Notes](https://github.com/TriliumNext/Trilium)** - Hierarchical personal knowledge base you can sync through your own server, with optional encryption for individual notes. <sub>self-host · AGPL-3.0</sub>
- **[Vikunja](https://vikunja.io)** - Self-hosted to-do app with lists, kanban boards and Gantt charts. <sub>self-host · AGPL-3.0</sub>
- **[YankNote](https://github.com/purocean/yn)** - Extensible Markdown editor for programmers that stores notes as local files. <sub>Desktop · AGPL-3.0</sub>

---

### Office

Cloud office suites keep your documents on the provider's servers in a form it can read. Prefer an offline suite, or a collaborative one that encrypts documents end to end or runs on your own server.

🚫 **Avoid**

- **Microsoft Office**: in 2025 Austria's regulator ruled that Microsoft 365 Education illegally tracked pupils with cookies. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.microsoft.office.officehubrow/latest/) · [Source](https://noyb.eu/en/noyb-win-microsoft-365-education-tracks-school-children)</sub>
- **Google Docs**: files are scanned automatically, and a 2017 bug locked people out of their own docs as abusive content. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://9to5google.com/2017/11/02/google-explains-tuesdays-drive-and-docs-bug/)</sub>

✅ **Use instead**

- **[Collabora Office](https://www.collaboraonline.com/collabora-office/)** - LibreOffice-based office suite for desktop and mobile, from the team behind Collabora Online.
- **[CryptPad](https://cryptpad.org/)** - Collaborative documents, spreadsheets and more, end-to-end encrypted so the server can't read them. <sub>self-host · AGPL-3.0</sub>
- **[Etherpad](https://etherpad.org/)** - Self-hosted editor for writing documents together in real time. <sub>self-host · Apache-2.0</sub>
- **[Fileverse](https://fileverse.io)** - End-to-end encrypted workspace and collaboration apps, as an alternative to Google Workspace.
  - **[dDocs](https://ddocs.new)** - End-to-end encrypted, decentralized alternative to Google Docs. <sub>AGPL-3.0</sub>
  - **[dSheets](https://sheets.fileverse.io)** - Decentralized alternative to Excel and Google Sheets. <sub>AGPL-3.0</sub>
- **[Grist](https://www.getgrist.com)** - Spreadsheet and database hybrid you can host yourself, as an Airtable alternative. `⚠️ website trackers` <sub>self-host · Apache-2.0</sub>
- **[LibreOffice](https://www.libreoffice.org/)** - Full desktop office suite that works entirely offline and opens Microsoft Office formats. <sub>Desktop · GPL-3.0</sub>
- **[OnlyOffice](https://www.onlyoffice.com/)** - Office suite built around Microsoft formats, with a document server you can host for real-time collaboration. `⚠️ website trackers` <sub>self-host · AGPL-3.0</sub>

---

### PDF Tools

Most online PDF tools upload your document to their server before working on it, then promise to delete it later. Prefer tools that do the processing on your own device.

🚫 **Avoid**

- **iLovePDF**: uploads your documents to its servers, and the Android app has 7 trackers. <sub>[ToS;DR](https://tosdr.org/en/service/7842) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.ilovepdf.www/latest/)</sub>
- **Smallpdf**: uploads your documents to its servers, and the Android app has 3 trackers. <sub>[ToS;DR](https://tosdr.org/en/service/6244) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.smallpdf.app.android/latest/)</sub>

✅ **Use instead**

- **[BentoPDF](https://bentopdf.com/)** - Browser-based PDF toolkit to merge, split, compress, sign and redact, with files processed on your device. <sub>Web · self-host · AGPL-3.0</sub>

---

### Calendar

Your calendar shows where you'll be, when and with whom. Prefer a calendar that keeps events on your device, syncs over open CalDAV with a server you trust, or encrypts them end to end.

🚫 **Avoid**

- **Google Calendar**: your events sit on Google's servers without end-to-end encryption, tied to your account. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

- **[Etar](https://github.com/Etar-Group/Etar-Calendar)** - Calendar app that works with any CalDAV server through a sync adapter. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/ws.xsoh.etar/)</sub>
- **[Fossify Calendar](https://github.com/FossifyOrg/Calendar)** - Offline calendar with widgets and no ads, which can also sync with your device's CalDAV accounts. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.fossify.calendar/)</sub>
- **[KashCal](https://github.com/KashCal/KashCal)** - Offline-first calendar with built-in iCloud and CalDAV sync, full-text search and widgets. <sub>Android · [F-Droid](https://f-droid.org/packages/org.onekash.kashcal/)</sub>
- **[Nextcloud Calendar](https://apps.nextcloud.com/apps/calendar)** - Calendar app for your Nextcloud server, with CalDAV sync to your other devices. <sub>self-host · AGPL-3.0</sub>
- **[Proton Calendar](https://proton.me/calendar)** - End-to-end encrypted calendar from the makers of Proton Mail.

---

### Bookmarking

Bookmarks and read-later lists reveal a lot about what you read and care about. Prefer a manager you host yourself, or one that syncs bookmarks through storage you already control.

🚫 **Avoid**

- **Evernote Web Clipper**: in 2016 Evernote changed its policy to let staff read users' notes, until users pushed back. <sub>[ToS;DR](https://tosdr.org/en/service/207) · [Source](https://techcrunch.com/2016/12/14/evernotes-new-privacy-policy-allows-employees-to-read-your-notes/)</sub>

✅ **Use instead**

- **[42links](https://42links.tuxproject.de)** - Minimalist self-hosted bookmark storage. <sub>self-host</sub>
- **[Floccus](https://floccus.org/)** - Syncs your bookmarks across browsers and devices through your own Nextcloud, WebDAV or Git server. <sub>MPL-2.0 · [F-Droid](https://f-droid.org/packages/org.handmadeideas.floccus/)</sub>
- **[Grimoire](https://github.com/goniszewski/grimoire)** - Self-hosted bookmark manager that extracts and keeps the readable content of what you save. <sub>self-host · MIT</sub>
- **[Karakeep](https://karakeep.com/)** - Self-hosted app for saving links, notes and images, with full-text search and optional AI tagging, formerly Hoarder. <sub>self-host · AGPL-3.0</sub>
- **[LinkAce](https://github.com/Kovah/LinkAce)** - Self-hosted bookmark archive that monitors and organizes your saved links. <sub>self-host · GPL-3.0</sub>
- **[LinkDing](https://github.com/sissbruecker/linkding)** - Minimal, fast self-hosted bookmark manager that is easy to run with Docker. <sub>self-host · MIT</sub>
- **[Linkwarden](https://linkwarden.app)** - Self-hosted bookmark manager that saves and archives full copies of the pages you collect. <sub>self-host · AGPL-3.0</sub>
- **[Readeck](https://readeck.org)** - Single-binary self-hosted read-it-later app that saves articles for offline reading. <sub>self-host</sub>
- **[Shiori](https://github.com/go-shiori/shiori)** - Self-hosted bookmark manager written in Go, usable from the command line or a web interface. <sub>self-host · MIT</sub>
- **[Wallabag](https://wallabag.org/)** - Read-it-later server you can host yourself, or use through a paid hosted service. <sub>self-host · MIT · [F-Droid](https://f-droid.org/packages/fr.gaulupeau.apps.InThePoche/)</sub>

#### Book and web annotations/highlights management

- **[Blasta](https://git.xmpp-it.net/sch/Blasta)** - Federated, collaborative bookmark manager built on XMPP PubSub.
- **[Hypothesis](https://github.com/hypothesis/h/)** - Annotates web pages and PDFs, privately or in shared groups. <sub>BSD-2-Clause</sub>
- **[Kobuddy](https://github.com/karlicoss/kobuddy)** - Extracts highlights, notes and reading progress from your Kobo e-reader's database. <sub>CLI · MIT</sub>

---

### Forms

Hosted form builders collect every answer your respondents give on the provider's servers. Prefer a form tool that encrypts responses end to end or runs on your own server.

🚫 **Avoid**

- **Google Forms**: responses are stored on Google's servers without end-to-end encryption. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

- **[CryptPad Forms](https://cryptpad.fr/form/)** - End-to-end encrypted forms and polls, part of the CryptPad collaboration suite. <sub>self-host · AGPL-3.0</sub>
- **[FramaForms](https://framaforms.org/)** - Online form and survey service run by the French nonprofit Framasoft.
- **[TypeBot](https://typebot.com)** - Builder for conversational, chat-style forms that you can host yourself. `⚠️ source-available` <sub>self-host</sub>

---

### Databases

Hosted backends like Google Firebase keep your app's data and your users' accounts on servers you don't control. These backends can run on your own infrastructure instead.

🚫 **Avoid**

- **Google Firebase**: cloud only, so your app's data, and your users', always lives on Google's servers. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

- **[Appwrite](https://appwrite.io/)** - Self-hosted backend with auth, databases, storage and functions for web and mobile apps. <sub>self-host · BSD-3-Clause</sub>
- **[Baserow](https://baserow.io/)** - Self-hosted no-code database and spreadsheet, as an Airtable alternative. `⚠️ website trackers` <sub>self-host</sub>
- **[Pocketbase](https://pocketbase.io/)** - Backend in a single Go binary, with an embedded SQLite database, realtime subscriptions, auth and an admin UI. <sub>self-host</sub>
- **[Supabase](https://supabase.com/)** - Postgres-based Firebase alternative with auth, storage and realtime APIs, though [self-hosting](https://github.com/supabase/supabase/issues/4440#issuecomment-992108832) is [limited](https://github.com/supabase/supabase/issues/4934). <sub>self-host · Apache-2.0</sub>
- **[TrailBase](https://trailbase.io/)** - Single-executable Firebase alternative built on Rust and SQLite, with REST and realtime APIs, auth and an admin UI. <sub>self-host · OSL-3.0</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 🎬 Media & Creative

### Media Streaming Platforms

Streaming services log everything you watch and listen to, and their apps are full of trackers. Host your own media server, or use a client that doesn't report back, to keep your habits to yourself.

🚫 **Avoid**

- **Netflix**: in 2024 Dutch regulators fined Netflix €4.75 million for not telling users what it does with their data. <sub>[ToS;DR](https://tosdr.org/en/service/185) · [Source](https://noyb.eu/en/noyb-win-dutch-authority-fines-netflix-eu475-million)</sub>
- **Amazon Prime Video**: 3 trackers in its Android app, under a poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/2444) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.amazon.avod.thirdpartyclient/latest/)</sub>
- **Disney Plus**: in 2026 Disney paid California $2.75 million for sharing streaming viewers' data after they had opted out. <sub>[ToS;DR](https://tosdr.org/en/service/2745) · [Source](https://oag.ca.gov/news/press-releases/california-wont-let-it-go-attorney-general-bonta-announces-275-million)</sub>
- **Spotify**: in 2023 Sweden fined Spotify 58 million kronor for not clearly explaining how it uses your data. <sub>[ToS;DR](https://tosdr.org/en/service/225) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.spotify.music/latest/) · [Source](https://www.imy.se/en/news/administrative-fee-against-spotify/)</sub>
- **SoundCloud**: a 2025 breach exposed the email addresses of about 28 million users, a fifth of its community. <sub>[ToS;DR](https://tosdr.org/en/service/276) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.soundcloud.android/latest/) · [Source](https://hackread.com/soundcloud-cyberattack-data-breach/)</sub>

✅ **Use instead**

#### Video and Audio

- **[Jellyfin](https://jellyfin.org/)** - Media server you host yourself for films, shows and music, with no account on anyone else's servers. <sub>self-host · GPL-2.0</sub>
- **[Stremio](https://www.stremio.com/)** - Media center that gathers video from add-ons into one library and player. `⚠️ website trackers` <sub>GPL-2.0</sub>

#### Audio

- **[Ampache](https://ampache.org/)** - Web-based server for streaming your own music and video collection. <sub>self-host · AGPL-3.0</sub>
- **[Funkwhale](https://www.funkwhale.audio/)** - Federated platform for hosting, sharing and listening to music, a SoundCloud alternative. <sub>self-host · ActivityPub</sub>
- **[Koel](https://koel.dev/)** - Personal music streaming server with a web player. <sub>self-host · MIT</sub>
- **[mucke](https://github.com/moritz-weber/mucke)** - Player for local music files with custom playback rules. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/rocks.mucke/)</sub>
- **[Navidrome](https://www.navidrome.org/)** - Lightweight music server for your own collection, compatible with Subsonic apps. `⚠️ website trackers` <sub>self-host · GPL-3.0</sub>
- **[Nuclear](https://nuclearplayer.com/)** - Desktop music player that streams from free sources, with no account. <sub>Linux · macOS · Windows · AGPL-3.0</sub>

##### Spotify alternative clients

These clients cut out Spotify's own apps and their tracking, but you still stream from Spotify's servers, so Spotify still sees what you play.

- **[ncspot](https://github.com/hrkfdn/ncspot)** - Terminal Spotify client written in Rust, inspired by ncmpc. Needs Spotify Premium. <sub>CLI · BSD-2-Clause</sub>
- **[psst](https://github.com/jpochyla/psst)** - Fast Spotify client with a native GUI written in Rust. Needs Spotify Premium. <sub>Linux · macOS · Windows · MIT</sub>
- **[Spotube](https://spotube.cc/)** - Plugin-based music player that can load your Spotify playlists and stream the audio from other sources, no Premium needed. <sub>AGPL-3.0</sub>

##### YouTube Music alternative clients

An unofficial app for a service you already use, usually without its ads or tracking. Your account stays with that service, and using an unofficial app can break its rules.

- **[SimpMusic](https://simpmusic.org/)** - YouTube Music client with no ads and SponsorBlock built in, successor to the discontinued ViMusic and RiMusic. `⚠️ website trackers` <sub>Android · Desktop · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.maxrave.simpmusic/)</sub>

##### Deezer alternative clients

An unofficial app for a service you already use, usually without its ads or tracking. Your account stays with that service, and using an unofficial app can break its rules.

- **[dzr](https://github.com/yne/dzr)** - Command line Deezer player for Linux, BSD and Android with Termux. <sub>CLI · Unlicense</sub>

#### Podcasts

🚫 **Avoid**

- **Spotify**: in 2023 Sweden fined Spotify 58 million kronor for not clearly explaining how it uses your data. <sub>[ToS;DR](https://tosdr.org/en/service/225) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.spotify.music/latest/) · [Source](https://www.imy.se/en/news/administrative-fee-against-spotify/)</sub>
- **iVoox**: 13 trackers in its Android app, and more on its website. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.ivoox.app/latest/)</sub>
- **Audible**: 5 trackers in its Android app, under Amazon's poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/190) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.audible.application/latest/)</sub>
- **Deezer**: a partner leaked a 2019 backup of 229 million users' names, birth dates, IPs and locations, published in 2022. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/deezer.android.app/latest/) · [Source](https://haveibeenpwned.com/Breach/Deezer)</sub>

✅ **Use instead**

- **[AntennaPod](https://antennapod.org)** - Podcast player that subscribes to any RSS feed, with no account needed. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/de.danoeh.antennapod/)</sub>
- **[Castopod](https://castopod.org)** - Podcast hosting you run yourself, so your show and your audience stay yours, with fediverse integration. <sub>self-host · ActivityPub · AGPL-3.0</sub>
- **[Funkwhale](https://www.funkwhale.audio/)** - Federated platform for hosting, sharing and listening to podcasts and music. <sub>self-host · ActivityPub</sub>

---

### Music Recognition

Song recognition apps listen through your microphone and tend to bundle a lot of trackers. The clients below still ask a recognition service to match the song, but without the official apps' tracking.

🚫 **Avoid**

- **Shazam**: owned by Apple, and its Android app carries Google's analytics trackers. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.shazam.android/latest/)</sub>
- **SoundHound**: 11 trackers in its Android app. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.melodis.midomiMusicIdentifier.freemium/latest/)</sub>
- **Musixmatch**: 8 trackers in its Android app. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.musixmatch.android.lyrify/latest/)</sub>

✅ **Use instead**

#### Shazam alternative clients

An unofficial app for a service you already use, usually without its ads or tracking. Your account stays with that service, and using an unofficial app can break its rules.

- **[Audile](https://github.com/AudileTeam/Audile)** - Music recognition app that queries Shazam, AudD or ACRCloud and keeps your history on the device. <sub>Android · GPL-3.0</sub>
- **[SongID Telegram Bot](https://github.com/smcclennon/SongID)** - Telegram bot that identifies the music in audio and video files you send it. <sub>Apache-2.0</sub>
- **[SongRec](https://github.com/marin-m/SongRec)** - Shazam client for Linux written in Rust, no account needed. <sub>Linux · GPL-3.0</sub>

---

### Photo Storage

Cloud photo services scan your library for faces, places and objects and tie it all to your account. Host your own photo server, or use an end-to-end encrypted service so only you can see your pictures.

🚫 **Avoid**

- **Google Photos**: scans your photos, and in 2022 its scan got a father investigated by police over photos taken for a doctor. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://gizmodo.com/google-csam-photodna-1849440471)</sub>
  - **[Google Photos Takeout Helper](https://github.com/TheLastGimbus/GooglePhotosTakeoutHelper)** - Script that sorts the messy Google Takeout archive into one chronological folder, to help you move out of Google Photos. `💀 inactive` <sub>Apache-2.0</sub>
- **Amazon Photos**: its privacy notice says Amazon uses the images you store with it to improve its services. <sub>[Source](https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ)</sub>

✅ **Use instead**

#### Self-hosted

You install and run it yourself, on a computer at home or a rented server. Your data stays with you, but setup, updates and backups are up to you.

- **[Ente](https://ente.com/)** - End-to-end encrypted photo and video backup whose cryptography was [independently audited](https://ente.com/blog/cryptography-audit/). `⚠️ website trackers` <sub>self-host · AGPL-3.0</sub>
- **[Immich](https://immich.app/)** - Self-hosted photo and video backup straight from your phone, the closest match to Google Photos. <sub>self-host · AGPL-3.0 · [F-Droid](https://f-droid.org/packages/app.alextran.immich/)</sub>
- **[LibrePhotos](https://github.com/LibrePhotos/librephotos)** - Self-hosted photo management service, an active fork of [OwnPhotos](https://github.com/hooram/ownphotos). <sub>self-host · MIT</sub>
- **[Nextcloud](https://nextcloud.com/)** - Self-hosted cloud suite whose [Photos](https://github.com/nextcloud/photos) app organizes and displays your pictures. <sub>self-host · AGPL-3.0</sub>
- **[PhotoPrism](https://www.photoprism.app/)** - Self-hosted photo library with automatic tagging and face recognition that runs on your own server. <sub>self-host</sub>
- **[Photoview](https://photoview.github.io/)** - Self-hosted photo gallery that works on your existing folders, with face recognition. <sub>self-host · AGPL-3.0</sub>
- **[PiGallery2](https://bpatrik.github.io/pigallery2/)** - Self-hosted, directory-first photo gallery website. <sub>self-host · MIT</sub>
- **[Stingle Photos](https://stingle.org/)** - End-to-end encrypted photo backup and sync for your phone. <sub>Android · iOS · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.stingle.photos/)</sub>

#### Third-party

A company or organization runs it for you: sign up and use it. It's the easiest way to start, but you trust them with your data, so look for end-to-end encryption and a good track record.

- **[Cryptee](https://crypt.ee/)** - Encrypted storage for your photos, documents and notes, based in Estonia.
- **[Ente](https://ente.com/)** - End-to-end encrypted photo and video backup whose cryptography was [independently audited](https://ente.com/blog/cryptography-audit/). `⚠️ website trackers` <sub>self-host · AGPL-3.0</sub>
- **[Stingle Photos](https://stingle.org/)** - End-to-end encrypted photo backup and sync for your phone. <sub>Android · iOS · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.stingle.photos/)</sub>

#### Local

Works on your own device without a server, so nothing leaves it. Backing up your files is up to you.

- **[digiKam](https://www.digikam.org/)** - Photo manager for large collections, with tagging, face recognition and editing, all on your own files. <sub>Linux · macOS · Windows</sub>
- **[ImageGlass](https://imageglass.org/)** - Lightweight image viewer with a clean interface. `⚠️ website trackers` <sub>Windows</sub>
- **[Photok](https://github.com/leonlatsch/Photok)** - Photo vault that encrypts your pictures on the device and hides them from your gallery. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/dev.leonlatsch.photok/)</sub>

---

### Photo Editing and Management

Mainstream photo editors push your work into their cloud and collect usage data along the way. These editors run on your own machine, or entirely in your browser, and keep your files local.

🚫 **Avoid**

- **Adobe Photoshop and Lightroom**: its 2024 terms say Adobe may access your cloud content through both automated and manual review. <sub>[Source](https://www.theregister.com/2024/06/06/adobe_users_upset_over_content/)</sub>
- **VSCO**: 14 trackers in its Android app, under a very poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/2986) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.vsco.cam/latest/)</sub>

✅ **Use instead**

#### Web

- **[miniPaint](https://github.com/viliusle/miniPaint)** - Photopea alternative that edits images entirely in your browser, with nothing sent to a server. <sub>Web</sub>

#### Desktop

- **[Czkawka](https://github.com/qarmin/czkawka)** - Finds duplicate files, similar images and other clutter in your photo folders. <sub>Linux · macOS · Windows</sub>
- **[darktable](https://www.darktable.org/)** - Raw developer and photo workflow app, a Lightroom alternative. <sub>Linux · macOS · Windows · GPL-3.0</sub>
- **[digiKam](https://www.digikam.org/)** - Photo manager for large collections, with tagging, face recognition and editing, all on your own files. <sub>Linux · macOS · Windows</sub>
- **[GIMP](https://www.gimp.org/)** - Raster image editor for retouching, compositing and drawing, a Photoshop alternative. <sub>Linux · macOS · Windows</sub>
- **[ImageGlass](https://imageglass.org/)** - Lightweight image viewer with a clean interface. `⚠️ website trackers` <sub>Windows</sub>
- **[Inkscape](https://inkscape.org/)** - Vector graphics editor, an Illustrator alternative. <sub>Linux · macOS · Windows</sub>
- **[Krita](https://krita.org/)** - Digital painting app built for artists. <sub>GPL-3.0</sub>
- **[qView](https://github.com/jurplel/qView)** - Minimal, fast image viewer that shows just the image with no clutter. <sub>Linux · macOS · Windows · GPL-3.0</sub>
- **[RapidRAW](https://github.com/CyberTimon/RapidRAW)** - Lightweight, GPU-accelerated non-destructive raw editor, a Lightroom alternative. <sub>AGPL-3.0</sub>
- **[RawTherapee](https://rawtherapee.com)** - Offline raw photo developer that pairs well with darktable as a Lightroom alternative. <sub>Linux · macOS · Windows · GPL-3.0</sub>

#### Android

- **[ImagePipe](https://codeberg.org/Starfish/Imagepipe)** - Shrinks images and strips their Exif data when you share them. <sub>Android · [F-Droid](https://f-droid.org/packages/de.kaffeemitkoffein.imagepipe/)</sub>
- **[Pocket Paint](https://github.com/Catrobat/Paintroid)** - Image editor and painting app from the Catrobat project. <sub>Android · [F-Droid](https://f-droid.org/packages/org.catrobat.paintroid/)</sub>
- **[Scrambled Exif](https://gitlab.com/juanitobananas/scrambled-exif)** - Removes Exif data from pictures before you share them. <sub>Android</sub>

---

### Video Editing

Commercial video editors are closed source and often tied to an online account, and Adobe has a [long record of anti-user practices](https://www.gnu.org/proprietary/malware-adobe.html). These editors run locally and need no account.

🚫 **Avoid**

- **Adobe Premiere Pro**: its terms allow automated scanning of your Creative Cloud files and human review of flagged ones. <sub>[Source](https://www.adobe.com/legal/terms.html)</sub>

✅ **Use instead**

- **[Kdenlive](https://kdenlive.org/)** - Non-linear video editor from KDE. <sub>Linux · macOS · Windows · GPL-3.0</sub>
- **[LosslessCut](https://github.com/mifi/lossless-cut)** - FFmpeg front end for fast, lossless trimming and cutting of video and audio files. <sub>Linux · macOS · Windows · GPL-2.0</sub>
- **[OpenCut](https://opencut.app/)** - CapCut alternative, still in beta. <sub>MIT</sub>
- **[Shotcut](https://www.shotcut.org/)** - Cross-platform video editor with wide format support. `⚠️ website trackers` <sub>Linux · macOS · Windows · GPL-3.0</sub>

---

### Screen Recording

Many screen recorders upload your recordings to their own cloud and ask you to sign in first. These record locally, with no account.

- **[OBS Studio](https://obsproject.com/)** - Video recording and live streaming studio that records everything locally. `⚠️ website trackers` <sub>Linux · macOS · Windows · GPL-2.0</sub>
- **[Screenity](https://screenity.io/)** - Screen recorder and annotation tool for Chrome that keeps your videos on your device, with no sign-in. <sub>Browser · GPL-3.0</sub>

---

### Design Tools

Adobe's tools collect data through [Creative Cloud](https://tosdr.org/en/service/417), its mobile apps [carry trackers](https://reports.exodus-privacy.eu.org/en/reports/com.adobe.psmobile/latest/), there's [no Linux version](https://helpx.adobe.com/in/download-install/kb/operating-system-guidelines.html), and artists worry it may [train its AI on their work](https://mastodon.art/@Krita/109632425661190494). These alternatives run on any desktop and keep your files yours.

#### InDesign

- **[Scribus](https://github.com/scribusproject/scribus)** - Desktop publishing app for print-ready layouts, typesetting and interactive PDFs. <sub>Linux · macOS · Windows</sub>

#### Photoshop / Illustrator

- **[Excalidraw](https://excalidraw.com/)** - Virtual whiteboard for hand-drawn style sketches and diagrams, with end-to-end encrypted collaboration. <sub>Web · MIT</sub>
- **[GIMP](https://www.gimp.org/)** - Raster image editor for retouching, compositing and drawing, a Photoshop alternative. <sub>Linux · macOS · Windows</sub>
- **[Inkscape](https://inkscape.org/)** - Vector graphics editor, an Illustrator alternative. <sub>Linux · macOS · Windows</sub>
- **[Krita](https://krita.org/)** - Digital painting app built for artists. <sub>GPL-3.0</sub>
- **[LibreSprite](https://libresprite.github.io/)** - Sprite editor and pixel-art animation tool, forked from Aseprite before its license change. <sub>Linux · macOS · Windows · GPL-2.0</sub>

#### Figma

- **[Penpot](https://penpot.app/)** - Design and prototyping platform for product teams that you can host yourself. <sub>self-host · MPL-2.0</sub>

#### Maya / 3ds Max / Cinema 4D

- **[Blender](https://www.blender.org/)** - 3D creation suite for modelling, sculpting, animation, rendering and video editing, developed in the open by the Blender Foundation. <sub>Linux · macOS · Windows</sub>

---

### Creator Tools

Riverside.fm, Restream and Camtasia are closed source, and the hosted ones route your recordings and guests through their servers. These tools run locally or connect people peer to peer.

- **[OBS Studio](https://obsproject.com/)** - Video recording and live streaming studio that records everything locally. `⚠️ website trackers` <sub>Linux · macOS · Windows · GPL-2.0</sub>
- **[Screenity](https://screenity.io/)** - Screen recorder and annotation tool for Chrome that keeps your videos on your device, with no sign-in. <sub>Browser · GPL-3.0</sub>
- **[VDO.Ninja](https://vdo.ninja/)** - Brings remote cameras and guests into OBS or other studio software over peer-to-peer WebRTC. <sub>Web · AGPL-3.0</sub>
  - **[Social Stream Ninja](https://socialstream.ninja/)** - Gathers live chat from many streaming platforms into one feed and overlay. <sub>GPL-3.0</sub>

---

### Fonts

Loading fonts from Google's servers hands every visitor's IP address to Google, which a German court ruled a GDPR violation in 2022. Host the font files yourself, or use a drop-in replacement that doesn't log.

🚫 **Avoid**

- **Google Fonts (loaded from Google)**: a German court ruled in 2022 that a site broke the GDPR by sending visitors' IP addresses to Google this way. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.activemind.legal/guides/ruling-google-fonts/)</sub>

✅ **Use instead**

#### Google Fonts Replacements

- **[Bunny Fonts](https://fonts.bunny.net/)** - Drop-in Google Fonts replacement from EU-based bunny.net, with a no-logging policy.
- **[coolLabs Fonts](https://fonts.coollabs.io/)** - Drop-in Google Fonts replacement that logs nothing about your visitors. <sub>Apache-2.0</sub>

#### Foundries

- **[OpenFoundry](https://open-foundry.com/)** - Curated showcase of open source typefaces that you can use and modify.
- **[Velvetyne](https://www.velvetyne.fr/)** - French type foundry that publishes libre typefaces for personal and commercial use.

---

### Games

Big-name games and engines often come with mandatory accounts, telemetry and paid online plans. These open alternatives play in a similar spirit without any of that.

#### Mario Kart

Nintendo [collects data from Switch owners](https://www.reddit.com/r/privacy/comments/qtj9xt/til_nintendo_collects_data_from_switch_owners/), and an update [turned data sharing back on](https://www.altchar.com/game-news/the-latest-nintendo-switch-update-secretly-turns-on-user-data-sharing-adSyV7t35NPg) for people who had disabled it. Online play also needs a paid subscription.

- **[Dr. Robotnik's Ring Racers](https://www.kartkrew.org/)** - Technical kart racer built on the Sonic Robo Blast 2 engine, the sequel to SRB2Kart. <sub>GPL-2.0</sub>
- **[SuperTuxKart](https://supertuxkart.net/Main_Page)** - 3D arcade kart racer with many characters, tracks and modes, including online play. <sub>[F-Droid](https://f-droid.org/packages/org.supertuxkart.stk/)</sub>

#### Minecraft

Minecraft needs a Microsoft account, and Microsoft has [forced](https://github.com/MultiMC/Launcher/issues/4093) [players](https://www.reddit.com/r/privacy/comments/e6x27o/microsoft_forcing_me_to_give_then_my_phone_number/) to hand over a phone number to keep it. Since snapshot 21w38a the game also sends [telemetry you can't turn off](https://bugs.mojang.com/browse/MC-237493).

🚫 **Avoid**

- **Minecraft**: since 2022 your chat, even on private servers, can be reported to Microsoft and get you banned online. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Source](https://it.slashdot.org/story/22/06/24/1649223/microsoft-will-start-banning-players-from-all-private-minecraft-servers)</sub>

✅ **Use instead**

- **[Cubyz](https://github.com/PixelGuys/Cubyz)** - Voxel sandbox game with far view distances, 3D chunks and procedural crafting. <sub>GPL-3.0</sub>
- **[Luanti](https://www.luanti.org/)** - Voxel game engine and platform for Minecraft-like games and mods, formerly Minetest. <sub>[F-Droid](https://f-droid.org/packages/net.minetest.minetest/)</sub>
  - **[Mineclonia](https://content.luanti.org/packages/ryvnf/mineclonia/)** - Minecraft-like survival game for Luanti, a fork of MineClone2 focused on stability and multiplayer performance.

##### Plugins for Minecraft

If you still play Minecraft, these mods and tools claw back a little privacy, though you are still supporting Microsoft.

- **[FreedomChat](https://github.com/ocelotpotpie/FreedomChat)** - Server plugin that makes player chat unreportable while staying compatible with other plugins. <sub>GPL-3.0</sub>
- **[No Chat Reports](https://github.com/Aizistral-Studios/No-Chat-Reports)** - Mod that strips the signatures from your chat messages, so they can't be tied to your Microsoft account or reported. <sub>WTFPL</sub>
- **[No Telemetry](https://github.com/kb-1000/no-telemetry)** - Mod that turns off the telemetry added in Minecraft 1.18 (snapshot 21w38a). <sub>MPL-2.0</sub>
- **[Prism Launcher](https://prismlauncher.org/)** - Launcher for managing multiple instances and mods without the official launcher. <sub>Linux · macOS · Windows · GPL-3.0</sub>

#### Pokemon

Nintendo [collects data from Switch owners](https://www.reddit.com/r/privacy/comments/qtj9xt/til_nintendo_collects_data_from_switch_owners/), and an update [turned data sharing back on](https://www.altchar.com/game-news/the-latest-nintendo-switch-update-secretly-turns-on-user-data-sharing-adSyV7t35NPg) for people who had disabled it. Online play also needs a paid subscription.

- **[Pokete](https://github.com/lxgr-linux/pokete)** - Small terminal game in the style of the classic Pokemon games. <sub>CLI · GPL-3.0</sub>

#### Sonic the Hedgehog

- **[Sonic Robo Blast 2](https://www.srb2.org/)** - 3D Sonic the Hedgehog fan game built on a modified Doom Legacy engine. <sub>GPL-2.0</sub>

#### Unity / Unreal Engine

- **[Godot Engine](https://godotengine.org/)** - 2D and 3D game engine with no account, royalties or telemetry. <sub>MIT</sub>

---

### Ebooks

Commercial ebook platforms track your reading, tie your books to an account that can be revoked, and expect you to stay online. Keep your library on your own devices or your own server instead.

🚫 **Avoid**

- **Amazon Kindle**: in 2009 Amazon remotely deleted copies of 1984 that people had bought from their Kindles. <sub>[Source](https://www.theregister.com/2009/07/18/amazon_removes_1984_from_kindle/)</sub>
- **Google Play Books**: its privacy policy says the record of each book you buy, title included, can't be deleted. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://books.google.com/googlebooks/privacy.html)</sub>

✅ **Use instead**

- **[Calibre](https://calibre-ebook.com/)** - Ebook manager with format conversion, metadata editing and a built-in reader, all offline. `⚠️ website trackers` <sub>Linux · macOS · Windows · GPL-3.0</sub>
- **[Kavita](https://www.kavitareader.com/)** - Self-hosted digital library for ebooks and comics with a built-in web reader. `⚠️ website trackers` <sub>self-host · GPL-3.0</sub>
- **[Komga](https://komga.org/)** - Self-hosted server for comics, magazines and ebooks with a web reader and OPDS support. <sub>self-host · MIT</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 📱 Mobile & OS

### Android

Apps to replace the Google and manufacturer defaults on an Android phone, and the stores to get them from.

#### Android App Store

🚫 **Avoid**

- **Google Play Store**: its data safety labels were false or misleading for nearly 80% of top apps, Mozilla found in 2023. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.mozillafoundation.org/en/blog/mozilla-study-data-privacy-labels-for-most-top-apps-in-google-play-store-are-false-or-misleading/)</sub>

✅ **Use instead**

- **[Accrescent](https://accrescent.app/)** - App store that pins each app's signing key on first install and signs its repository metadata, still in alpha. <sub>Android · Apache-2.0</sub>
- **[F-Droid](https://f-droid.org/)** - Catalogue of open source Android apps, built from source and labelled when they contain trackers or ads. <sub>Android</sub>
  - **[Droid-ify](https://droidify.app/)** - F-Droid client with a clean interface that can browse any F-Droid repository. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.looker.droidify/)</sub>
- **[Obtainium](https://obtainium.imranr.dev/)** - Installs and updates apps straight from their release pages, such as GitHub or GitLab, and tells you about new versions. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/dev.imranr.obtainium.fdroid/)</sub>

#### Alternative Google Play Store clients

An unofficial app for a service you already use, usually without its ads or tracking. Your account stays with that service, and using an unofficial app can break its rules.

- **[Aurora Store](https://auroraoss.com/)** - Google Play client that can download apps anonymously, without a Google account. `⚠️ website trackers` <sub>Android</sub>

#### Android Debloat Tools

🚫 **Avoid**

- **ADB AppControl**: its terms let it send your PC's IP, hardware details and the apps you remove to a remote server. <sub>[Source](https://appcontrol.neocities.org/pages/terms_of_use)</sub>

✅ **Use instead**

- **[Universal Android Debloater Next Generation](https://github.com/Universal-Debloater-Alliance/universal-android-debloater-next-generation)** - Desktop app that removes preinstalled bloatware from Android phones over ADB, no root needed. <sub>Desktop · GPL-3.0</sub>

#### Android Dialer

🚫 **Avoid**

Dialers from the Play Store may carry ads or trackers and ask for permissions they don't need.

✅ **Use instead**

- **[Fossify Phone](https://www.fossify.org/apps/phone/)** - Phone app with a phonebook, number blocking and multi-SIM support, part of the Fossify fork of Simple Mobile Tools. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.fossify.phone/)</sub>

#### Android File Manager

🚫 **Avoid**

Preinstalled file managers and those from the Play Store may carry ads or trackers and ask for permissions they don't need.

✅ **Use instead**

- **[Amaze File Manager](https://github.com/TeamAmaze/AmazeFileManager)** - Material Design file manager with root access and a built-in FTP server. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.amaze.filemanager/)</sub>
- **[Fossify File Manager](https://www.fossify.org/apps/file-manager/)** - File manager with no ads or tracking that works without internet access. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.fossify.filemanager/)</sub>
- **[Ghost Commander](https://f-droid.org/packages/com.ghostsq.commander/)** - Dual-panel file manager. <sub>Android · [F-Droid](https://f-droid.org/packages/com.ghostsq.commander/)</sub>
- **[Material Files](https://github.com/zhanghai/MaterialFiles)** - Material Design file manager with root, archive, FTP, SFTP, SMB and WebDAV support. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/me.zhanghai.android.files/)</sub>

#### Android Keyboard

🚫 **Avoid**

- **Gboard**: researchers showed in 2022 that the learning updates it sends Google can reveal the words you type. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://arxiv.org/abs/2210.16947)</sub>
- **SwiftKey**: a 2016 sync bug showed users strangers' email addresses and phone numbers as text predictions. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.touchtype.swiftkey/latest/) · [Source](https://www.engadget.com/2016-07-29-swiftkey-leaked-user-email-addresses-as-text-predictions.html)</sub>

✅ **Use instead**

- **[AnySoftKeyboard](https://anysoftkeyboard.github.io/)** - Keyboard with more than 50 languages through add-on packs, plus themes. <sub>Android · Apache-2.0</sub>
- **[FlorisBoard](https://florisboard.org/)** - Customizable keyboard with themes and add-ons, still in beta. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/dev.patrickgold.florisboard/)</sub>
- **[FUTO Keyboard](https://keyboard.futo.tech/)** - Keyboard that works fully offline, including voice input, swipe typing and autocorrect. `⚠️ source-available` <sub>Android</sub>
- **[HeliBoard](https://github.com/HeliBorg/HeliBoard)** - Maintained fork of OpenBoard with glide typing, custom dictionaries and themes, and no internet permission. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/helium314.keyboard/)</sub>
- **[Indic Keyboard](https://gitlab.com/indicproject/indic-keyboard)** - Keyboard for typing in Indic languages alongside English. <sub>Android · [F-Droid](https://f-droid.org/packages/org.smc.inputmethod.indic/)</sub>
- **[Simple Keyboard](https://github.com/rkkr/simple-keyboard)** - Minimal keyboard under 1 MB whose only permission is vibrate. <sub>Android · Apache-2.0 · [F-Droid](https://f-droid.org/packages/rkr.simplekeyboard.inputmethod/)</sub>

#### Android Gallery

Your photos show where you've been and who you were with, including friends and family who never agreed to be in anyone's cloud. Pick a gallery that keeps them on your phone.

> [!NOTE]
> To store and back up your photos privately, see [Photo Storage](#photo-storage).

🚫 **Avoid**

- **Google Photos**: scans your photos, and in 2022 its scan got a father investigated by police over photos taken for a doctor. <sub>[Source](https://gizmodo.com/google-csam-photodna-1849440471)</sub>
- **Amazon Photos**: its privacy notice says Amazon uses the images you store with it to improve its services. <sub>[Source](https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ)</sub>

✅ **Use instead**

- **[Aves](https://github.com/deckerst/aves)** - Gallery and metadata explorer that can view, edit and remove photo metadata such as location. <sub>Android · BSD-3-Clause · [F-Droid](https://f-droid.org/packages/deckers.thibault.aves.libre/)</sub>
- **[Fossify Gallery](https://www.fossify.org/apps/gallery/)** - Photo and video gallery with no ads, a fork of Simple Gallery. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.fossify.gallery/)</sub>

#### Android Launcher

🚫 **Avoid**

Launchers from the Play Store may carry ads or trackers and ask for permissions they don't need.

✅ **Use instead**

- **[Bliss Launcher](https://gitlab.e.foundation/e/os/BlissLauncher3)** - Default launcher of /e/OS, with app folders and notification badges on icons. <sub>Android</sub>
- **[KISS](https://kisslauncher.com/)** - Search-first launcher that finds apps, contacts and settings as you type. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/fr.neamar.kiss/)</sub>
- **[Kvaesitso](https://kvaesitso.mm20.de/)** - Search-focused launcher that finds apps, contacts, files and more from one search bar. <sub>Android · GPL-3.0</sub>
- **[Lawnchair](https://lawnchair.app/)** - Launcher in the style of the Pixel Launcher, with more customization. <sub>Android</sub>
- **[Olauncher](https://github.com/tanujnotes/Olauncher)** - Minimal text-only launcher with no ads, meant to cut your screen time. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/app.olauncher/)</sub>
- **[Pie Launcher](https://github.com/markusfisch/PieLauncher)** - Launcher that opens apps from a pie menu instead of a grid of icons. <sub>Android · MIT · [F-Droid](https://f-droid.org/packages/de.markusfisch.android.pielauncher/)</sub>

#### Android SMS

- **[Fossify Messages](https://www.fossify.org/apps/messages/)** - SMS and MMS app with no ads that works without internet access, a fork of Simple SMS Messenger. <sub>Android · GPL-3.0</sub>
- **[QUIK](https://github.com/quik-sms/quik)** - SMS and MMS app, a maintained fork of QKSMS. <sub>Android · GPL-3.0</sub>

---

### Operating Systems

The operating system sees everything you do on a device. These replace or strip down the systems that report back to Google, Apple and Microsoft.

#### Android

> [!NOTE]
> **App compatibility**: without Google Mobile Services, some apps won't work. [Plexus](https://plexus.techlore.tech/) collects community reports on how apps run with microG or with no Google services at all.

> [!NOTE]
> **Security**: a custom ROM can improve your privacy and still weaken security. Pick one that supports verified boot and encryption and doesn't enable root by default, and avoid userdebug builds. If security matters most, use GrapheneOS on a Google Pixel. [More on Privacy Guides](https://www.privacyguides.org/en/os/android-overview/).

🚫 **Avoid**

Avoid Google's Android and the versions phone makers such as Samsung, Xiaomi or Huawei ship, which send data to their servers. The systems below build on the open source [AOSP](https://source.android.com/) without that.

✅ **Use instead**

##### Android-Based

**GrapheneOS** is the pick for security: its hardening and exploit mitigations make vulnerabilities much harder to exploit, both in the OS and in the apps running on it.

- **[/e/OS](https://e.foundation/e-os/)** - Degoogled Android from Murena that bundles microG and optional Murena cloud services.
- **[CalyxOS](https://calyxos.org/)** - Degoogled Android with optional microG, for Pixel, Fairphone and Motorola phones.
- **[GrapheneOS](https://grapheneos.org/)** - Hardened Android with optional sandboxed Google Play, for **Google Pixel** phones only.
- **[iodéOS](https://iode.tech/iodeos/)** - Degoogled Android with a built-in firewall that blocks ads and trackers across apps.
- **[LineageOS](https://lineageos.org/)** - Community Android distribution that keeps a wide range of devices updated after their makers stop.
- **[LineageOS for microG](https://lineage.microg.org/)** - LineageOS builds that ship microG instead of Google Play Services, with F-Droid included.

The other ROMs support many more devices and offer good privacy, but they can be less secure than GrapheneOS, with a larger attack surface.

##### Based on Linux

- **[Mobian](https://mobian-project.org/)** - Debian packaged for mobile devices such as the PinePhone and Librem 5.
- **[Nura](https://nura.eco/)** - Alpine Linux tuned for phones and other devices, built to keep old hardware useful, formerly postmarketOS.
- **[Plasma Mobile](https://plasma-mobile.org/)** - KDE's Plasma desktop adapted for phones, offered by distributions such as Nura.
- **[PureOS](https://www.pureos.net/)** - Purism's Debian-based system for its Librem laptops and the Librem 5 phone.
- **[Ubuntu Touch](https://ubports.com/)** - Mobile version of Ubuntu, maintained by the UBports community.

#### Smart TV

🚫 **Avoid**

Avoid Android TV, LG webOS and the other systems preinstalled on smart TVs.

✅ **Use instead**

- **[Kodi](https://kodi.tv/)** - Media center that plays your local and network media libraries on almost any device.
- **[LibreELEC](https://libreelec.tv/)** - Minimal Linux system that boots straight into Kodi on Raspberry Pi, x86 and other devices.
- **[OSMC](https://osmc.tv/)** - Kodi-based media center system for the Raspberry Pi and OSMC's own Vero boxes. <sub>GPL-2.0</sub>

Kodi is an app, not an operating system, so you can also build your own setup: a [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) running Linux, plugged into your TV, with [KDE Connect](https://kdeconnect.kde.org/) to control playback from your phone.

See also [Media Streaming Platforms](#media-streaming-platforms).

#### PC / MacOS

🚫 **Avoid**

- **MS Windows**: uploads your disk encryption recovery key to Microsoft by default, and Microsoft has given keys to the FBI. <sub>[ToS;DR](https://tosdr.org/en/service/244) · [Source](https://techcrunch.com/2026/01/23/microsoft-gave-fbi-a-set-of-bitlocker-encryption-keys-to-unlock-suspects-laptops-reports)</sub>

✅ **Use instead**

If you stay on Windows, [Win11Debloat](https://github.com/Raphire/Win11Debloat) or [W10Privacy](https://www.w10privacy.de/english-home/) can turn off many of its privacy-invasive settings.

##### [GNU/Linux](https://www.linux.com/what-is-linux/)

GNU/Linux is a family of open source operating systems, mostly built by their communities. Good places to start:

> [!TIP]
> To try a distribution without installing it, boot it from a [live USB stick](https://www.fosslinux.com/274/how-to-create-linux-mint-live-usb-drive-on-windows.htm), or use [Ventoy](https://www.ventoy.net) to keep several on one stick.

> [!TIP]
> To keep your current system, install Linux alongside it with [dual boot](https://averagelinuxuser.com/dualboot-linux-windows/).

> [!NOTE]
> Distributions differ in how free they are and how well they respect your privacy, so read up before you pick one.

- **[Fedora](https://fedoraproject.org/)** - Community distribution sponsored by Red Hat, with recent software on a six-month release cycle.
- **[Kicksecure](https://www.kicksecure.com/)** - Debian hardened by the Whonix developers, with security settings turned on by default.
- **[Mint (Cinnamon)](https://linuxmint.com/)** - Beginner-friendly distribution based on Ubuntu, with a desktop that feels familiar to Windows users.
- **[Qubes OS](https://www.qubes-os.org/)** - Runs each part of your digital life in its own isolated virtual machine, so one compromise doesn't spread.
- **[secureblue](https://secureblue.dev/)** - Hardened images built on Fedora Atomic Desktops, with security-focused defaults and a hardened browser. <sub>Apache-2.0</sub>
- **[Tails](https://tails.net/)** - Portable system that routes everything through Tor and forgets everything when you shut it down.
- **[Whonix](https://www.whonix.org/)** - Runs inside virtual machines and forces every connection through Tor, so apps can't leak your real IP.

##### Other OS

- **[AtlasOS](https://atlasos.net/)** - Modified Windows that strips out built-in tracking and tunes it for performance and latency. <sub>GPL-3.0</sub>
- **[ReactOS](https://reactos.org/)** - Reimplementation of Windows that can run Windows apps and drivers, still in alpha. <sub>GPL-2.0</sub>
- **[RedoxOS](https://www.redox-os.org/)** - Unix-like operating system written in Rust, still in development.

---

### Home Assistants

Smart speakers keep a microphone on in your home and send recordings to their maker, where they have been stored and reviewed by staff ([1](https://www.theguardian.com/technology/2019/oct/09/alexa-are-you-invading-my-privacy-the-dark-side-of-our-voice-assistants), [2](https://www.theregister.com/2020/08/08/ai_in_brief/), [3](https://www.networkworld.com/article/962546/virtual-assistants-hear-everything-so-watch-what-you-say-i-m-not-kidding.html), [4](https://www.democracynow.org/2017/1/4/privacy_advocates_warn_of_potential_surveillance), [5](https://www.mirror.co.uk/news/weird-news/woman-finds-amazon-thousands-recordings-25240984), [6](https://www.seattletimes.com/business/locked-down-lawyers-warned-alexa-is-hearing-confidential-calls/), [7](https://hide.me/en/blog/assistant-devices-are-a-privacy-nightmare/)). Pick one that runs on your own hardware, and don't give the cloud ones as gifts.

🚫 **Avoid**

- **Google Home**: in 2026 Google agreed to pay $68 million over claims its Assistant recorded people without the wake word. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.classaction.org/news/68m-google-assistant-settlement-ends-class-action-lawsuit-claiming-devices-start-recording-without-user-activation)</sub>
- **Alexa**: the FTC fined Amazon $25 million in 2023 for keeping children's Alexa voice recordings indefinitely. <sub>[ToS;DR](https://tosdr.org/en/service/190) · [Source](https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-doj-charge-amazon-violating-childrens-privacy-law-keeping-kids-alexa-voice-recordings-forever)</sub>
- **Siri**: in 2025 Apple settled claims that Siri recorded private conversations without consent for $95 million. <sub>[Source](https://scott-scott.com/court-grants-final-approval-of-95m-apple-siri-settlement/)</sub>

✅ **Use instead**

- **[Home Assistant](https://www.home-assistant.io/)** - Home automation hub that runs on your own hardware and controls your devices locally, no cloud account needed. <sub>Apache-2.0</sub>
- **[OpenVoiceOS](https://www.openvoiceos.org/)** - Voice assistant you run on your own hardware, a community successor to Mycroft. <sub>Apache-2.0</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 🛠️ Developer & Self-hosting

### Developer Tools

Many developer tools phone home with usage data and sometimes snippets of your code. These run locally and keep your work on your machine.

- **[Beekeeper Studio](https://www.beekeeperstudio.io)** - Desktop SQL editor and database manager for Postgres, MySQL, SQLite and many other databases. <sub>Linux · macOS · Windows</sub>
- **[CrowdSec](https://www.crowdsec.net/)** - Collaborative intrusion prevention for servers, like fail2ban with crowd-sourced blocklists. `⚠️ website trackers` <sub>MIT</sub>
- **[Hetty](https://hetty.xyz/)** - HTTP toolkit for security research, as an alternative to Burp Suite Pro. <sub>MIT</sub>

#### IDEs

🚫 **Avoid**

Proprietary editors often ship with telemetry turned on by default.

✅ **Use instead**

- **[GNU Emacs](https://www.gnu.org/software/emacs/)** - Extensible, self-documenting editor from the GNU Project that you can shape into a full IDE.
- **[Neovim](https://neovim.io/)** - Extensible Vim-based editor with built-in Lua scripting and language server support.
- **[VSCodium](https://vscodium.com/)** - VS Code built from its open source code, without Microsoft's telemetry or its [proprietary license](https://code.visualstudio.com/license). <sub>Linux · macOS · Windows · MIT</sub>

---

### Version Control

Hosting your code on a big platform hands your activity and your code to one company. A non-profit host or a forge you run yourself keeps you in charge of both.

🚫 **Avoid**

- **GitHub**: owned by Microsoft, and public code hosted there was used to train Copilot. <sub>[ToS;DR](https://tosdr.org/en/service/297)</sub>

✅ **Use instead**

- **[Codeberg](https://codeberg.org/)** - Non-profit Git hosting for free software projects, run on Forgejo by a German association.
- **[Forgejo](https://forgejo.org/)** - Lightweight self-hosted Git forge developed by a community under the non-profit Codeberg e.V. <sub>self-host</sub>
- **[Gitea](https://about.gitea.com/)** - Lightweight self-hosted Git forge, and the project Forgejo was forked from. `⚠️ website trackers` <sub>self-host · MIT</sub>
- **[GitLab](https://about.gitlab.com/)** - Full DevOps platform with Git hosting, CI and issue tracking that you can run on your own server. `⚠️ website trackers`
- **[Radicle](https://radicle.dev/)** - Peer-to-peer code collaboration on Git, with repositories replicated across peers and no central server in control.

---

### Remote Access and Control

Remote desktop tools can see and control everything on a machine, so trust matters more here than almost anywhere. Prefer open tools you can run on your own server, with no vendor account in the middle.

- **[Apache Guacamole](https://guacamole.apache.org)** - Self-hosted gateway that gives you RDP, VNC and SSH access from a browser, with no client to install. <sub>self-host · Apache-2.0</sub>
- **[Aspia](https://aspia.org/)** - Remote desktop and file transfer with a router you can host yourself, so connections don't depend on a vendor. <sub>self-host · GPL-3.0</sub>
- **[MeshCentral](https://meshcentral.com/)** - Self-hosted web server for managing and remotely controlling many devices from a browser. <sub>self-host · Apache-2.0</sub>
- **[Remmina](https://remmina.org/)** - Remote desktop client for Linux that connects over RDP, VNC, SPICE and SSH. <sub>Linux</sub>
- **[RustDesk](https://rustdesk.com/)** - Remote desktop app that connects through its developers' public servers by default, which log your IP address, device and session details, or through a server you host. `⚠️ website trackers` <sub>self-host · AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.carriez.flutter_hbb/)</sub>
- **[screego](https://screego.net/)** - Self-hosted screen sharing over WebRTC, built for developers. <sub>self-host · GPL-3.0</sub>
- **[Sunshine + Moonlight](https://app.lizardbyte.dev/Sunshine)** - Low-latency desktop and game streaming, with Sunshine on the host and Moonlight clients connecting to it. `⚠️ website trackers` <sub>self-host · GPL-3.0</sub>
- **[UltraVNC](https://uvnc.com/)** - VNC server and viewer for Windows, with file transfer and optional encryption plugins. `⚠️ website trackers` <sub>Windows · GPL-3.0</sub>

---

### Artificial Intelligence

Cloud AI services see everything you type, tie it to your account and payment details, and may keep it or train on it. Running models on your own hardware keeps your prompts with you; when you do need a cloud model, pick tools that let you choose the provider.

#### ChatGPT

- **[Jan](https://jan.ai/)** - Desktop chat app that runs open models offline, with optional connections to cloud providers.
- **[LibreChat](https://www.librechat.ai/)** - Self-hosted chat interface that puts many AI providers and local models behind one UI you control. <sub>self-host · MIT</sub>
- **[llama.cpp](https://github.com/ggml-org/llama.cpp)** - C/C++ engine that runs open language models locally on ordinary CPUs and GPUs. <sub>MIT</sub>
- **[LocalAI](https://localai.io/)** - Self-hosted OpenAI-compatible API that runs language, image and voice models on your own hardware. <sub>self-host · MIT</sub>
- **[ollama](https://ollama.com/)** - Runs open models locally with one command; its optional cloud models can be switched off entirely. <sub>MIT</sub>
- **[Open WebUI](https://openwebui.com)** - Self-hosted ChatGPT-style web interface for Ollama and other local or OpenAI-compatible models. `⚠️ source-available` `⚠️ website trackers` <sub>self-host</sub>
- **[PasteGuard](https://pasteguard.com/)** - Proxy that masks personal data and secrets before your prompts reach a cloud AI provider, then restores them in the reply. <sub>self-host · Apache-2.0</sub>
- **[Shimmy](https://github.com/Michael-A-Kuykendall/shimmy)** - Rust inference server with an OpenAI-compatible API that runs GGUF models locally on your GPU. <sub>Apache-2.0</sub>
- **[Tinfoil](https://tinfoil.sh/)** - Cloud AI chat and API that run models inside attested confidential-computing enclaves, so the operator can't read your prompts. <sub>AGPL-3.0</sub>

#### AI Coding

- **[Aider](https://aider.chat)** - Terminal pair programmer that edits code in your local git repository with the model you choose. <sub>CLI · Apache-2.0</sub>
- **[Cline](https://cline.bot/)** - Coding agent for your editor that works with your own API keys or local models. `⚠️ telemetry opt-out` <sub>Apache-2.0</sub>
  - **[Zoo Code](https://www.zoocode.dev/)** - Community continuation of Roo Code, itself a Cline fork, after the Roo team archived it. <sub>fork · Apache-2.0</sub>
- **[OpenCode](https://opencode.ai/)** - Coding agent that connects to local models or any of more than 75 model providers. <sub>MIT</sub>
- **[Tabby](https://www.tabbyml.com/)** - Self-hosted code completion server that runs on your own hardware, an alternative to GitHub Copilot. `⚠️ telemetry opt-out` `⚠️ website trackers` <sub>self-host</sub>

#### Text to Speech

- **[Chatterbox](https://github.com/resemble-ai/chatterbox)** - Text-to-speech model with voice cloning that runs entirely on your own machine. <sub>MIT</sub>
- **[eSpeak NG](https://github.com/espeak-ng/espeak-ng)** - Compact offline speech synthesizer for more than a hundred languages, robotic-sounding but very light. <sub>GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.reecedunn.espeak/)</sub>
- **[Kokoro FastAPI](https://github.com/remsky/Kokoro-FastAPI)** - Self-hosted OpenAI-compatible server for the [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) text-to-speech model, on CPU or GPU. <sub>Apache-2.0</sub>
- **[Piper](https://github.com/OHF-Voice/piper1-gpl)** - Fast local neural text-to-speech that runs well even on a Raspberry Pi. <sub>GPL-3.0</sub>

#### Speech to Text

##### Models

- **[FunASR](https://github.com/modelscope/FunASR)** - Local speech recognition toolkit with voice detection, punctuation and speaker labels; it downloads models from ModelScope by default. <sub>MIT</sub>
- **[Moonshine](https://moonshine.ai/)** - Speech recognition models built for fast, low-latency transcription on the device itself.
- **[OpenAI Whisper](https://github.com/openai/whisper)** - Speech recognition model you can run offline to transcribe many languages and translate them into English. <sub>MIT</sub>
  - **[faster-whisper](https://github.com/SYSTRAN/faster-whisper)** - Whisper reimplemented on CTranslate2, up to four times faster with less memory. <sub>MIT</sub>
  - **[whisper.cpp](https://github.com/ggml-org/whisper.cpp)** - C/C++ port of Whisper that runs efficiently on ordinary CPUs and GPUs. <sub>MIT</sub>
- **[Parakeet TDT](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3)** - NVIDIA speech recognition model that transcribes quickly and accurately on your own hardware.

##### Apps and services

- **[FUTO Voice Input](https://voiceinput.futo.org/)** - Voice input for Android that works with other keyboards and runs entirely on the device. `⚠️ source-available` <sub>Android</sub>
- **[Minutes](https://useminutes.app/)** - Records and transcribes meetings and voice memos on your device, with search over the history for local AI tools.
- **[OpenWhispr](https://openwhispr.com/)** - Desktop dictation app that can transcribe fully offline with local models, with cloud processing as an option. `⚠️ website trackers` <sub>Linux · macOS · Windows · MIT</sub>
- **[Sasayaki](https://pluja.github.io/sasayaki/)** - Tiny dictation app that types what you say using any OpenAI-compatible speech server, including your own. <sub>Android</sub>
- **[Speaches](https://speaches.ai/)** - Self-hosted OpenAI-compatible server for streaming transcription, translation and speech generation. <sub>MIT</sub>
- **[Vocalinux](https://vocalinux.com/)** - Voice dictation for Linux that types into any app, with speech recognition running on your computer. `⚠️ website trackers` <sub>Linux · AGPL-3.0</sub>

#### Image Generation

- **[ComfyUI](https://www.comfy.org/)** - Node-based interface for building image and video generation pipelines that run on your own machine. `⚠️ website trackers` <sub>GPL-3.0</sub>
- **[InvokeAI](https://github.com/invoke-ai/InvokeAI)** - Local image generation studio with a canvas for editing, inpainting and outpainting. <sub>Apache-2.0</sub>
- **[SwarmUI](https://github.com/mcmonkeyprojects/SwarmUI)** - Local web interface for Stable Diffusion and other image models, running on a ComfyUI backend. <sub>MIT</sub>

---

### Automation

Cloud automation services hold access tokens for every account you connect and run your workflows on their servers. A self-hosted tool keeps those credentials and your data at home.

🚫 **Avoid**

- **IFTTT**: your workflows run on its servers, holding tokens to all your connected accounts. <sub>[ToS;DR](https://tosdr.org/en/service/236)</sub>
- **Zapier**: in 2025 an intruder got into its code repositories, where some customer data had been copied. <sub>[ToS;DR](https://tosdr.org/en/service/2131) · [Source](https://threats.wiz.io/all-incidents/zapier-data-breach)</sub>

✅ **Use instead**

- **[Huginn](https://github.com/huginn/huginn)** - Self-hosted agents that watch websites, feeds and APIs and act for you, an alternative to IFTTT and Zapier. <sub>self-host · MIT</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 💸 Money

### Payments

Cards, PayPal and bank transfers tie every purchase to your name and leave a record with several companies. Cash and private cryptocurrencies like Monero let you pay without that trail.

> [!WARNING]
> [Bitcoin](https://bitcoin.org) is not anonymous or private: it is pseudonymous, and every transaction is public and traceable. For a basic introduction, [see aantonop's video](https://yewtu.be/watch?v=JN1Bowgcle8). More advanced users can watch this [Bitcoin privacy series](https://yewtu.be/watch?v=QEnL5k0R08w).

🚫 **Avoid**

- **Visa / Mastercard**: your card purchases feed Mastercard audience segments, like affluent shoppers, sold on data marketplaces. <sub>[Source](https://www.americanbanker.com/news/mastercard-removes-some-ads-for-customer-transaction-data)</sub>
- **PayPal**: fined $2 million by New York in 2025 after a 2022 breach exposed 35,000 customers' Social Security numbers. <sub>[ToS;DR](https://tosdr.org/en/service/230) · [Source](https://therecord.media/paypal-penalty-millions-data-breach)</sub>

✅ **Use instead**

- **Cash** - Paying in person with notes and coins leaves no record linked to you.
- **[Monero](https://www.getmonero.org/)** - Cryptocurrency that hides the sender, receiver and amount of every transaction by default.

#### Wallets

- **[Cake Wallet](https://cakewallet.com)** - Non-custodial wallet for Monero, Bitcoin and other coins. <sub>MIT</sub>
- **[Feather Wallet](https://featherwallet.org/)** - Lightweight Monero desktop wallet with built-in Tor and coin control. <sub>Desktop · BSD-3-Clause</sub>
- **[Sparrow Wallet](https://www.sparrowwallet.com/)** - Bitcoin desktop wallet with coin control and support for connecting to your own node. <sub>Desktop · Apache-2.0</sub>
- **[Wasabi Wallet](https://www.wasabiwallet.io/)** - Non-custodial Bitcoin desktop wallet with built-in Tor and coinjoin support. <sub>Desktop · MIT</sub>

#### Payment Processors

- **[BTCPay Server](https://btcpayserver.org)** - Self-hosted, non-custodial processor for accepting Bitcoin and other cryptocurrencies without a middleman. <sub>self-host · MIT</sub>

#### Where to use Monero and Bitcoin

- **[kycnot.me](https://kycnot.me/)** - Directory of exchanges, payment processors and other services that don't require identity verification (KYC). `⚠️ source-available`

---

### Personal Finances

Your transactions reveal where you live, shop and travel. These tools keep your financial records on your own device or server instead of a company's cloud.

#### Full Featured Financial Management

- **[Actual](https://actualbudget.org)** - Envelope budgeting app that runs locally, with optional end-to-end encrypted sync through your own server. <sub>self-host · MIT</sub>
- **[ezBookkeeping](https://ezbookkeeping.mayswind.net/)** - Lightweight self-hosted bookkeeping app with a mobile-friendly web interface. `⚠️ website trackers` <sub>self-host · MIT</sub>
- **[Firefly III](https://www.firefly-iii.org/)** - Self-hosted personal finance manager with budgets, rules and reports. <sub>self-host · AGPL-3.0</sub>
- **[GnuCash](https://gnucash.org/)** - Double-entry accounting for personal and small-business finances, stored in local files. <sub>Desktop</sub>
- **[Sure](https://sure.am)** - Self-hosted personal finance app, a community fork of the archived [Maybe](https://github.com/maybe-finance/maybe). `⚠️ website trackers` <sub>self-host · AGPL-3.0</sub>

#### Budget Management

- **[My Expenses](https://www.myexpenses.mobi/)** - Expense tracker with multiple accounts, budgets and optional sync through your own cloud storage. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/org.totschnig.myexpenses/) (Play Store version has trackers)</sub>
- **[ProExpense](https://github.com/arduia/ProExpense)** - Expense notebook for recording your daily spending on the phone. <sub>Android · GPL-3.0 · [F-Droid](https://f-droid.org/packages/com.arduia.expense/) (Play Store version has trackers)</sub>
- **[Wallos](https://wallosapp.com)** - Self-hosted tracker for subscriptions and recurring expenses, with renewal reminders. <sub>self-host · GPL-3.0</sub>

#### Shared Expenses

🚫 **Avoid**

- **Tricount**: 8 trackers in its Android app, from Facebook, Google and Huawei among others. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.tribab.tricount.android/latest/)</sub>
- **Splitwise**: Google and Amazon trackers in its Android app, under a poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/7468) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.Splitwise.SplitwiseMobile/latest/)</sub>

✅ **Use instead**

- **[IHateMoney](https://ihatemoney.org/)** - Shared budget manager for groups and trips, hosted or self-hosted.
  - **[MoneyBuster](https://gitlab.com/eneiluj/moneybuster)** - Android client for Nextcloud Cospend and IHateMoney. <sub>Android · [F-Droid](https://f-droid.org/packages/net.eneiluj.moneybuster/)</sub>
- **[Nextcloud Cospend](https://apps.nextcloud.com/apps/cospend)** - Nextcloud app for managing shared budgets, inspired by IHateMoney. <sub>AGPL-3.0</sub>
  - **[MoneyBuster](https://gitlab.com/eneiluj/moneybuster)** - Android client for Nextcloud Cospend and IHateMoney. <sub>Android · [F-Droid](https://f-droid.org/packages/net.eneiluj.moneybuster/)</sub>
- **[Spliit](https://spliit.app)** - Splitwise alternative for sharing expenses with friends and family, no account needed. <sub>MIT</sub>
- **[SplitPro](https://splitpro.app)** - Splitwise alternative for sharing expenses with friends, which you can self-host. <sub>MIT</sub>

#### Portfolio trackers

- **[Ghostfolio](https://ghostfol.io)** - Wealth management app for tracking stocks, ETFs and crypto, which you can self-host. <sub>AGPL-3.0</sub>
- **[Portfolio Performance](https://www.portfolio-performance.info/en/)** - Desktop app that calculates the overall performance of your investment portfolio, with data kept in local files. <sub>Desktop · EPL-1.0</sub>
- **[Rotki](https://rotki.com)** - Portfolio tracking, accounting and tax reporting for crypto and other assets, with your data stored locally. <sub>AGPL-3.0</sub>

<sub>[↑ Back to contents](#contents)</sub>

## 🧭 Everyday

### Maps and Navigation

Mainstream map apps log where you go and what you search for. Apps built on OpenStreetMap data can work offline, so your location stays on your device.

🚫 **Avoid**

- **Google Maps**: a 2018 AP investigation found it saved your location whenever you opened Maps, even with Location History off. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.deseret.com/2018/8/13/20651153/ap-exclusive-google-tracks-your-movements-like-it-or-not/)</sub>
- **Yandex Maps**: 11 trackers in its Android app, from a company bound by Russian surveillance law. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/ru.yandex.yandexmaps/latest/)</sub>
- **Sygic**: 8 trackers in its Android app. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.sygic.aura/latest/)</sub>
- **Bing Maps**: under Microsoft's very poorly rated privacy policy. <sub>[ToS;DR](https://tosdr.org/en/service/244)</sub>

✅ **Use instead**

- **[CoMaps](https://www.comaps.app/)** - Community-led fork of Organic Maps with offline maps and navigation. <sub>Android · iOS · fork · [F-Droid](https://f-droid.org/packages/app.comaps.fdroid/)</sub>
- **[OpenStreetMap (OSM)](https://www.openstreetmap.org/)** - Collaborative world map built by volunteers, and the open data behind most apps in this section. <sub>GPL-2.0</sub>
  - **[OsmAnd](https://osmand.net/)** - Offline maps and navigation built on OpenStreetMap, with a large set of features. `⚠️ telemetry opt-out` <sub>Android · iOS · [F-Droid](https://f-droid.org/packages/net.osmand.plus/)</sub>
- **[Organic Maps](https://organicmaps.app/)** - Offline maps and navigation built on OpenStreetMap, popular with hikers and cyclists. <sub>Android · iOS · [F-Droid](https://f-droid.org/packages/app.organicmaps/)</sub>
- **[Pure Maps](https://rinigus.github.io/pure-maps/)** - Maps and navigation for Linux phones, Sailfish OS and desktop, fully offline with OSM Scout Server. <sub>Linux · GPL-3.0</sub>

---

### Fitness and Health

Health data is among the most sensitive data you have, and the most sought after. Skip the apps from Google, Fitbit, Huawei, Xiaomi and other data-hungry companies, and pick ones that keep your records on your device or your own server.

#### Fitness trackers

- **[FitoTrack](https://codeberg.org/jannis/FitoTrack)** - Workout tracker that records your GPS activities and keeps them on the device. <sub>Android · [F-Droid](https://f-droid.org/packages/de.tadris.fitness/)</sub>
- **[FitTrackee](https://codeberg.org/FitTrackee/FitTrackee)** - Self-hosted Strava alternative for recording and analyzing outdoor activities from GPS files. <sub>self-host</sub>
- **[Gadgetbridge](https://gadgetbridge.org/)** - Use your smartwatch or fitness band without the vendor's app or cloud. <sub>Android</sub>
- **[OpenTracks](https://opentracksapp.com/)** - Sport tracker that records your activities on the device and has no internet permission. <sub>Android</sub>
- **[RunnerUp](https://github.com/jonasoreland/runnerup)** - Run and bike tracker that keeps activities on the device, with optional sync to services like Strava. <sub>Android · GPL-3.0</sub>

#### Workout planners

- **[wger](https://wger.de/)** - Self-hosted manager for your workouts, exercises and nutrition. <sub>self-host · AGPL-3.0</sub>

#### Food

- **[Open Food Facts](https://world.openfoodfacts.org/)** - Collaborative database of food products, with ingredients, additives and nutrition data. <sub>AGPL-3.0</sub>
  - **[OFF Apps](https://world.openfoodfacts.org/open-food-facts-mobile-app)** - Mobile apps that scan a product's barcode and show its ingredients, additives and nutrition data. <sub>Android · iOS · Apache-2.0</sub>

#### Menstrual cycle trackers

Cycle data is intimate. Rather than mainstream trackers like Clue or Period Tracker, use one that keeps it on your device or encrypts it end to end.

- **[Bluemoon](https://gitlab.com/ngrob/bluemoon-android)** - Period tracker that keeps your data on the device. <sub>Android · [F-Droid](https://f-droid.org/packages/ch.nilsgrob.android.bluemoon/)</sub>
- **[Drip](https://dripapp.org/)** - Menstrual cycle and fertility tracker that keeps everything you enter on your device. <sub>Android · iOS · [F-Droid](https://f-droid.org/packages/com.drip/)</sub>
- **[Euki](https://eukiapp.org/)** - Period and sexual health tracker built to keep your data on your phone. `⚠️ website trackers` <sub>Android · iOS · GPL-3.0</sub>
- **[Periodical](https://codeberg.org/askaaron/periodical)** - Calendar for tracking your period and estimating fertile days. <sub>Android · [F-Droid](https://f-droid.org/packages/de.arnowelzel.android.periodical/)</sub>
- **[Poppy](https://poppy.usenostr.org)** - Period tracker in the browser that stores data locally and can sync end-to-end encrypted through Nostr relays, no account needed.

#### Medical health

- **[MedTimer](https://github.com/Futsch1/medTimer)** - Medication reminder that keeps all data on the device and has no internet permission. <sub>Android · MIT · [F-Droid](https://f-droid.org/packages/com.futsch1.medtimer/)</sub>

---

### Dating Apps

Mainstream dating apps collect intimate data and profit from it. Tinder in particular has been found to [charge some users up to five times more for the same service](https://www.mozillafoundation.org/en/blog/new-research-tinders-opaque-unfair-pricing-algorithm-can-charge-users-up-to-five-times-more-for-same-service/), [estimate your intelligence and other traits and pass them to third parties](https://www.reddit.com/r/privacy/comments/k7x4s7/tinder_extrapolates_estimations_on_your/), and [keep far more about you than you might expect](https://www.theguardian.com/technology/2017/sep/26/tinder-personal-data-dating-app-messages-hacked-sold).

🚫 **Avoid**

- **Tinder**: a 2020 Norwegian Consumer Council study found it shared user data with at least 45 Match Group firms. <sub>[ToS;DR](https://tosdr.org/en/service/462) · [Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.tinder/latest/) · [Source](https://www.thelocal.no/20200114/norway-consumer-rights-group-accuses-tinder-grindr-of-illegally-sharing-data)</sub>
- **Grindr**: fined NOK 65 million in Norway in 2021 for sharing users' data with advertisers without valid consent. <sub>[Source](https://techcrunch.com/2021/12/15/grindr-final-gdpr-fine/)</sub>
- **Badoo**: settled for $40 million in 2024, with Bumble, over claims it scanned Illinois users' faces. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/com.badoo.mobile/latest/) · [Source](https://idtechwire.com/illinoisan-bumble-badoo-users-may-get-payout-from-40-million-biometric-privacy-settlement/)</sub>
- **Lovoo**: in 2019 journalists used its Radar feature to locate users to within 30 to 50 meters. <sub>[Exodus](https://reports.exodus-privacy.eu.org/en/reports/net.lovoo.android/latest/) · [Source](https://netzpolitik.org/2019/sicherheitsluecke-dating-app-lovoo-gibt-standortdaten-preis/)</sub>

✅ **Use instead**

- **[Alovoa](https://alovoa.com/)** - Dating platform with no ads, no paid features and no selling of your data. <sub>AGPL-3.0 · [F-Droid](https://f-droid.org/packages/com.alovoa.expo/)</sub>

---

### Location Tracking

Your location history shows where you live, work and sleep. These tools record it on your own device or server rather than a Google account.

🚫 **Avoid**

- **Google location history**: in 2022 Google paid $391.5 million to 40 US states for tracking people's location after they turned it off. <sub>[ToS;DR](https://tosdr.org/en/service/217) · [Source](https://www.cnbc.com/2022/11/14/google-settles-with-40-states-over-location-tracking-practices.html)</sub>
- **Google Find Hub (formerly Find My Device)**: reports your devices' locations to Google. <sub>[ToS;DR](https://tosdr.org/en/service/217)</sub>

✅ **Use instead**

#### Tracking

- **[Dawarich](https://dawarich.app)** - Self-hosted alternative to Google Timeline for storing and browsing your location history. <sub>self-host · AGPL-3.0</sub>
- **[Nextcloud PhoneTrack](https://apps.nextcloud.com/apps/phonetrack)** - Nextcloud app for your location history, fed by its [Android app](https://gitlab.com/eneiluj/phonetrack-android) or [other loggers](https://github.com/julien-nc/phonetrack/blob/main/doc/user.md#logging-methods), which can cache positions offline and upload them in batches. <sub>AGPL-3.0</sub>
- **[OwnTracks](https://owntracks.org/)** - Phone app that sends your location to your own server, focused on where you are now rather than full history. <sub>Android · iOS · EPL-1.0 · [F-Droid](https://f-droid.org/packages/org.owntracks.android/)</sub>
- **[Traccar](https://www.traccar.org/)** - Self-hosted GPS tracking server, made for dedicated GPS tracking devices. `⚠️ website trackers` <sub>self-host · Apache-2.0</sub>

#### Find My Device

- **[Find My Device](https://fmd-foss.org/)** - Locate and control your Android phone remotely over SMS, messengers or a self-hosted FMD Server. <sub>Android</sub>
- **[GPSLogger](https://gpslogger.app/)** - Lightweight GPS logger that saves your tracks to local files, with optional uploads to places you choose. <sub>Android · [F-Droid](https://f-droid.org/packages/com.mendhak.gpslogger/)</sub>

---

### Utilities

- **[Deskreen](https://deskreen.com/)** - Turns any device with a web browser into a second screen for your computer over the local network. `⚠️ website trackers` <sub>Desktop · AGPL-3.0</sub>
- **[JustDeleteMe](https://justdeleteme.xyz/)** - Directory of direct links for deleting your accounts from web services, rated by difficulty; sister project [JustGetMyData](https://github.com/daviddavo/jgmd) covers getting your data out. <sub>MIT</sub>
- **[OpenTabletDriver](https://opentabletdriver.net/)** - User-mode driver for drawing tablets that replaces vendor drivers, some of which [report every app you open](https://robertheaton.com/2020/02/05/wacom-drawing-tablets-track-name-of-every-application-you-open/). <sub>Desktop · LGPL-3.0</sub>

<sub>[↑ Back to contents](#contents)</sub>

## Privacy vs Security vs Anonymity

Privacy, security and anonymity are often used interchangeably, but they mean different things.

- Privacy is control over your personal information: knowing what is collected about you, and deciding who can access it and how.

- Security is protection of your information from unauthorized access or theft, so attackers can't get at it.

- Anonymity means your actions can't be traced back to you. Someone may see what is done, but not who did it.

Privacy and security don't always come together. Google's systems are secure and hard to break into, yet Google still has access to your personal data and uses it.

Privacy and anonymity don't always come together either. Signal doesn't collect what you say, who you talk to or how you use the app, so it offers strong privacy, but it isn't anonymous: you register with a phone number, which is often tied to your identity.

Some services offer all three. This list focuses on privacy: alternatives that give you control over your data and don't collect or sell it.

## Legend

Small text after an entry lists its platforms, features and license, and links its [F-Droid](https://f-droid.org) build for Android apps. "Play Store version has trackers" means the Google Play build includes ads or analytics libraries, according to [Exodus Privacy](https://exodus-privacy.eu.org), while the F-Droid build doesn't.

Tags point out a trade-off:

- `💀 inactive`: development has stalled. It still works and has no maintained alternative, so check before relying on it.
- `⚠️ closed source`: the code isn't public. Listed only because of a long, trusted record.
- `⚠️ source-available`: the code is public, but the license isn't an open source one.
- `⚠️ website trackers`: the project's website loads third-party trackers. That says nothing about the app itself.
- `⚠️ telemetry opt-out`: the app sends usage data by default, but a setting turns it off.
- `⚠️ closed server`: the server code isn't public.
- `⚠️ account required`: an account is needed to use it.

🚫 **Avoid** lists name mainstream services and the main privacy problem with each. The links lead to the evidence: [ToS;DR](https://tosdr.org) grades privacy policies, [Exodus Privacy](https://exodus-privacy.eu.org) lists the trackers in Android apps, and Source points to a report.

- [OneMira C1](https://onemira.com/products/c1) - Standalone AI voice recorder with Local AI summaries, automatic Speaker ID across 99 languages, Zero Cloud privacy ($0/month subscription), Google Native OKF Markdown Wiki, and native MCP/CLI integration ([GitHub](https://github.com/onemira-space/onemira-mcp)).
