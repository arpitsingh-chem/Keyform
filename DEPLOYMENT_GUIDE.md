# Deployment Guide

## Planned deployment
GitHub repository -> GitHub Actions checks/build -> Cloudflare Pages static deployment. Cloudflare is the preferred host for the approved service-oriented direction. The core app remains static and portable. `*.pages.dev` avoids mandatory domain purchase.

## Pre-deployment requirements
- Review current Cloudflare Pages and Workers free-plan limits and terms.
- Verify project/account region and account setup requirements; do not assume payment details are never requested.
- Use least-privilege GitHub/Cloudflare integration or protected deployment secrets. Never paste tokens in chat or commit them.
- Inspect an existing repository before changing it; obtain permission before overwriting or publishing.

## Deployment checks
1. CI passes lint, typecheck, tests and production build.
2. Publish correct base path and SPA routing behavior.
3. Verify HTTPS URL, assets, routes, question flow, mobile layout and no critical console errors.
4. Test offline/local progress and confirm no secrets appear in built assets.
5. Record deployed commit and rollback procedure.

## Optional Supabase
Configure only after explicit approval. Store only public project URL and anon key in frontend configuration; enforce row-level security. Service-role keys remain server-side and must never enter frontend artifacts. Test free-project pause, quota error and sync outage behavior. Maintain local practice fallback.

## Hosting portability
Build produces static assets. Keep provider-specific code behind a small cloud adapter so the frontend can be moved to another static host without rewriting the question engine.

## Chosen path (20 Nov 2026)

The owner chose **Cloudflare Pages**. Two routes are documented in `PUBLISH-CLOUDFLARE.md`:

1. **Direct upload of `releases/keyform-site-v0.1.0.zip`** — no GitHub, no API token. Verified
   locally: the production build served from a plain static server passed all 37 browser checks
   (`qa/smoke-report-built-site.json`).
2. **Cloudflare Pages Git integration** (build command `npm run build`, output `dist`) for
   automatic updates. Preferred long-term; requires the owner to connect a repository.

The `wrangler`-based workflow in `.github/workflows/deploy-cloudflare.yml` is retained but is **not
required** for either route, and needs `CLOUDFLARE_API_TOKEN` plus `CLOUDFLARE_ACCOUNT_ID` secrets.
Because the connector for GitHub is unavailable in this environment, the direct-upload route is the
recommended first publication.

### Deployment checklist (owner-side actions in bold)

1. **Download `releases/keyform-site-v0.1.0.zip`.**
2. **Create a Cloudflare account; add no payment method.**
3. **Workers & Pages → Create → Pages → Upload assets → project `keyform` → deploy.**
4. **Send the resulting `*.pages.dev` URL.**
5. Agent verifies the live URL, then records it below.

### Live URL

**https://steep-dew-97ac.getsetflytech0209.workers.dev** — deployed 20 November 2026 via Cloudflare's *Upload your static files* flow (Workers
static assets). Verified on the same day:

| Check | Result |
|---|---|
| `GET /` over HTTPS | 200, HTML, Cloudflare edge |
| `GET /assets/index-*.js` | 200, `application/javascript`, 273,238 bytes |
| `GET /assets/index-*.css` | 200, `text/css`, 17,046 bytes |
| Full browser suite against the public URL | 37/37 passed, 0 console errors |
| Mobile render at 360 px on the live site | no horizontal overflow |

Notes and follow-ups:

- The address is `workers.dev`, not `pages.dev`, because the newer upload flow was used. Both are
  free; behaviour is identical for a static site.
- Plain HTTP also answers directly (no redirect to HTTPS) because `workers.dev` has no zone-level
  "Always use HTTPS" switch. Anyone following the `https://` link is on a secure connection. If a
  forced redirect matters later, that is one more reason to attach a custom domain — which is the
  only paid item in this project and is not required.
- Updates are manual for now: build, zip `dist/`, upload to the same project, deploy. Connecting a
  Git repository later makes them automatic.
