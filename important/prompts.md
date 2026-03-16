# Vibe Coder Prompts — THE PILLAR

> Feed these prompts **in order** to your AI coding assistant (Cursor, Windsurf, etc.).
> Each prompt builds on the previous one. Do not skip steps.
> Before each prompt, make sure the previous step is working and committed.

---

## Before You Start

1. Create a new folder: `the-pillar/`
2. Place all docs from `the-pillar-docs/` where you can reference them
3. Create an Appwrite project following `Appwrite.md` — you need the Project ID before Prompt 4
4. Node.js 18+ required

---

## Prompt 1 — Project Scaffold

```
Create a new 11ty project called "the-pillar" with the following setup:

1. Initialize package.json with these scripts:
   - "dev": "eleventy --serve"
   - "build": "eleventy"
   - "clean": "rimraf _site"

2. Install dependencies:
   - @11ty/eleventy@^3.0.0
   - markdown-it@^14.0.0

3. Install devDependencies:
   - rimraf@^5.0.0

4. Create .eleventy.js using EXACTLY the config from Architecture.md
   (the full config block under "## .eleventy.js Config")

5. Create vercel.json using EXACTLY the content from Architecture.md
   (the block under "## vercel.json")

6. Create .gitignore with: node_modules/, _site/, .env.local

7. Create .env.local with placeholder values:
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=REPLACE_ME
   APPWRITE_DATABASE_ID=the_pillar_db

8. Create the full folder structure from Architecture.md
   (the tree under "## Folder Structure") — create empty placeholder files
   where needed so the structure is visible.

Run "npm run dev" and confirm 11ty starts without errors.
```

---

## Prompt 2 — Data Files and i18n

```
Add all data files to the 11ty project:

1. Create src/_data/site.json using the content from Content.md
   (under "## Site Config")

2. Create src/_data/ko.json using the FULL content from Content.md
   (under "### src/_data/ko.json")

3. Create src/_data/en.json using the FULL content from Content.md
   (under "### src/_data/en.json")

4. Create src/_data/episodes.json using the FULL content from Content.md
   (under "## Episode Manifest")

5. Create src/content/ko/ko.11tydata.json using Content.md
   (under "## Directory Data Files")

6. Create src/content/en/en.11tydata.json using Content.md

After these files exist, confirm 11ty can still build without errors.
```

---

## Prompt 3 — CSS Design System

```
Create the complete CSS for the project based on Design.md.

1. Create src/assets/css/main.css:
   - All CSS custom properties (variables) from Design.md "## Color Palette — CSS Variables"
   - CSS reset: box-sizing border-box, margin 0, padding 0 on *, line-height 1 on html
   - Font loading: add the Google Fonts <link> tags to base.njk (see Design.md Typography)

2. Create src/assets/css/typography.css:
   - All type scale variables
   - .episode-body styles
   - [lang="ko"] .episode-body override
   - Drop cap (::first-letter) style
   - .episode-label style
   - .episode-title style
   - blockquote style
   - All from Design.md "## Typography" section

3. Create src/assets/css/layout.css:
   - Navbar styles (from Design.md "### Navbar")
   - 3-column main layout (sidebar 220px / reader flex:1 max 620px / right-panel 200px)
   - Mobile-first: sidebar and right-panel are display:none on mobile
   - @media (min-width: 768px) reveals sidebar and right-panel
   - Hero strip styles
   - Progress bar styles

4. Create src/assets/css/components.css:
   - .ep-item sidebar item (from Design.md "### Episode Sidebar Item")
   - .paywall-gate card (from Design.md "### Reading Gate Card")
   - .paywall-blur-zone + ::after (from Design.md "## Paywall Blur Effect")
   - Auth modal styles (from Design.md "### Auth Modal")
   - .comment-item (from Design.md "### Comment Item")
   - .visitor-box (from Design.md "## Visitor Counter")
   - Language <select> dropdown style
   - All buttons: .btn-primary, .btn-secondary, .btn-signin, .btn-signup

Use ONLY the exact color values from Design.md. No external CSS libraries.
```

---

## Prompt 4 — Base Templates

```
Create all Nunjucks templates. Reference Design.md for all styles and Plan.md for layout specs.

1. Create src/_includes/base.njk:
   - Full HTML shell with <!DOCTYPE html>, <html lang="{{ lang }}">, <head>, <body>
   - <head> includes: charset, viewport meta, title (episode title + " | THE PILLAR"),
     Open Graph meta tags (og:title, og:description, og:image from site.json),
     Google Fonts link tags, CSS imports (main, typography, layout, components)
   - <body> includes: nav partial, {% block content %}{% endblock %}, auth modal partial
   - Before </body>: script tags for all JS files (appwrite.js, auth.js, gate.js,
     comments.js, counter.js, lang.js)
   - Add data attribute to <body>: data-lang="{{ lang }}" data-slug="{{ slug }}"

2. Create src/_includes/partials/nav.njk:
   - Logo: "THE PILLAR" with subtitle "기둥 · 柱"
   - Nav links: Read, About, Characters (use i18n strings from the lang data file)
   - Language <select> dropdown with id="lang-select":
     Options rendered from site.availableLangs, label from ko[lang_ko] / en[lang_en]
     Selected option = current page lang
   - Right side: Sign in + Create account buttons (shown when guest)
     OR username + Sign out link (shown when logged in — controlled by JS, not Nunjucks)
   - Mobile: hamburger menu icon, links hidden in a slide-down menu

3. Create src/_includes/partials/auth-modal.njk:
   - Full-screen backdrop div (id="auth-backdrop", display:none initially)
   - Centered modal card
   - Two views: Sign up form (id="form-signup") and Sign in form (id="form-signin")
   - Sign up form fields: Name, Email, Password + submit button
   - Sign in form fields: Email, Password + submit button
   - Toggle link between the two views
   - Error message div (id="auth-error", empty initially)
   - Close button (calls closeAuthModal())

4. Create src/_includes/reader.njk (extends base.njk):
   - {% block content %} with 3-column layout
   - Left: sidebar partial (episode list)
   - Center: reader-body partial (episode content)
   - Right: right-panel partial (visitor count + comments)

5. Create src/_includes/home.njk (extends base.njk):
   - Hero section with title, volume, subtitle, stats (visitor total, episode count)
   - Episode list grid (cards) linking to /{{ lang }}/{{ ep.slug }}/

6. Create src/_includes/partials/sidebar.njk:
   - Loop over episodes data (from episodes.json)
   - Each item: ep number, title in current lang, lock icon if not free
   - Active item highlighted based on current slug
   - Clicking locked episode: calls openAuthModal() via onclick, NO href navigation

7. Create src/_includes/partials/right-panel.njk:
   - Visitor count box (id="visitor-count", filled by JS)
   - Comments section (shell only — JS populates the list)
   - Comment input (hidden for guests, shown for logged-in users)

Verify the build renders valid HTML with "npm run build".
```

---

## Prompt 5 — Episode Content Files

```
Create all episode markdown files for both languages.

For each episode, follow EXACTLY the frontmatter spec from Content.md
("## Episode Markdown Format" and "### Frontmatter Spec").

Korean files (src/content/ko/):
- ep1.md: episode 1, slug "ep1", title "바둑과 구씨"
  Body: Use the Korean excerpt from Content.md as the opening paragraph.
  Add a placeholder comment: <!-- EPISODE BODY: paste full Korean text here -->

- ep2.md: episode 2, slug "ep2", title "바둑판과 말들"
  Add placeholder body: <!-- EPISODE BODY: paste full Korean text here -->

- ep3.md: episode 3, slug "ep3", title "희생의 대마"
  Add placeholder body

- ep4.md: episode 4, slug "ep4", title "같은 곳에 두 번 치는 번개"
  Add placeholder body

English files (src/content/en/):
- ep1.md through ep4.md — same structure, English frontmatter values
  ep1 body: Use the English excerpt from Content.md as the opening 2 paragraphs.

Also create homepage files:
- src/content/ko/index.njk — uses home.njk layout, lang: ko
- src/content/en/index.njk — uses home.njk layout, lang: en

Confirm all 10 files generate correct routes in _site/ after "npm run build":
  _site/ko/ep1/index.html, _site/en/ep1/index.html, etc.
```

---

## Prompt 6 — Client JavaScript

```
Create all client-side JavaScript files. Reference Architecture.md and Appwrite.md for full code.

1. src/js/appwrite.js — EXACT code from Architecture.md "## Appwrite SDK — Client Setup"
   Replace YOUR_PROJECT_ID with the actual Appwrite Project ID.

2. src/js/auth.js — EXACT code from Appwrite.md "### auth.js"

3. src/js/gate.js — Reading gate logic:
   - On DOMContentLoaded, call getSession() from auth.js
   - If session exists: add class "logged-in" to body, show full episode content, return
   - If no session AND current page is an episode page:
     - Find all <p> inside .episode-body
     - If episode slug is "ep1" (from body data-slug attribute):
       - Leave paragraphs 1 and 2 untouched
       - Wrap paragraph 3+ in <div class="paywall-blur-zone">
       - Create and inject .paywall-gate card after the blur zone
       - Gate card contains: "Continue reading?" title, subtitle, two buttons
       - "Create free account" button: calls openAuthModal('signup')
       - "Sign in" button: calls openAuthModal('signin')
     - If episode slug is NOT ep1:
       - Replace entire .episode-body content with a locked message
       - Show gate card immediately (no preview)

4. src/js/auth.js — extend with modal control functions:
   - openAuthModal(view): shows backdrop, sets active form ('signup' or 'signin')
   - closeAuthModal(): hides backdrop, clears form fields and errors
   - On form submit (signup): call signUp(), on success call closeAuthModal() then
     remove gate (call gate.js restoreContent()), update nav UI
   - On form submit (signin): call signIn(), same success flow
   - Toggle between signup/signin views inside the modal

5. src/js/comments.js — EXACT code from Appwrite.md "### comments.js"
   Add a renderComments(comments) function that builds the comment list HTML
   and injects it into the comments container in right-panel.njk.
   Add a postCommentHandler() that handles the comment form submission.

6. src/js/counter.js — EXACT code from Appwrite.md "### counter.js"
   On DOMContentLoaded, call incrementVisitor(slug) where slug comes from body data-slug.
   After increment, fetch the updated count and update #visitor-count element.

7. src/js/lang.js:
   - On DOMContentLoaded, read cookie "pillar_lang"
   - Set the #lang-select value to the cookie value (or "ko" if no cookie)
   - Listen for change events on #lang-select
   - On change: save new lang to cookie (365-day expiry)
     then replace current path's language segment:
     /ko/... → /en/... or /en/... → /ko/...
     Navigate to new URL with window.location.href

After all JS files are created, test the full flow:
  - Guest sees 2-paragraph preview + gate on ep1
  - Guest sees lock on ep2-4
  - Clicking gate "Create account" opens auth modal
  - Signup works and removes gate
  - Language dropdown switches between /ko/ and /en/
```

---

## Prompt 7 — Deploy to Vercel

```
Prepare the project for Vercel deployment.

1. Verify vercel.json has correct buildCommand and outputDirectory from Architecture.md

2. Add all environment variables to Vercel dashboard:
   - APPWRITE_ENDPOINT
   - APPWRITE_PROJECT_ID
   - APPWRITE_DATABASE_ID
   (See Plan.md "## 8. Environment Variables" for full list)

3. Push to GitHub and connect the repo to Vercel

4. In Vercel, set:
   - Framework Preset: Other
   - Build Command: npm run build
   - Output Directory: _site
   - Install Command: npm install

5. After deploy, add the Vercel domain to Appwrite Console → Platforms → Web
   (The project won't work without this — Appwrite blocks requests from unlisted origins)

6. Run the Done Criteria checklist from Plan.md "## 10. Done Criteria"
   and confirm every item is passing.
```

---

## Prompt 8 — Polish and Edge Cases

```
After the main build is working, handle these edge cases:

1. Loading states:
   - Show a loading spinner or skeleton while gate.js is checking the session
   - Prevent content flash (FOUC) by hiding .episode-body until session check completes
   - Add class "session-loaded" to body after check, then show content with CSS transition

2. Error states:
   - If Appwrite is unreachable, show a banner: "Some features are temporarily unavailable"
   - If comment post fails, show inline error below the comment input
   - If visitor increment fails, fail silently (already in counter.js)

3. Auth modal improvements:
   - Disable submit button while request is in flight (add loading state)
   - Clear error message when user starts typing after an error
   - Close modal on backdrop click (clicking outside the card)
   - Close modal on Escape key

4. SEO:
   - Ensure each episode page has unique <title> and <meta description>
   - Add <link rel="alternate" hreflang="ko"> and <link rel="alternate" hreflang="en">
     in <head> pointing to the equivalent page in the other language
   - Add canonical <link> tag

5. Performance:
   - Lazy-load comments (don't fetch until user scrolls near the comments section)
   - Add loading="lazy" to any images
   - Self-host the Appwrite SDK or use CDN with a specific version pinned

6. Mobile hamburger menu:
   - Implement the mobile nav toggle (hamburger icon → slide-down menu)
   - Menu items: Read, About, Characters + language dropdown

Run a final check of Plan.md "## 10. Done Criteria" — every item must be checked off.
```

---

## Reference Checklist for Vibe Coder

At any point if something is unclear, check in this order:

1. **Feature behavior** → `Plan.md` Section 3
2. **File to create / where it goes** → `Architecture.md` Folder Structure
3. **CSS values (colors, spacing, fonts)** → `Design.md`
4. **Appwrite collections / permissions / function** → `Appwrite.md`
5. **Frontmatter format / i18n strings** → `Content.md`
6. **What to build next** → `Prompts.md` (this file)

Do not invent values. If a color, font size, or behavior is not specified in the docs, ask before proceeding.