# Architecture — THE PILLAR

> Reference: See `Plan.md` for feature requirements and `Appwrite.md` for backend details.

---

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| SSG | [11ty (Eleventy)](https://www.11ty.dev/) v3 | Generates static HTML at build time |
| Templates | Nunjucks (.njk) | Layouts, partials, loops |
| Content | Markdown (.md) + frontmatter | Episode text and metadata |
| i18n | JSON data files + 11ty data cascade | UI strings per language |
| Styles | Vanilla CSS (no framework) | Mobile-first, CSS variables |
| Client JS | Vanilla JS modules | Auth, comments, counter, gate |
| Backend | Appwrite Cloud | Auth + Database + Functions |
| Hosting | Vercel | CDN, HTTPS, Git deploys |

---

## Folder Structure

```
the-pillar/
│
├── .eleventy.js               ← 11ty config
├── .env.local                 ← Local env vars (gitignored)
├── vercel.json                ← Vercel deploy config
├── package.json
│
├── src/                       ← Everything 11ty processes
│   │
│   ├── _data/                 ← Global data (available in all templates)
│   │   ├── site.json          ← Site-wide config (name, description, socials)
│   │   ├── ko.json            ← Korean UI strings
│   │   ├── en.json            ← English UI strings
│   │   └── episodes.json      ← Episode manifest (order, slugs, lock status)
│   │
│   ├── _includes/             ← Nunjucks templates
│   │   ├── base.njk           ← HTML shell (head, body, scripts)
│   │   ├── reader.njk         ← Episode reader layout
│   │   ├── home.njk           ← Homepage layout
│   │   └── partials/
│   │       ├── nav.njk        ← Navbar with lang dropdown
│   │       ├── hero.njk       ← Homepage hero strip
│   │       ├── sidebar.njk    ← Episode list with lock icons
│   │       ├── reader-body.njk ← Article content wrapper
│   │       ├── paywall.njk    ← Gate card (injected by JS, also static fallback)
│   │       ├── comments.njk   ← Comments section shell
│   │       ├── auth-modal.njk ← Sign in / Sign up modal
│   │       └── right-panel.njk ← Visitor count + comments (desktop)
│   │
│   ├── content/               ← Episode markdown files
│   │   ├── ko/
│   │   │   ├── ko.11tydata.json  ← Sets lang: "ko" for all files in this dir
│   │   │   ├── index.njk         ← Korean homepage
│   │   │   ├── ep1.md
│   │   │   ├── ep2.md
│   │   │   ├── ep3.md
│   │   │   └── ep4.md
│   │   └── en/
│   │       ├── en.11tydata.json  ← Sets lang: "en" for all files in this dir
│   │       ├── index.njk         ← English homepage
│   │       ├── ep1.md
│   │       ├── ep2.md
│   │       ├── ep3.md
│   │       └── ep4.md
│   │
│   ├── about/
│   │   ├── ko.njk             ← /about/ko/
│   │   └── en.njk             ← /about/en/
│   │
│   ├── characters/
│   │   ├── ko.njk
│   │   └── en.njk
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css       ← CSS variables + resets
│   │   │   ├── layout.css     ← Nav, hero, sidebar, reader, panels
│   │   │   ├── components.css ← Buttons, modals, gate card, comments
│   │   │   └── typography.css ← Font-face, headings, body text
│   │   ├── fonts/             ← Self-hosted fonts (Noto Serif KR, etc.)
│   │   └── img/
│   │       └── og-image.jpg   ← Open Graph image
│   │
│   └── js/
│       ├── appwrite.js        ← Appwrite SDK init + exported client
│       ├── auth.js            ← Signup, signin, signout, session check
│       ├── gate.js            ← Reading gate logic (blur + inject paywall)
│       ├── comments.js        ← Load + post comments
│       ├── counter.js         ← Trigger visitor increment function
│       └── lang.js            ← Language cookie + dropdown handler
│
└── _site/                     ← Generated output (gitignored, Vercel deploys this)
    ├── ko/
    │   ├── index.html
    │   ├── ep1/index.html
    │   ├── ep2/index.html
    │   └── ...
    └── en/
        ├── index.html
        ├── ep1/index.html
        └── ...
```

---

## .eleventy.js Config

```javascript
module.exports = function(eleventyConfig) {
  // Pass-through assets (don't process, just copy)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/js");

  // Markdown options
  const markdownIt = require("markdown-it");
  const md = markdownIt({ html: true, breaks: true, linkify: false });
  eleventyConfig.setLibrary("md", md);

  // Custom filter: format dates
  eleventyConfig.addFilter("dateFormat", (date, locale) => {
    return new Date(date).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  // Custom filter: get i18n string
  eleventyConfig.addFilter("t", function(key) {
    const lang = this.ctx.lang || "ko";
    const strings = this.ctx[lang] || {};
    return strings[key] || key;
  });

  // Collection: all Korean episodes in order
  eleventyConfig.addCollection("koEpisodes", col =>
    col.getFilteredByGlob("src/content/ko/ep*.md")
       .sort((a, b) => a.data.episode - b.data.episode)
  );

  // Collection: all English episodes in order
  eleventyConfig.addCollection("enEpisodes", col =>
    col.getFilteredByGlob("src/content/en/ep*.md")
       .sort((a, b) => a.data.episode - b.data.episode)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
```

---

## vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "_site",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    { "source": "/", "destination": "/ko/index.html" }
  ]
}
```

---

## package.json (scripts section)

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "clean": "rimraf _site"
  },
  "dependencies": {
    "@11ty/eleventy": "^3.0.0",
    "appwrite": "^16.0.0",
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "rimraf": "^5.0.0"
  }
}
```

> **Note:** Appwrite SDK (`appwrite` npm package) is used **client-side only** via a bundled JS file or CDN. Do NOT import it in `.eleventy.js` or any server-side 11ty template — 11ty has no runtime, it only runs at build time.

---

## Data Flow

```
Build time (11ty runs):
  src/content/ko/ep1.md  ──┐
  src/_data/ko.json      ──┤──► 11ty processes ──► _site/ko/ep1/index.html
  src/_includes/*.njk    ──┘        (static HTML, no server)

Runtime (browser loads page):
  _site/ko/ep1/index.html ──► Browser
      │
      ├── gate.js      ──► Check Appwrite session ──► blur or unlock content
      ├── counter.js   ──► Call Appwrite Function  ──► increment view count
      └── comments.js  ──► Query Appwrite DB       ──► render comments
```

---

## Language Routing

11ty generates two parallel static trees. The language is baked into the URL path — no runtime i18n library needed.

```
/ko/ep1/ ── Korean content + Korean UI strings
/en/ep1/ ── English content + English UI strings
```

The language dropdown in the navbar uses `lang.js` to:
1. Save the chosen language to cookie `pillar_lang`
2. Navigate to the same episode slug in the new language
   - Current URL: `/ko/ep3/` → New URL: `/en/ep3/`
   - Uses `window.location.pathname.replace('/ko/', '/en/')` (and vice versa)

---

## CSS Architecture

Mobile-first. Write base styles for small screens, then use `@media (min-width: 768px)` for desktop.

```css
/* Example pattern — always mobile first */
.main-layout {
  display: flex;
  flex-direction: column;   /* Mobile: stacked */
}

@media (min-width: 768px) {
  .main-layout {
    flex-direction: row;    /* Desktop: side by side */
  }
  .sidebar { display: block; width: 220px; }
  .right-panel { display: block; width: 200px; }
}
```

The sidebar and right panel are **hidden on mobile** (`display: none`) and shown on desktop. On mobile, the episode list appears as a collapsible section above the reader.

---

## Appwrite SDK — Client Setup

```javascript
// src/js/appwrite.js
import { Client, Account, Databases, Functions } from "https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR_PROJECT_ID");

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const DB_ID = "THE_PILLAR_DB";
export const COMMENTS_COLLECTION = "comments";
export const VISITORS_COLLECTION = "visitors";
export const INCREMENT_FUNCTION = "increment_visitor";
```

All other JS files import from `appwrite.js`. Keep the project ID in this one file.