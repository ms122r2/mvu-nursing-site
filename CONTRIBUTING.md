# Contributing to this site

This repository is managed by LXS. It follows a strict `staging` → `main`
promotion flow.

## Branches

- `staging` — integration branch. All changes land here first. Vercel
  auto-deploys every commit to a preview URL.
- `main` — production. Only receives commits via merged pull requests from
  `staging`. Never commit direct to main.

## How to make a change

### Content edits (via LXS admin)

1. Open the page in the LXS visual editor
2. Save + Publish — commits land on `staging`
3. Check the staging preview URL
4. In LXS admin → Site → Promotions → "Promote to production"

### Code changes (devs)

1. Branch from `staging`: `git checkout staging && git pull && git checkout -b fix/my-change`
2. Make your changes, commit
3. Open a PR with base `staging` (NOT `main`)
4. Once merged to staging, content team (or you) opens a promotion PR to main
5. CI runs Lighthouse, visual-diff, link-check against the Vercel preview
6. Approve + merge promotion PR → prod deploys

## Why this flow?

- Content editors and devs both get preview deploys to validate changes
- Production is never broken by an unreviewed commit
- Rollback is one-click in Vercel (or revert the promotion PR)

## Branch protection

`main` requires:
- PR from the `staging` branch (enforced by `head-branch-guard` CI job)
- 1+ approving review
- All CI checks passing: `head-branch-guard`, `lighthouse`, `visual-diff`, `link-check`
- Linear history (no merge commits from other branches)

If you hit a "head-branch-guard" failure, you opened a PR from the wrong
branch. Merge into staging first.
