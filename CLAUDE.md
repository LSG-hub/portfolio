# CLAUDE.md

Personal portfolio site for Sreenivas Gurram (AI/ML engineer), deployed on Vercel.

## Layout

This is a **monorepo with two deployable halves**, both public:

| Path | What | Deploys to |
|---|---|---|
| `sreenivas-portfolio/` | React frontend | Firebase Hosting (project `sreenivas-portfolio`, Spark) |
| `avatar-api/` | AI avatar backend — not yet implemented | Cloud Run (its own GCP project, Blaze) |

The repo root also holds source material: `Resume.tex`, hackathon photos.

Run all npm commands from `sreenivas-portfolio/`. The directory is **not** named `frontend/` because that path is baked into `firebase.json`, `.firebaserc`, both workflows (`working-directory`, `entryPoint`, `cache-dependency-path`), and Vercel's dashboard root setting — renaming it is a multi-file breaking change with no functional benefit.

**One repo, two GCP projects.** Repo layout and cloud project structure are separate decisions here: the frontend project stays on Spark with no billing account so the live site cannot incur charges, while the backend needs Blaze for Cloud Run and Vertex AI. Spend risk is isolated to the one project that requires it.

Both workflows carry `paths:` filters scoped to `sreenivas-portfolio/**` — without them a backend-only commit would rebuild and redeploy the frontend. A PR touching only `avatar-api/` shows the preview check as *skipped*, which would block the PR if that check is ever made required.

## Commands

```bash
cd sreenivas-portfolio
npm install          # node_modules is not checked in and may not be present
npm start            # dev server on :3000
npm run build        # production build to build/
```

`npm test` currently fails — `src/App.test.js` is still the stock CRA test asserting a "learn react" link. There is no real test suite; verify changes in the browser.

## Stack

Create React App (`react-scripts` 5.0.1), React 19, `react-router-dom` v7, `react-intersection-observer`. Plain JSX — no TypeScript, no CSS framework, no state library. ~3.3k lines total.

## Architecture

- `src/App.jsx` — BrowserRouter with two lazy routes: `/` (HomePage) and `/projects/:slug` (ProjectDetailPage). Renders fixed Navbar + Footer + ScrollToTop, plus `ScrollRestore`, which resets scroll on route change unless the URL has a hash.
- `src/pages/HomePage.jsx` — stacks six sections in order: Hero → Experience → Projects → Achievements → Skills → Contact. Scrolls to `location.hash` on mount.
- `src/pages/ProjectDetailPage.jsx` — looks the project up by slug via `getProjectBySlug`; `<Navigate to="/" replace />` on miss. Sections: Overview / What I built / Highlights / gallery / Stack / CTA links.
- `src/hooks/useScrollPosition.js` — rAF-throttled "is scroll past N px" boolean. Drives the navbar `scrolled` state and ScrollToTop visibility.
- `src/hooks/useScrollSpy.js` — IntersectionObserver over section ids for navbar highlighting. It retries attachment for up to 120 frames because sections mount late (lazy routes); don't "simplify" that retry loop away.

## Content lives in data files, not components

All résumé copy is in `src/data/`:

- `experience.js` — `experienceData`, `educationData`, `achievementsData`
- `projects.js` — `projectsData` (each with `slug`, `gradient`, optional `image`/`gallery`/`demo`), plus `getProjectBySlug`
- `skills.js` — `skillsData` groups and spoken `languages`

Copy strings use a minimal inline markup — `**bold**` and `*italic*` — parsed into React elements by `src/utils/richText.jsx`. Only those two tokens are supported; anything else renders literally. Components call `richText(...)` on any prose field.

Editing content means editing these files. Section headers carry hardcoded numbers (`01 / Career`, `02 / Selected Work`, …) inside each section component, so reordering sections in HomePage means renumbering them too.

Images go in `public/images/` and are referenced by absolute path (`/images/foo.jpg`). Photos render as CSS `background-image` on a `role="img"` div with `aria-label`, not as `<img>` — follow that pattern for consistent cropping, and always supply the alt text.

## The avatar (Tuk)

**Read `docs/avatar-spec.md` before touching anything under `src/components/avatar/`.** It records why the character is shaped the way it is, and one rule that will silently break if violated.

- `expressions.js` — the vocabulary: 12 faces × 9 hand poses × 6 head motions, composed rather than enumerated, plus `SCENES`. **`SCENES` is the contract the backend drives** — the agent calls semantic states (`thinking`, `unsure`), never individual axes.
- `TukAvatar.jsx` — purely presentational; renders whatever face/gesture/head it's handed.
- `useAvatarLife.js` — ambient locomotion. Harvests `[data-avatar-platform]` top edges via `getBoundingClientRect()` so he stands on real cards. Writes `transform` straight to the DOM; only `phase` and `noticing` go through `setState`, because a 60fps `setState` re-renders the subtree every frame.
- `/avatar-lab` — physics bench, unlinked and `Disallow`ed in `robots.txt`. Code-split, so it costs the main bundle ~48 B.

⚠️ **The layer rule:** position transitions, local motion animates, and the two never share an element. A CSS animation overrides a presentation attribute, so a hand carrying both `translate` (position) and `rotate` (wave) loses its position and pivots around the SVG origin. Outer group transitions, inner group animates — for every prop and limb added later.

He hops rather than walks: stub legs and detached hands make a gait look wrong, and hopping delivers squash-and-stretch for free.

## Styling

Warm "paper + glass" aesthetic. Cream `#FAF6EE` ground with four radial tints painted on `body::before`; EB Garamond serif with italic headings, JetBrains Mono for eyebrows and labels; terracotta `#A8451F` accent.

- `src/styles/globals.css` — design tokens in `:root` (colors, fonts, widths, radii), element resets, `.eyebrow`, reduced-motion block. Change themes here.
- `src/styles/components/glass.css` — shared surfaces: `.glass`, `.glass-dense`, `.glass-subtle`, `.glass-flat` (no blur), `.glass-link` (pill button, `.primary` variant). Imported once in `App.jsx`; reuse these rather than writing new blur/shadow stacks.
- `src/App.css` — layout primitives: `.container`, `.container-narrow`, `.container-prose`, `.section`, `.section-header`, `.fade-in`, `.numbered-list`.
- `src/styles/components/*.css` — one file per component, imported by that component's JSX.

Conventions: fonts come from Google Fonts in `public/index.html`; there are no icon components — arrows are HTML entities (`&rarr;`, `&larr;`, `↗`); list numbering uses a `ROMAN` array defined locally in Experience and ProjectDetailPage. Section reveals are opacity-only `fade-in` via `useInView({ triggerOnce: true })`. Backdrop-blur is stepped down at the 720px and 480px breakpoints — keep new glass surfaces in that pattern so mobile paint cost stays flat.

## Deploy

**Primary: Firebase Hosting**, GCP project `sreenivas-portfolio`, on the free Spark plan. No billing account is attached, so this project cannot incur charges; the tradeoff is that exceeding the free quota (10 GB storage, 360 MB/day transfer) stops serving rather than billing.

- `sreenivas-portfolio/firebase.json` — serves `build/`, rewrites all paths to `/index.html` for client-side routing, and sets cache headers. The header globs are deliberately **non-overlapping** because Firebase's precedence when multiple blocks match is undocumented: `/static/**` gets 1-year immutable (safe — CRA content-hashes those filenames), `/images/**` gets 1 day, and `!/@(static|images)/**` gets `no-cache` so HTML revalidates on every load and deploys land immediately.
- Firebase matches header rules against the **request path, not the resolved file**. A rule on `/index.html` therefore never applies to `/` or `/projects/juno`, which is why the catch-all negation glob is used instead. Verify header changes with `curl -sI <url>`, not by reading the config.
- Live URL: `https://sreenivas-portfolio.web.app`

CI/CD via GitHub Actions at the repo root:

- `.github/workflows/firebase-deploy.yml` — push to `main` builds and deploys to the live channel.
- `.github/workflows/firebase-preview.yml` — pull requests get a temporary preview channel (7-day expiry) with the URL commented on the PR. Skips PRs from forks, which can't read secrets.
- Both build from the `sreenivas-portfolio/` subdirectory and pass `entryPoint: sreenivas-portfolio` so the action finds `firebase.json`. Node is pinned to 20.
- Auth uses the `FIREBASE_SERVICE_ACCOUNT_SREENIVAS_PORTFOLIO` repo secret, holding a key for the `github-action-deploy@sreenivas-portfolio.iam.gserviceaccount.com` service account. That SA has only `roles/firebasehosting.admin` — verified sufficient. Preview-channel deploys log two harmless `identitytoolkit` 403 warnings (the CLI trying to register the preview domain with Firebase Auth, which this site doesn't use); they do not affect the exit code.
- `npm test` is deliberately not in the pipeline — `src/App.test.js` is still the stock CRA test and fails.
- `CI=true` (set by Actions) makes react-scripts treat lint warnings as build errors. The build is currently warning-free, so this is left on intentionally.

**Live domain: `https://sreenivasgurram.com`** (apex, canonical), with `www` redirecting to it. DNS is at GoDaddy: a single `A` record on `@` → `199.36.158.100`, a `TXT` on `@` → `hosting-site=sreenivas-portfolio`, and the `www` `CNAME` → `sreenivas-portfolio.web.app`.

⚠️ **The same domain's DNS also runs Zoho Mail for `me@sreenivasgurram.com`.** Three `MX` records (`mx.zoho.in`, `mx2`, `mx3`), the SPF `TXT` (`v=spf1 include:zoho.in ~all`), `zmail._domainkey` (DKIM), and `_dmarc` are all load-bearing. Never replace a `TXT` record on `@` — multiple TXT records coexist, and overwriting the SPF one silently breaks mail. Always add.

**Vercel is now redirect-only.** `sreenivas-portfolio/vercel.json` holds a single permanent redirect of `/(.*)` → `https://sreenivasgurram.com/$1`, deliberately *not* deleted: `Resume.tex` previously linked to `https://portfolio-31jx.vercel.app/`, and résumé PDFs already sent to employers still carry that URL. The Vercel project must stay alive for those links to resolve. Vercel still auto-deploys from `main`, which is harmless — it serves only the redirect.

Because the SPA rewrite is a catch-all, **any missing file under the site root returns 200 with `index.html` rather than 404.** That silently masks broken asset references — `og-image.jpg` and `twitter-image.jpg` are referenced in `index.html` but do not exist, so social link previews receive HTML and render blank. `public/sitemap.xml` was created for the same reason. When adding any absolute asset reference, verify with `curl -sI` that the response is the expected content type, not `text/html`.

## Machine setup (identities)

This machine hosts three separate GitHub/Google identities. Git resolves them by directory via `includeIf` rules in `~/.gitconfig`:

| Directory | Commits as | SSH key → account |
|---|---|---|
| `~/Desktop/Personal/**` | Sreenivas Gurram \<me@sreenivasgurram.com\> | `id_personal` → LSG-hub |
| `~/Desktop/DAC/**` | Sreenu02-01 | `id_dac` → Sreenu02-01 |
| `~/Desktop/Skooc/**` | Sreenivas-Gurram-2 | `id_skooc` → Sreenivas-Gurram-2 |

Each include also sets `core.sshCommand`, which is what actually selects the key — the remote URL alias (`github.com-personal`) is belt-and-braces agreement, not the mechanism.

Note that git switches identity automatically but **`gh` and `gcloud` do not**:

- `gh auth switch --user LSG-hub` before running `gh` against personal repos.
- `gcloud config configurations activate personal` (pinned to `sreenivas-portfolio`) or `work`.
- Firebase CLI is logged in as `srinu202012@gmail.com`, which owns the GCP project. Note this is a *different* Google account from the `me@sreenivasgurram.com` git identity, and from `srinu020104@gmail.com` used in this repo's oldest commits.

Commits from May 2026 are authored with the work email `sreenivas.g@digitalapi.ai`, predating these rules. Left unrewritten deliberately; fixing it means a history rewrite and force-push.

## Known stale bits (left as-is deliberately)

- `manifest.json` still carries the old dark-theme palette (`#00ff96` / `#0a0a0a`) and points at `favicon.ico` while `index.html` uses `favicon.svg`.
- `index.html` references `og-image.jpg` and `twitter-image.jpg`, which don't exist in `public/`; `robots.txt` points at a nonexistent `sitemap.xml`.
- `index.html` loads Font Awesome from a CDN, but nothing uses it — dead render-blocking request.
- `sreenivas-portfolio/README.md` describes an earlier dark-themed version (React 18, neural-network canvas, typing animation, cursor glow) that no longer exists.
- `.DS_Store` is committed at the repo root.
