# thesfcommons.com

Static copy of www.thesfcommons.com, moved off Webflow on 2026-11-04.
Every page, image, font, video, stylesheet and script is in this folder.
GSAP, Matter.js, typed.js, SplitType and jQuery 3.6 still load from public
CDNs (cdnjs, unpkg, code.jquery.com), and the Luma calendar and Substack
embeds load from their own services. None of that is Webflow.

## Layout

- `public/` — the live website. This is the only folder a host needs.
  Pages: home, about, events, rentals, host-at-the-commons, membership,
  membership-copy-2, thespace, youre-invited (4 variants), plus `404.html`.
  `assets/` holds 375 files, about 170 MB.
- `webflow-export/` — the raw zip Webflow produced, for reference only.
- `netlify.toml` — publishes `public/` and sets long cache headers on assets.

## Changes made during the move

- The custom animation script used to load from a CodeSandbox URL
  (`dldwcx.csb.app/commons.js`), which could vanish any day. It now lives at
  `public/assets/commons.js`.
- That script and its four library dependencies were `async` on Webflow and
  only worked because the CodeSandbox host was slow. They are now `defer`,
  so they always run in order.
- Google Analytics (G-8RE76KB3WE) loaded through a Webflow proxy URL. It now
  loads from googletagmanager.com directly, so analytics keep working.
- The hero video's `.mp4` variant returned 403 from Webflow's CDN even on
  the live site, so only the `.webm` is referenced. Browsers that need mp4
  (older Safari) show the poster image instead.

## Site header and polaroids (added 2026-11-04)

- The header on every page (logo, hamburger menu, pink "Join as a member"
  button) is the `<header class="sh">` block near the top of each page's
  HTML, styled by `public/assets/site-header.css` and driven by
  `public/assets/site-header.js`. To change a menu link, edit that block in
  each of the 8 pages (home, about, events, rentals, host-at-the-commons,
  membership, membership-copy-2, thespace). The "you're invited" pages have
  no header on purpose.
- The Events page header is a scrolling photo marquee: markup in
  `public/events/index.html` (the same four photos repeated three times for a
  seamless loop), styles in `public/assets/marquee.css`.
- The polaroid stacks on the home page cycle through their photos via
  `public/assets/polaroids.js`. Hovering a pillar title (Expand, Discover,
  Heal, Actualize) brings that pillar's photo to the front. To change the
  photos, swap the image files referenced by the `<img class="polaroid ...">`
  tags in `public/index.html`.

## Known quirks carried over from the live site

Three JavaScript errors (`rotationTime` already declared, `onmouseover` on
null, `tagName` on null) come from custom code on the pages and happen on
the live Webflow site too. They don't break anything visible.

## How to edit the site (for team members)

This repo is connected to Netlify. Every commit to `main` goes live on
thesfcommons.com within about a minute. There is no Webflow editor anymore.

**Change some text**
1. Find the page under `public/`. The home page is `public/index.html`;
   every other page is `public/<page-name>/index.html` (for example
   `public/about/index.html`).
2. Open the file on github.com and click the pencil icon (Edit).
3. Use your browser's find (Cmd-F) to locate the exact text, change it,
   and click "Commit changes". Leave the commit message as is or describe
   the change.
4. Wait a minute, then reload thesfcommons.com.

**Change an image**
1. Upload the new image into `public/assets/` on github.com
   (Add file → Upload files).
2. Edit the page file and change the `src="/assets/old-name.jpg"` to the
   new file name.

**Anything bigger** (new section, new page, layout): paste the page file
into Claude with a description of the change, review what it gives back,
and commit it. Or ask Patricia.

**Events** need none of this. They come from the Luma calendar
automatically. Membership, day pass and careers links point at Airtable,
Notion and the guests app, which are unchanged.

**If something breaks**, open the repo's commit history on github.com,
click the last good commit, and use "Revert". The site goes back within
a minute.

## Preview locally

From the `Vibe Coding` folder the `sfcommons-site` entry in
`.claude/launch.json` starts a server on port 8792. Or:

```bash
npx --yes serve@14 public -l 8792
```

## Go live

1. https://app.netlify.com/drop — drag the `public` folder in. Note the
   `something.netlify.app` address.
2. Netlify → Project configuration → General → turn off the
   "Powered by Netlify" badge.
3. Netlify → Domain management → Add a domain → `www.thesfcommons.com`.
4. DNS is at Squarespace Domains. In Squarespace → Domains →
   thesfcommons.com → DNS, replace the Webflow records. Note the bare domain
   currently has TWO A records; delete both.
   - delete `A @ 198.202.211.1`
   - delete `A @ 34.117.223.165`
   - delete `CNAME www cdn.webflow.com`
   - add `A @ 75.2.60.5`
   - add `CNAME www something.netlify.app` (no https://, no trailing slash)
   Leave MX/TXT records alone (email).
5. Wait for Netlify to issue HTTPS (retry "Verify DNS configuration" on the
   HTTPS panel if it lags). Then cancel the Webflow plan for this site.
