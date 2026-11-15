# SARM Security: Marsellino Nasry Mounir

The client-facing website of SARM Security, the independent IT audit, compliance and offensive security practice of Marsellino Nasry Mounir.

It's a static site: plain HTML, CSS and JavaScript, with no framework, no build step, no backend and no third-party scripts. It runs on GitHub Pages or any other free static host.

## What's on the page

The home page is structured as a services proposal, in the order a prospective client reads it:

1. **Hero:** value proposition, consultation call to action, proof stats and the frameworks you work with.
2. **Sound familiar?** Six problems clients bring, each linked to the service that solves it.
3. **Services:** IT Audit & Assurance, Compliance & GRC, Offensive Security, each with what's included and what the client receives.
4. **Why SARM:** the Dual-Lens Assessment (audit + attack), with an illustrative sample finding.
5. **Approach:** Scope, Assess, Validate, Assure, plus four commitments.
6. **Engagement models:** fixed-scope assessment, readiness programme, advisory retainer.
7. **Industries, About, Credentials, Proof of work (ISMS platform, Arsenal, toolset), FAQ.**
8. **Contact:** a consultation request form with service and timeline fields.

## Folder structure

```
/
├── index.html                    Main page (all sections)
├── capability-statement.html     Source of the 2-page PDF capability statement
├── 404.html                      "Page not found" page (used by GitHub Pages)
├── favicon.ico, site.webmanifest, robots.txt, sitemap.xml
└── assets/
    ├── css/style.css             Site styles (design tokens at the top)
    ├── css/capability.css        Print styles for the capability statement (A4)
    ├── js/main.js                Navigation, scroll reveal, service pre-select, contact form
    ├── docs/SARM-Security-Capability-Statement.pdf   Downloadable PDF linked from the site
    ├── fonts/                    Archivo (variable) and JetBrains Mono, self-hosted (SIL OFL)
    ├── images/                   Portrait, logos, icons, social share image
    └── brand/                    Extra logo files for reports, social media and GitHub
```

## Run it locally

```bash
cd sarm-portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000. Use a local server rather than double-clicking `index.html`, because some browsers block local font files when a page is opened straight from disk.

## Deploy for free on GitHub Pages

Your site is served from the repository `Marsellino-Nasry/Marsellino-Nasry.github.io`, so publishing the new version means replacing that repository's files.

### Option A: from the command line

```bash
git clone https://github.com/Marsellino-Nasry/Marsellino-Nasry.github.io.git
cd Marsellino-Nasry.github.io
cp -R /path/to/sarm-portfolio/. .         # copy everything from this folder, overwriting
git add .
git commit -m "Relaunch as SARM Security services site"
git push
```

### Option B: in the browser

1. Open https://github.com/Marsellino-Nasry/Marsellino-Nasry.github.io.
2. Click **Add file → Upload files** and drag in **everything inside** this folder (including the whole `assets` folder). Commit the upload; files with the same name are replaced.

Then check **Settings → Pages**: **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**. The site updates within a minute or two. Hard-refresh (Ctrl+Shift+R) if you still see the old version.

If you deploy somewhere other than `marsellino-nasry.github.io`, update the canonical URL and the `og:` and `twitter:` URLs at the top of `index.html`, the URLs in the JSON-LD block, `robots.txt`, `sitemap.xml`, and the web address in `capability-statement.html`.

## Contact form (Formspree)

The form still posts to the same Formspree endpoint (`https://formspree.io/f/xqabqrrl`), so messages keep arriving in your Gmail inbox. It now sends these fields: `name`, `company`, `email`, `service`, `timeline` and `message`, with the email subject "New consultation request from SARM Security website".

Every "Discuss…" button on the page pre-selects the matching service in the form, so you can see which offer brought each lead in.

## Updating the capability statement PDF

1. Edit `capability-statement.html` (and `assets/css/capability.css` for layout).
2. Serve the folder locally and open `http://localhost:8000/capability-statement.html` in Chrome.
3. Print → Destination **Save as PDF** → Paper **A4** → Margins **None** → tick **Background graphics**.
4. Save over `assets/docs/SARM-Security-Capability-Statement.pdf`.

Keep it to two pages: if you add content, remove something of equal length.

## Security and quality notes

- A Content Security Policy is set in a `<meta>` tag. Scripts, styles, fonts and images may only load from the site itself, and the form may only send to Formspree. If you add any external script or embed (for example a booking widget), add its domain to that policy or it will be blocked.
- External links open in a new tab with `rel="noopener noreferrer"`.
- No trackers, cookies or third-party CDNs. Fonts are self-hosted.
- The page and capability statement pass an axe-core WCAG 2.1 AA scan with zero violations. Keyboard, screen reader and reduced-motion users are supported.
- Search engines get `ProfessionalService` structured data listing your services.

## Editing content

- **Text:** every section of `index.html` is marked with a comment (`HERO`, `CHALLENGES`, `SERVICES`, `DUAL LENS`, and so on).
- **Service pre-select:** a link with `data-service="..."` pre-selects the `<option>` with the same `value` in the form.
- **Scroll animation:** add `data-reveal` to any block to fade it in on scroll.
- **Colours and type:** change the tokens at the top of `assets/css/style.css`.

## Credits

- Typefaces: Archivo (Omnibus-Type) and JetBrains Mono, both under the SIL Open Font License; licence texts are in `assets/fonts/`.
- Logo, layout and code: designed for SARM Security. © 2026 Marsellino Nasry Mounir.
