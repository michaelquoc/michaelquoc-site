# SITEMAP.md — michaelquoc.com

Site architecture reference for Spark and future contributors.

---

## Stack

- **Framework:** Eleventy (11ty)
- **Templating:** Nunjucks (.njk)
- **Content:** Markdown (.md)
- **Styling:** Vanilla CSS (`src/style.css`)
- **Hosting:** Cloudflare Pages (auto-deploys on push to main)

---

## Directory Layout

```
michaelquoc-site/
├── .eleventy.js           # Eleventy config (passthrough, filters, dirs)
├── package.json           # Dependencies
├── _headers               # Cloudflare headers
├── _redirects             # Cloudflare redirects
├── favicon.*              # Favicon variants (copied to root)
├── public/                # Static build artifacts (gitignored? or manually managed)
│
└── src/                   # SOURCE ROOT (input dir)
    ├── index.njk          # Homepage
    ├── seo.njk            # SEO diagnostic page
    ├── style.css          # Global stylesheet
    │
    ├── _data/             # Global data files
    │   └── seo_ledger.json    # SEO overrides by page slug
    │
    ├── _includes/         # Layouts & components
    │   ├── layouts/
    │   │   ├── base.njk       # Shell: <html>, <head>, header, footer
    │   │   └── treatise.njk   # Physics article layout (3-col grid, logic map)
    │   └── components/
    │       ├── header.njk
    │       ├── footer.njk
    │       ├── logo.njk
    │       └── macros/cards.njk
    │
    ├── assets/            # Images, fonts, etc.
    │
    ├── physics/           # Long-form "Physics of X" articles
    │   ├── luxury.md
    │   ├── ferrari-brand.md
    │   ├── jazz-improvisation.md
    │   ├── ski-carving.md
    │   ├── axiomatic-intelligence.md
    │   ├── arc-protocol.md
    │   └── analog-protocol.md
    │
    └── kinetics/          # Short "Kinetic" cards (personal philosophy)
        ├── kinetics.json      # Directory data: layout, tags, permalink
        ├── kinetic_01.md      # Spatial Physics
        ├── kinetic_02.md
        ├── kinetic_03.md
        ├── kinetic_04.md
        └── kinetic_05.md
```

**Output:** `_site/` (Eleventy default)

---

## Layouts

### `layouts/base.njk`
Global HTML shell. All pages inherit this.

**Features:**
- SEO logic engine: resolves `seo_title` → `seo_ledger[slug].title` → `title`
- Meta tags (title, description, OG)
- Google Fonts (Inter, JetBrains Mono, Source Serif 4)
- Plausible analytics
- Includes header + footer components

### `layouts/treatise.njk`
Physics article layout. Extends `base.njk`.

**Features:**
- 3-column grid: Logic Map (left) | Article (center) | whitespace (right)
- Auto-generated TOC from H2/H3 headers (client-side JS)
- Header metadata block: DATE, GRAVITY, CLASS, PROVENANCE
- Deck/subtitle pulled from `description` or `seo_ledger`
- Footer entity graph from `aeo_entities` array
- Truncates sidebar links at 35 chars

---

## Frontmatter Schema

### Physics Articles (`src/physics/*.md`)

```yaml
---
# REQUIRED
title: "The Physics of X"              # H1 on page (brand identity)
description: "Short description..."    # Deck line + meta description fallback
date: 2026-02-04                       # Publication date (YYYY-MM-DD)
layout: layouts/treatise.njk           # Must use treatise for physics

# OPTIONAL (but expected for 100x articles)
subtitle: "The [Domain], [Domain] & [Domain]"  # Below title
seo_title: "Why X: The Physics of..."          # Meta title for SERPs (overrides title)
updated: 2026-02-04                            # Last updated date
tags:                                          # Array of topic tags
  - physics
  - economics
gravity: 100                                   # Importance score (displayed in header)
provenance: "ARC Protocol | N Vectors | N Axioms"  # Source methodology
index_exclude: true                            # Exclude from homepage listing (optional)
aeo_entities:                                  # Named entities for AEO (40-60 target)
  - Entity 1
  - Entity 2
  - ...
---
```

**SEO Resolution Order:**
1. `seo_title` (frontmatter) — if present, used for `<title>` and OG
2. `seo_ledger[page.fileSlug].title` — data file override
3. `title` — fallback

### Kinetics (`src/kinetics/*.md`)

```yaml
---
title: "Spatial Physics"               # Card title
subtitle: "Environment"                # Category/theme
description: "Short description..."    # Card body preview
order: 1                               # Sort order on homepage
---
```

**Directory Data (`kinetics.json`):**
```json
{
  "layout": "layouts/treatise.njk",
  "tags": "kinetics",
  "permalink": "/kinetics/{{ title | slug }}/"
}
```

---

## Data Files

### `src/_data/seo_ledger.json`

Centralized SEO overrides keyed by page slug:

```json
{
  "luxury": {
    "title": "Why Luxury Goods Are So Expensive...",
    "description": "Hermès produces 120,000 bags/year..."
  },
  "index": {
    "title": "Michael Quoc | Architect of Axiomatic Intelligence",
    "description": "..."
  }
}
```

**Usage in templates:**
```nunjucks
{% set seoEntry = seo_ledger[page.fileSlug] %}
{% set finalTitle = seo_title or seoEntry.title or title %}
```

---

## URL Structure

| Content Type | Source | Output URL |
|--------------|--------|------------|
| Homepage | `src/index.njk` | `/` |
| Physics articles | `src/physics/luxury.md` | `/physics/luxury/` |
| Kinetics | `src/kinetics/kinetic_01.md` | `/kinetics/spatial-physics/` |
| SEO page | `src/seo.njk` | `/seo/` |

---

## Eleventy Config Highlights

```js
// Passthrough (copied as-is to _site)
eleventyConfig.addPassthroughCopy("src/style.css");
eleventyConfig.addPassthroughCopy("src/assets");
eleventyConfig.addPassthroughCopy("favicon.*");

// Custom filter
eleventyConfig.addFilter("dateDisplay", (dateObj) => {
  return new Date(dateObj).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
});

// Directories
{ input: "src", output: "_site", includes: "_includes" }
```

---

## Deployment

1. **Build:** `npm run build` (or `npx @11ty/eleventy`)
2. **Dev:** `npm run dev` (serves with hot reload)
3. **Deploy:** Push to `main` → Cloudflare Pages auto-builds

---

## Adding New Physics Articles

1. Create `src/physics/[slug].md`
2. Add frontmatter (see schema above)
3. Optionally add SEO override to `seo_ledger.json`
4. Commit and push

**For 100x Protocol articles:** Follow the full frontmatter schema including `seo_title`, `provenance`, and `aeo_entities` (40-60 entities target).

---

*Last updated: 2026-02-05*
