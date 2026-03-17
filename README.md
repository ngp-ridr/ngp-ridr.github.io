# NGP RIDR Website

Static site for the **Northern Great Plains Regional Incubator for Drought Resiliency**, built with [Eleventy (11ty) v3](https://www.11ty.dev/). Content is managed through [Pages CMS](https://pagescms.org/), which provides a browser-based editing interface backed directly by this GitHub repository — no server required.

---

## For Content Managers

### Getting to the CMS

1. Go to **[app.pagescms.org](https://app.pagescms.org)**
2. Sign in with your **GitHub account** (you must have been granted access to this repository)
3. Select the **ngp-ridr/website** repository
4. You'll land on the Pages CMS dashboard, where you'll see three content sections in the left sidebar:
   - **News Posts** — dated articles and announcements
   - **Pages** — the site's static pages (About, Solutions, Team, Get Involved, Contact)
   - **Documents & Reports** — downloadable PDFs and reports

> Pages CMS saves your edits directly to the GitHub repository as Markdown files. The site rebuilds and publishes automatically — typically within a minute or two of saving.

### Adding a news post

1. In the sidebar, click **News Posts → New entry**
2. Fill in the **Title**, **Published Date**, and **Summary** (shown in listings)
3. Write your content in the body editor
4. Optionally upload a **Featured Image** and set **Featured Post** to `true` to show the post on the homepage
5. Add relevant **Tags** (always include `news`; add topic tags like `drought`, `workshop`, `stakeholder-engagement`)
6. Click **Save**

### Adding a document or report

1. Click **Documents & Reports → New entry**
2. Fill in the **Title**, **Publication Date**, **Authors**, and **Document Type**
3. Upload the PDF using the **PDF / Download File** field
4. Write an abstract or description in the body
5. Click **Save**

### Editing a static page

1. Click **Pages** and select the page to edit
2. Edit the content in the body editor
3. Click **Save**

> Static pages have a fixed URL set in their front matter. Do not change the filename of an existing page, as it will break the URL.

### Uploading images

Images can be uploaded directly from the **Featured Image** field in the News Posts editor. They are stored in `src/media/images/` in the repository and served from `/media/images/` on the site.

### Editing site-wide settings

Global settings (site title, description, contact email) are in **Site Settings** at the bottom of the Pages CMS sidebar.

---

## For Developers

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Installation

```bash
git clone https://github.com/ngp-ridr/website.git
cd website
npm install
```

### Deployment

The site deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml`. The workflow installs dependencies, runs `npm run build`, and uploads `_site/` as the Pages artifact.

The repository is named `ngp-ridr.github.io`, so the site is served at the root of `https://ngp-ridr.github.io/` (no subdirectory path prefix required).

You'll need to enable GitHub Pages in the repository settings once on first use:
1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow will run and the URL will appear in the Pages settings and in the Actions run summary

To use a custom domain (e.g. `ngp-ridr.org`), add it under **Settings → Pages → Custom domain** and point your DNS at GitHub Pages. No code changes are needed.

### Development

```bash
npm start        # starts dev server at http://localhost:8080 with live reload
npm run build    # production build → _site/
npm run debug    # build with verbose Eleventy logging
```

### Project structure

```
website/
├── .pages.yml                   # Pages CMS configuration
├── eleventy.config.js           # Eleventy build configuration
├── src/
│   ├── index.njk                # Homepage
│   ├── _data/
│   │   ├── site.json            # Global site metadata (title, URL, email)
│   │   └── navigation.js        # Primary navigation links
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk         # Root HTML shell (all pages inherit this)
│   │   │   ├── home.njk         # Homepage layout (hero, solutions strip, news)
│   │   │   ├── page.njk         # Static page layout
│   │   │   ├── post.njk         # News post layout
│   │   │   └── document.njk     # Document/report layout
│   │   └── partials/
│   │       ├── header.njk       # Site header with logo
│   │       ├── nav.njk          # Primary navigation
│   │       ├── footer.njk       # Three-column footer with nav links
│   │       ├── post-card.njk    # Reusable news card (used in grids)
│   │       └── document-card.njk
│   ├── assets/
│   │   ├── css/                 # main.css, layout.css, components.css
│   │   ├── images/              # Static images (e.g. ngp-ridr-logo.jpeg)
│   │   └── js/
│   │       ├── main.js          # Site-wide JS
│   │       ├── map-init.js      # Leaflet auto-initializer
│   │       └── chart-init.js    # Chart.js auto-initializer
│   ├── content/
│   │   ├── news/                # News posts (Markdown, date-prefixed filenames)
│   │   │   └── index.njk        # News listing page
│   │   ├── pages/               # Static pages
│   │   │   ├── about.md
│   │   │   ├── solutions.md     # Five integrated solutions
│   │   │   ├── team.md
│   │   │   ├── get-involved.md
│   │   │   └── contact.md
│   │   └── documents/           # Reports and downloadable resources
│   │       └── index.njk        # Documents listing page
│   └── media/
│       ├── images/              # CMS-uploaded images
│       └── documents/           # CMS-uploaded PDFs
└── _site/                       # Build output (git-ignored)
```

### Collections

Collections are defined in `eleventy.config.js` by glob — not by front matter tags — so membership is explicit and predictable.

| Collection | Source glob | Output URLs |
|---|---|---|
| `news` | `src/content/news/*.md` | `/news/{slug}/` |
| `pages` | `src/content/pages/*.md` | `/{slug}/` (per-page permalink) |
| `documents` | `src/content/documents/*.md` | `/documents/{slug}/` |
| `featuredNews` | news posts with `featured: true` | — (used on homepage) |

### Maps and data visualizations

**Leaflet maps** — add `mapEnabled: true` to a page's front matter. This loads Leaflet CSS/JS from CDN. Place a map anywhere in the content with the shortcode:

```
{% mapEmbed "map-id", 46.8, -100.8, 6 %}
```

Arguments: element ID, latitude, longitude, zoom level (default 6). `map-init.js` automatically initializes all `.map-embed` elements on the page.

**Chart.js charts** — add `chartEnabled: true` to a page's front matter. Prepare a JSON data file in the format Chart.js expects and place it anywhere under `src/assets/`. Then use the shortcode:

```
{% chartEmbed "chart-id", "bar", "/assets/data/my-chart.json" %}
```

Arguments: canvas ID, chart type (`bar`, `line`, `pie`, etc.), path to the JSON data file. `chart-init.js` fetches the data and renders the chart at page load.

### Adding a new static page

1. Create `src/content/pages/my-page.md` with front matter:
   ```yaml
   ---
   title: My Page
   permalink: /my-page/index.html
   order: 7
   ---
   ```
   The `order` field controls sort position in the `pages` collection. Current pages occupy orders 1–6; use a higher number to append or renumber to insert.

2. Add a nav entry in `src/_data/navigation.js` if it should appear in the primary navigation.

### Templates

Templates use [Nunjucks](https://mozilla.github.io/nunjucks/). Markdown files are also processed through Nunjucks, so shortcodes and `{{ variable }}` expressions work inside `.md` files.

Layouts chain upward: `post.njk` → `base.njk`. The `layouts` directory is `src/_includes/layouts/`, so layout front matter uses bare filenames: `layout: post.njk`.

### Filters

| Filter | Usage | Description |
|---|---|---|
| `readableDate` | `{{ date \| readableDate }}` | "January 15, 2025" |
| `isoDate` | `{{ date \| isoDate }}` | "2025-01-15" (for `<time datetime="">`) |
| `limit` | `{{ collection \| limit(3) }}` | Returns first N items |
| `tagSlug` | `{{ tag \| tagSlug }}` | URL-safe tag string |

### Accessibility

The site targets **WCAG 2.1 Level AA** compliance. All pages are tested with [pa11y](https://pa11y.org/) (HTML_CodeSniffer ruleset) as part of development.

Key features in place:
- **Skip link** — "Skip to main content" appears on keyboard focus, jumping to `<main id="main-content">`
- **Focus styles** — `:focus-visible` renders an amber outline ring; suppressed for mouse/touch with `:focus:not(:focus-visible)`
- **Landmark structure** — `<header>`, `<nav aria-label>`, `<main>`, `<footer>` on every page
- **Single `<h1>` per page** — heading hierarchy never skips levels
- **`lang="en"`** on `<html>`; `<meta name="description">` on every page
- **Decorative images** use `alt=""` and `aria-hidden="true"`

To run the audit locally (requires the dev server to be running):

```bash
npm start &
npx pa11y --standard WCAG2AA http://localhost:8080/
```

### Pages CMS configuration

`.pages.yml` defines four CMS collections:

- **news** → `src/content/news/` (yaml-frontmatter)
- **pages** → `src/content/pages/` (yaml-frontmatter)
- **documents** → `src/content/documents/` (yaml-frontmatter)
- **site-settings** → `src/_data/site.json` (json, single file)

The `body` field in each collection maps to the Markdown content body below the front matter delimiter. Field names in `.pages.yml` must match the front matter keys used in templates.
