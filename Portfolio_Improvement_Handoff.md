# Sambhav Lamichhane Portfolio Refresh

**Implementation handoff · November 16, 2026**

[Portfolio repository](https://github.com/Sambhav255/portfolio) · [Live site](https://www.sambhav.app/)

## Goal

Make the portfolio useful to someone arriving from LinkedIn, a networking message, or a referral. In the first screen, they should see what Sambhav studies, what kind of problems he takes on, and how to see his work. In a minute, they should be able to open a project, understand his contribution, and find a way to get in touch.

Lead with product work that uses data to make decisions. The Nepal remittance research shows how he changes course when the evidence changes. Refresh shows he can ship software for people who need it on the job. Ruta’al shows how he took a fintech idea from research to a functional prototype.

Keep the React, TypeScript, Vite and Vercel setup, the current portrait, the light palette, and the Kathmandu to Minnesota thread. Make a focused revision using the existing site. Work on a branch and return a reviewable preview. Leave deployment and domain settings for the owner unless the implementation brief explicitly grants access to those actions.

## What the audit found

Repository baseline was `main` at `8065bdb`. A clean install and production build passed. Its JS and CSS filenames matched the custom domain at audit time. I inspected the live desktop home, projects, project dialog, and contact views. Mobile and cross browser checks are part of the implementation acceptance criteria below.

| Finding | Where to look | What to change |
| --- | --- | --- |
| The live hero advertises May 2026 availability and introduces Sambhav as a graduating senior. Contact repeats that date, shows stale roles, and makes an OPT claim. | `src/experience.json`, `HeroSection.tsx`, `HomeView.tsx`, `ContactSection.tsx`, `index.html`, `README.md` | Update the current academic and fellowship status everywhere. Remove the availability badge and use the graduate student and fellowship line below. |
| The live résumé CTA returns HTTP 404. The repo has no résumé PDF. | `contact.resumeUrl`, `ContactSection.tsx`, `public/` | Remove the dead URL now. Restore the CTA when a current public PDF is supplied. |
| Both custom domain variants return 200. The canonical tag and Person schema point to `sambhav.vercel.app`, which currently serves a different portfolio. | `index.html`, `README.md`, Vercel domain settings | Use the www domain as the canonical public URL. Remove the other site's address from portfolio metadata and docs. |
| The first desktop viewport devotes substantial space to the hero and a separate story teaser. Selected work sits farther down, behind a stats row. | `HomeView.tsx`, `HeroSection.tsx`, `src/index.css` | Shorten the hero and move Selected Work directly underneath it. |
| Projects, Contact, and an open project dialog all retain the homepage URL. A project card can also carry its entire description as its button name. | `App.tsx`, `Navbar.tsx`, `ProjectsSection.tsx`, `ProjectModal.tsx` | Use links for navigation and shareable case studies. Give each card one short, descriptive link. |
| Home and Projects build different cards from the same data. The archive renders only `otherProjects[0]`. Project HTML is inserted inside the card button, including inline links on some cards. | `HomeView.tsx`, `ProjectsSection.tsx`, `src/experience.json` | Share one card and one typed content model. Render every listed archive entry. Replace HTML strings with structured copy and links. |
| Some headings appear character by character in the accessibility tree. Lenis continually schedules frames and its cleanup does not cancel the pending frame. | `HeroSection.tsx`, `ContactSection.tsx`, `ProjectsSection.tsx`, `useLenis.ts`, `MagnetLines.tsx`, `src/index.css` | Keep text readable at first paint and use native scrolling by default. Gate decorative effects behind motion and pointer preferences. |

## P0 · Fix the public facts and links

**Homepage copy**

> # Sambhav Lamichhane
>
> I build products that make costs, tradeoffs, and messy data easier to understand.
>
> M.S. in Data Science student and New Product Tech Ventures Fellow at the University of St. Thomas.

Use **View selected work** as the primary link and **Get in touch** as the secondary link. Put the portrait next to the copy on wide screens and below the main actions on narrow screens. Drop the availability badge, four descriptor pills, and standalone stats row. Put verified numbers beside the work they describe.

**Contact copy**

> I’m happy to talk about product, applied AI, fintech, and data projects. You can reach me by email or on LinkedIn.

Use `mailto:lami9190@stthomas.edu`, [LinkedIn](https://linkedin.com/in/sambhavlamichhane), and [GitHub](https://github.com/Sambhav255). Remove the 24 hour response promise, relocation list, and visa or work authorization language. Keep the site open to conversations. If Sambhav chooses to publish job timing, the current career reference lists January 2028 or later for full time starts. Keep the fellowship terms and visa details private.

Use the public résumé PDF when supplied. Suggested path is `public/resume.pdf`, served at `/resume.pdf`. Confirm that the document is current, intended for public sharing, and served as a PDF rather than the Vite app shell. Avoid substituting a role specific résumé or exposing the master career reference. When no PDF is available, email and LinkedIn provide the contact path.

**Education and career copy**

* Current · M.S. in Data Science at the University of St. Thomas, expected December 2027. New Product Tech Ventures Fellow, Cohort 4, since September 2026.
* Completed · Undergraduate studies in Financial Management and Data Analytics at the University of St. Thomas, May 2026, per the supplied career reference. Confirm official transcript wording before displaying specific undergraduate degree designations, since prior materials use different labels.
* Research Fellow · Ministry of Foreign Affairs Nepal, June to August 2026.
* Growth and operations · Refresh Recreation Center, June to September 2026. Use “Head of Growth & Strategy” where the formal title is needed.
* Product Management Fellow · LEAF Lab, August 2025 to May 2026. VR Product Developer & Lab Technician · STELAR, March 2023 to May 2026. Use past tense for both. Handle the quantitative research and student government roles as earlier experience.
* Ruta’al · Frame as a cofounding and prototype case study in the past tense. Leave out a “Present” date and current operating claims until Sambhav confirms its status. Remove the unsupported 250 million estimate wherever it appears. Remove the unsupported 15% dealership figure and the claim that a CardSense wording choice tested better with users unless there is documentation for either. Attribute the student government budget to Finance Committee work if mentioned.

## P1 · Rebuild the homepage around selected work

Use this order on the homepage: header, compact introduction, three selected case studies, short About section, contact footer. Navigation can be **Work · About · Contact** with the name linking home. Keep Journey as an About section with a short timeline. Lead that timeline with the fellowship and 2026 work. Retain the Kathmandu dealership and the yardstick election as personal details. Compress older roles into a few dated entries.

If the About page includes a note on current interests, keep it to one sentence. “I recently started a project called Foremargin to explore how to estimate AI task costs before a run.” A brief About mention is enough.

| Homepage order | Suggested card copy | Proof or artifact |
| --- | --- | --- |
| 1 · Nepal remittance research | “I investigated why informal remittance flows between Nepal and South Korea were hard to measure, then shifted the research when the pricing evidence challenged my first hypothesis.” | 13 interviews across 7 institutions. Research presented to Nepal’s Minister of Foreign Affairs and senior officials. Use a methodology diagram or a public summary instead of the underlying interview records or memo. |
| 2 · Refresh Recreation Center | “I built and deployed an internal point of sale system for a recreation center in Kathmandu, replacing manual ledgers with digital transaction records and daily revenue reporting.” | Show the staff workflow, including member lookup and daily reporting. A screenshot may use synthetic data if a clean capture is available. A simple workflow diagram works too. |
| 3 · Ruta’al | “I cofounded Ruta’al and built a functional USSD prototype to explore financial access for informal workers in Mexico and Nepal.” | Won $6,000 across three business competitions. Use an existing prototype capture or a simple diagram showing how USSD works. |

Each homepage card should have a title, one or two sentences, optional proof, and a descriptive link. Give the remittance research the larger treatment with a simple diagram of how the evidence changed the research question. Put the older library of work behind **See all work**.

**Work index order**

1. The same three case studies, in the same order.
2. **More work** with Vigil, CardSense, and the Cortex AI Customer Intelligence System. Use one evidence point each. Vigil brings geopolitical signals together in a risk dashboard. CardSense analyzes spending across 15+ card products. Cortex used seven Snowflake Cortex AI functions and 22 automated dbt schema tests.
3. **Earlier work** with VibeTicker, Common Table, and the EV infrastructure poster. Preserve the poster at `/datacom_poster.pdf`. The existing demo homepages returned HTTP 200 during the audit. Open each retained project and check that the primary workflow still works before showing a demo CTA. Use a case study link when an interactive demo is unavailable.

### Case study content

Use the same short structure for the three featured pages: opening summary, Sambhav's role, the decision or workflow, what exists, and an artifact when one is available. A reader should get the point from the first two paragraphs. A project title and visible status such as **Prototype**, **Research**, or **Internal tool** are enough.

* **Remittance research** · Explain the initial transfer fee hypothesis, the interviews and operator pricing data, and why the memo shifted to the measurement gap. If there is room for methods, mention the original fee data from seven licensed Korean operators and the source grading work in Excel and R. Keep the website story at the level used in the public summary. Any material from the underlying memo or interviews needs a public release basis.
* **Refresh** · Open with how reception staff recorded sales before the tool. Walk through entering a transaction, finding a membership, and seeing the daily revenue total. Describe staff requirements and rollout, plus the ten KPI operating dashboard as separate work if useful. Payment integrations and growth numbers require evidence beyond the supplied reference.
* **Ruta’al** · Explain the access constraints that led to USSD, what Sambhav owned in product discovery and prototyping, and what the prototype demonstrated. Report the $6,000 as competition winnings. It can be shown with the existing prototype link if the flow still works. A functional prototype and competition feedback are the evidence available for the case study.

## P2 · Implementation details

| Area | Implementation direction |
| --- | --- |
| Content | Refactor `src/experience.json` or move it to one typed content module. Use fields for `slug`, `title`, `summary`, `status`, `role`, ordered placement, evidence, and optional media and links. Remove duplicate `link` and `demoUrl` fields when they mean the same thing. Use named sections rather than positions such as `sections[2]`. |
| Routes | Replace local tab state in `App.tsx` with URL based navigation in the existing app. Suggested paths are `/`, `/work`, `/work/nepal-remittance-research`, `/work/refresh-recreation`, `/work/rutaal`, and `/about`, with `/#contact` for contact. Render a useful fallback for an unknown project slug. Verify the existing Vercel routing with a direct load and refresh on every new route. Use `ProjectModal.tsx` only if a quick view earns its place after the pages exist. |
| Layout | Reuse the cream background, dark text and portrait. Tighten the hero so Selected Work starts within the first 900 pixels at a 1440 × 900 desktop viewport. Use a narrow reading column, strong text contrast and consistent crop ratios. At 390 pixels, show the name, current role and primary action ahead of decorative work. Use interface captures, diagrams or approved photos as evidence. |
| Accessibility | Use real links, an actual `main` landmark, valid heading order, visible focus, and a skip link that reaches main content. Update the document title on navigation and move focus appropriately after route changes while preserving back navigation. Make split letter effects decorative to assistive technology or remove them. If a dialog remains, test Escape, focus trapping, focus restoration, and background scroll lock. |
| Motion and load | Prefer native scrolling. If `useLenis.ts` remains, retain the animation frame ID and cancel it during cleanup. Use a static background and native cursor for reduced motion and coarse pointers. Pause decorative work when the page is hidden and clean up listeners and GSAP timelines on unmount. Size hero media explicitly and load below the fold assets on demand. Measure before adding new animation dependencies. |
| Search and sharing | Use `https://www.sambhav.app/` as the homepage canonical. Set `og:url`, absolute `og:image`, and Person schema URL consistently. The existing `/og-image.png` loads, but inspect its image and refresh it to match the current headline if needed. Ensure page titles and descriptions reflect the case studies. If publishing distinct case study URLs, use prerendered HTML for those pages so crawlers and share previews can see page specific metadata. Include canonical public routes in the sitemap when they are ready and reference it from robots.txt. If the apex is under the owner's control, configure and verify a permanent redirect to www. |
| Repo hygiene | Make the README match the actual repo. Update the live URL, paths, content editing instructions, and build commands. Remove references to Tailwind, a contact form, placeholder email, and unmeasured performance claims. Check whether `portrait.jpg` is referenced before pruning it. The current hero uses the much smaller `portrait.png`. |

## Acceptance and return package

* **Build:** Run `npm ci`, `npm run build`, and `npm run preview`. The baseline build produced about 114 kB gzip JS and 5.5 kB gzip CSS. Record the new build output and explain a material regression. For any new prerender step, check that the generated pages still work on the deployment preview.
* **Reader path:** On desktop and mobile, confirm the current introduction, the three featured cards, the archive, and the email and LinkedIn links. Verify the résumé button opens the approved PDF or is absent. Check that navigation, direct URLs, opening in a new tab, refresh, and browser back and forward all land where expected.
* **Device and accessibility:** Check at 360, 390, 768 and 1440 pixels. Test keyboard only from the top through contact, focus after navigation, reduced motion, text contrast and zoom to 200%. Check Chromium and Safari or WebKit. Record any check that could not be run. Verify the three cards and navigation avoid horizontal overflow at narrow widths.
* **Facts and links:** Search the repo and built output for “Graduating May 2026”, the old résumé URL, the old canonical host, “OPT eligible”, “250 million”, and “15%”. May 2026 is correct for completed undergraduate studies and the end of earlier roles. Check all visible links and verify content types for PDFs and images. Inspect the built homepage HTML for the canonical and share fields. Check the full deployed preview on the custom domain when a production release is authorized.
* **Return:** Provide a branch or commit, preview URL if available, screenshots of the revised homepage at desktop and mobile sizes, one case study screenshot, and a short verification record. Call out missing assets and any remaining domain configuration. The owner inputs that could improve the result are a current public résumé, confirmation of the formal undergraduate degree wording and Ruta’al status, and approved project images. Use the copy and fallback links above to keep the rest moving.

Career source for the implementation is the supplied `Sambhav_Lamichhane_Full_Reference.md`. The current fellowship reflects the later graduate updates. Keep the reference document outside the public repository.
