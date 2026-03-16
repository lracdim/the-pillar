# Design System — THE PILLAR

> This document is the visual contract. Do not deviate from these values — every color, font, and spacing choice is intentional to match the stoic, historical aesthetic of the novel.

---

## Aesthetic Direction

**Mood:** Dark parchment. Ink gold on near-black. Like reading a manuscript by candlelight.
**Tone:** Stoic, restrained, editorial. No gradients (except one approved blur-fade). No drop shadows. No glows.
**Reference feel:** Old Joseon court records, hand-bound books, stone tablets.

---

## Color Palette — CSS Variables

```css
:root {
  /* Backgrounds */
  --bg-base:       #0d0b09;   /* Page background — near black with warm tint */
  --bg-surface:    #131008;   /* Cards, reader area */
  --bg-raised:     #1a1710;   /* Sidebar items, inputs, dropdowns */
  --bg-overlay:    rgba(13, 11, 9, 0.85); /* Modal backdrop */

  /* Ink / Gold — primary brand color */
  --ink:           #c9a96e;   /* Primary: headings, active states, accents */
  --ink-dim:       #7a6a50;   /* Muted: borders, secondary labels */
  --ink-bright:    #dfc08a;   /* Hover states on ink elements */

  /* Text */
  --text-primary:  #d8ccb8;   /* Main body text */
  --text-secondary:#8a7d6a;   /* Supporting text, descriptions */
  --text-muted:    #5a5248;   /* Timestamps, metadata */
  --text-faint:    #3a3228;   /* Disabled, placeholder */

  /* Borders */
  --border-base:   #2a2318;   /* Default borders */
  --border-dim:    #1e1b14;   /* Very subtle dividers */
  --border-active: #c9a96e;   /* Focused inputs, active items */

  /* Semantic */
  --success:       #4a8c5c;
  --error:         #8c4a4a;
  --warning:       #8c7a4a;

  /* Paywall blur overlay */
  --blur-gradient: linear-gradient(transparent, var(--bg-base));
}
```

---

## Typography

### Fonts

| Role | Font | Fallback | Source |
|------|------|----------|--------|
| Display / Headings | Noto Serif KR | Georgia, serif | Google Fonts |
| Body (Korean) | Noto Sans KR | sans-serif | Google Fonts |
| Body (English) | Crimson Pro | Georgia, serif | Google Fonts |
| UI / Labels | System UI | -apple-system, sans-serif | Native |
| Episode numbers / caps | tracked system UI | — | Native + letter-spacing |

### Font Loading (in `base.njk` `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

### Type Scale

```css
/* Base */
html { font-size: 16px; }

/* Scale */
--text-xs:   11px;   /* Metadata, timestamps, caps labels */
--text-sm:   13px;   /* Comments, secondary UI */
--text-base: 15px;   /* Episode body text */
--text-md:   18px;   /* Section headers */
--text-lg:   24px;   /* Episode title */
--text-xl:   36px;   /* Homepage title */
--text-2xl:  48px;   /* Hero title */

/* Line heights */
--leading-tight:  1.3;   /* Headings */
--leading-body:   1.9;   /* Episode prose — generous for reading comfort */
--leading-ui:     1.5;   /* UI text */

/* Letter spacing */
--tracking-caps:  0.15em;  /* Episode labels, section headers in caps */
--tracking-logo:  0.18em;  /* THE PILLAR logo */
```

### Typography CSS

```css
/* Episode body — the most important text style */
.episode-body {
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: var(--text-base);
  line-height: var(--leading-body);
  color: var(--text-secondary);
  max-width: 64ch;
}

/* Korean episode body */
[lang="ko"] .episode-body {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  line-height: 2.0;   /* Korean text benefits from more line height */
}

/* Drop cap — first paragraph of each episode */
.episode-body p:first-of-type::first-letter {
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 52px;
  font-weight: 700;
  color: var(--ink);
  float: left;
  line-height: 0.8;
  margin: 6px 10px 0 0;
}

/* Chapter label above episode title */
.episode-label {
  font-size: var(--text-xs);
  color: var(--ink-dim);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-bottom: 6px;
}

/* Episode title */
.episode-title {
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-bottom: 28px;
}

/* Blockquote / in-story quotes */
.episode-body blockquote {
  border-left: 2px solid var(--ink);
  margin: 20px 0;
  padding: 8px 16px;
  background: rgba(201, 169, 110, 0.04);
  border-radius: 0 6px 6px 0;
  font-style: italic;
  color: var(--text-muted);
}
```

---

## Component Specs

### Navbar

```
Height:       56px
Background:   var(--bg-surface)
Border-bottom: 0.5px solid var(--border-base)
Padding:      0 32px (desktop) · 0 16px (mobile)

Logo:
  Font:       Noto Serif KR, 700, 18px
  Color:      var(--ink)
  Letter-spacing: var(--tracking-logo)
  Subtitle:   "기둥 · 柱" — 10px, var(--text-faint)

Language dropdown:
  Width:      140px
  Background: var(--bg-raised)
  Border:     0.5px solid var(--border-base)
  Border-radius: 6px
  Font:       12px, var(--text-secondary)
  On focus:   border-color: var(--border-active)

Nav links (desktop only):
  Font:       12px, letter-spacing: 0.08em
  Color:      var(--text-secondary)
  Active:     var(--ink), border-bottom: 1px solid var(--ink)

Buttons:
  Sign in:    transparent bg, 0.5px border var(--ink-dim), var(--ink) text, 11px, 6px 14px padding
  Sign up:    var(--ink) bg, var(--bg-base) text, 11px, font-weight: 600
  Both:       border-radius: 6px, cursor: pointer
```

### Episode Sidebar Item

```css
.ep-item {
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.ep-item:hover { background: var(--bg-raised); }
.ep-item.active {
  background: var(--bg-raised);
  border-left-color: var(--ink);
}
.ep-item.locked { cursor: pointer; opacity: 0.5; }
.ep-item .ep-num { font-size: 11px; font-weight: 600; color: var(--ink); }
.ep-item .ep-title { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
.ep-item.locked .ep-num { color: var(--text-faint); }
.ep-item.locked .ep-title { color: var(--text-faint); }
```

### Reading Gate Card

```css
.paywall-gate {
  background: var(--bg-surface);
  border: 0.5px solid var(--border-base);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin: 0 0 40px;
}
/* Icon: 📖 — 28px */
/* Title: Noto Serif KR, 18px, var(--text-primary) */
/* Subtitle: 13px, var(--text-secondary), line-height 1.7 */

.gate-btn-primary {
  background: var(--ink);
  color: var(--bg-base);
  font-size: 13px;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.gate-btn-primary:hover { background: var(--ink-bright); }

.gate-btn-secondary {
  background: transparent;
  color: var(--ink);
  font-size: 13px;
  padding: 12px 24px;
  border-radius: 8px;
  border: 0.5px solid var(--ink-dim);
  cursor: pointer;
}
```

### Auth Modal

```
Backdrop:     fixed, full screen, var(--bg-overlay), z-index: 1000
Modal card:   background var(--bg-surface), border-radius: 16px,
              padding: 32px, max-width: 380px, centered
Close button: top-right, 24px × 24px, var(--text-muted)

Inputs:
  Background:    var(--bg-raised)
  Border:        0.5px solid var(--border-base)
  Border-radius: 6px
  Padding:       10px 14px
  Font-size:     14px
  Color:         var(--text-primary)
  On focus:      border-color: var(--border-active), outline: none

Error messages:
  Font-size: 12px
  Color: var(--error)
  Margin-top: 4px
```

### Comment Item

```css
.comment-item {
  padding: 12px 0;
  border-bottom: 0.5px solid var(--border-dim);
}
.comment-user {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
}
.comment-body {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.comment-time {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 4px;
}
```

### Progress Bar (Reader)

```
Height:    2px
Track bg:  var(--border-base)
Fill bg:   var(--ink)
Width:     % calculated as (chars read / total chars) * 100
Position:  Below navbar, sticky on scroll (desktop) · below header (mobile)
```

---

## Paywall Blur Effect

```css
/* Wrapper for paragraphs after the 2nd */
.paywall-blur-zone {
  position: relative;
  overflow: hidden;
}

/* The blurred text */
.paywall-blur-zone p {
  filter: blur(4px);
  user-select: none;
  pointer-events: none;
  opacity: 0.4;
}

/* Gradient fade at the bottom of the blur zone */
.paywall-blur-zone::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: var(--blur-gradient);
  pointer-events: none;
}
```

**JS logic (in gate.js):**
1. Find all `<p>` tags inside `.episode-body`
2. Leave paragraphs 1 and 2 untouched
3. Wrap paragraphs 3+ in a `<div class="paywall-blur-zone">`
4. Inject `.paywall-gate` element immediately after the blur zone
5. On auth success: remove blur zone wrapper + gate, restore paragraphs to normal

---

## Visitor Counter (Right Panel / Mobile)

```css
.visitor-box {
  background: var(--bg-raised);
  border-radius: 8px;
  padding: 14px;
  text-align: center;
}
.visitor-num {
  font-size: 28px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.visitor-label {
  font-size: 10px;
  color: var(--text-faint);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  margin-top: 4px;
}
```

---

## Responsive Breakpoints

```css
/* Mobile base styles — written first, no media query */

/* Tablet / Desktop */
@media (min-width: 768px) {
  /* 3-column layout activates */
  /* Sidebar becomes visible */
  /* Right panel becomes visible */
}

/* Wide desktop */
@media (min-width: 1200px) {
  /* Max content width: 1100px, centered */
  /* Reader column gets slightly wider */
}
```

---

## Approved One-Off Exceptions

1. `filter: blur(4px)` — paywall blur only
2. `linear-gradient(transparent, var(--bg-base))` — paywall fade-out overlay only
3. `rgba(13, 11, 9, 0.85)` — modal backdrop only
4. `position: fixed` — auth modal backdrop and sticky progress bar only