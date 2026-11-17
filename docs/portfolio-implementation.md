# Portfolio implementation notes

The current entry point is `src/App.tsx`, with public project copy in `src/portfolio.ts` and styles in `src/portfolio.css`. The previous components and `experience.json` are retained because they had pre-existing local changes. They are not imported by the new entry point. Review and reconcile them before removing them, and search the whole repository for stale claims before release.

Featured work is ordered in the `featured` array. Each entry supplies a slug, status, role, summary, evidence and sections. Keep research copy at the public-summary level; do not publish underlying interviews or private documents. The archive is in `moreWork` and `earlierWork`. A demo link should only be added after checking its primary workflow.

Run `npm ci`, `npm run build` and `npm run preview` for local verification. Check `/`, `/work`, `/work/nepal-remittance-research`, `/work/refresh-recreation`, `/work/rutaal`, `/about`, an unknown path and `/#contact`, including direct loading and refresh on the eventual preview. Test keyboard, reduced motion, 200% zoom, narrow and wide viewports, Chromium and WebKit.

The résumé link is deliberately absent until an up-to-date public PDF is supplied. Confirm undergraduate degree wording and Ruta’al status before expanding those claims. Project screenshots and research artifacts need approval; synthetic POS screenshots should be identified as illustrative.

Remaining before release: implement and validate route-specific prerendered HTML and social metadata, sitemap and robots; verify Vercel routing serves prerendered routes and assets correctly; inspect the social image; verify project demo workflows; visually review the responsive site and accessibility; reconcile stale content in retained files and README; and record a full test result. The apex currently redirects to www with a 307; any permanent redirect is a separate domain configuration change. No deployment or domain change is part of this work.
