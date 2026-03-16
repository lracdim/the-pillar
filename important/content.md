# Content Structure — THE PILLAR

> This document defines how episode content is written, organized, and served. All writers and editors should follow this spec.

---

## Episode Markdown Format

Each episode is a `.md` file with YAML frontmatter followed by the episode body.

### Frontmatter Spec

```yaml
---
episode: 1                          # Episode number (integer, used for ordering)
slug: ep1                           # URL slug — must match filename and visitors doc ID
lang: ko                            # Language: "ko" or "en"
title: "바둑과 구씨"                  # Episode title in the file's language
titleRomanized: "The Go and the Gu" # Romanized / translated title (used in meta tags)
volume: 1                           # Volume number
wordCount: 3200                     # Approximate word count (for reading time)
published: true                     # false = draft, will not appear in build
date: 2024-01-15                    # Publication date (ISO 8601)
excerpt: "소년에게는 지킬 이름이 없었다."  # 1–2 sentence teaser (for episode list + SEO)
---
```

### Full Example — Korean Episode 1

```markdown
---
episode: 1
slug: ep1
lang: ko
title: "바둑과 구씨"
titleRomanized: "The Go and the Gu"
volume: 1
wordCount: 3200
published: true
date: 2024-01-15
excerpt: "소년에게는 지킬 이름이 없었다. 마을 사람들은 그를 고아라고 불렀다."
---

소년에게는 지킬 이름이 없었다. 마을 사람들은 그를 고아라고 불렀는데, 그것은 이름이 아니라 결핍에 대한 설명일 뿐이었다. 그는 이를 고치지 않았다. 이름은 손잡이와 같은 것이었다 — 그리고 손잡이는 들려가야 할 것들을 위한 것이었다.

그는 장터 밖 길에서 바둑판을 발견했다. 누군가 급히 자리를 뜨면서 버려 둔 것이었다. 흑돌과 백돌이 아직 따뜻한 채로 남아 있었다. 그는 먼지 속에 앉아 오후 내내 그것을 들여다봤다. 상인이 그에게 무엇을 하느냐고 물었다. 그는 대답하지 않았다.

<!-- 이하 분량 계속... -->
```

### Full Example — English Episode 1

```markdown
---
episode: 1
slug: ep1
lang: en
title: "The Go and the Gu"
titleRomanized: "The Go and the Gu"
volume: 1
wordCount: 3200
published: true
date: 2024-01-15
excerpt: "The boy had no name worth keeping. The village called him Orphan, which was not a name at all."
---

The boy had no name worth keeping. The village called him Orphan, which was not a name at all, only a description of what was missing. He did not correct them. A name was a handle — and handles were for things that needed to be carried away.

He found the Go board on the road outside the market. It had been abandoned, mid-game, the black and white stones still warm from whoever had left them there in a hurry. He sat in the dust and studied it for the better part of an afternoon, saying nothing. A merchant asked him what he was doing. He did not answer that either.

By dusk, he had resolved the game — both sides of it. He left the board where he found it. He took nothing. Only the pattern remained in his mind, already reorganising itself into something the original players had never intended.

<!-- Continue episode... -->
```

---

## Writing Rules for Episodes

1. **No H1 headings inside the body** — the episode title is rendered by the template from `frontmatter.title`, not from a `#` heading in the markdown
2. **Use `##` only for major scene breaks** — sparingly, not every section
3. **Horizontal rules (`---`) for scene separators** — renders as a decorative divider in CSS
4. **Blockquotes (`>`) for in-story spoken quotes** — styled with gold left border
5. **No external images in episode body** — the novel is text-only
6. **Korean and English files are independent translations** — they are not auto-translated; each language file must be written/translated manually
7. **Word count in frontmatter is approximate** — update it but don't obsess over precision

---

## Directory Data Files

These set default frontmatter for all files in a folder, so you don't repeat `lang` in every file:

**`src/content/ko/ko.11tydata.json`:**
```json
{
  "lang": "ko",
  "layout": "reader.njk",
  "permalink": "/ko/{{ slug }}/"
}
```

**`src/content/en/en.11tydata.json`:**
```json
{
  "lang": "en",
  "layout": "reader.njk",
  "permalink": "/en/{{ slug }}/"
}
```

---

## i18n String Files

These files live in `src/_data/` and are available in all Nunjucks templates as `ko` and `en`.

### `src/_data/ko.json`

```json
{
  "nav_read": "읽기",
  "nav_about": "소개",
  "nav_characters": "등장인물",
  "nav_signin": "로그인",
  "nav_signup": "계정 만들기",
  "nav_signout": "로그아웃",

  "lang_select_label": "언어",
  "lang_ko": "🇰🇷 한국어",
  "lang_en": "🇺🇸 English",

  "hero_volume": "제1권",
  "hero_subtitle": "숨겨진 전략가 · 조선 왕국",
  "stat_readers": "독자",
  "stat_episodes": "에피소드",
  "stat_kingdoms": "왕국",

  "sidebar_episodes": "에피소드",
  "sidebar_locked": "잠김",
  "sidebar_free_preview": "무료 미리보기",

  "gate_title": "계속 읽으시겠어요?",
  "gate_subtitle": "더 필라의 모든 에피소드를 읽으려면 무료 계정을 만드세요.",
  "gate_cta_signup": "무료 계정 만들기",
  "gate_cta_signin": "로그인",

  "auth_join_title": "이야기에 참여하세요",
  "auth_join_subtitle": "무료. 광고 없음. 소설만 있습니다.",
  "auth_name_label": "이름",
  "auth_email_label": "이메일",
  "auth_password_label": "비밀번호",
  "auth_signup_btn": "계정 만들기",
  "auth_signin_btn": "로그인",
  "auth_switch_to_signin": "이미 계정이 있으신가요?",
  "auth_switch_to_signup": "계정이 없으신가요?",

  "comments_title": "댓글",
  "comments_placeholder": "생각을 남겨주세요... (3–500자)",
  "comments_post_btn": "등록",
  "comments_signin_prompt": "댓글을 남기려면 로그인하세요",
  "comments_empty": "아직 댓글이 없습니다. 첫 번째 독자가 되어 주세요.",
  "comments_loading": "댓글을 불러오는 중...",

  "visitor_label": "조회",
  "reading_time_suffix": "분 읽기",

  "ep_prev": "이전 화",
  "ep_next": "다음 화"
}
```

### `src/_data/en.json`

```json
{
  "nav_read": "Read",
  "nav_about": "About",
  "nav_characters": "Characters",
  "nav_signin": "Sign in",
  "nav_signup": "Create account",
  "nav_signout": "Sign out",

  "lang_select_label": "Language",
  "lang_ko": "🇰🇷 한국어",
  "lang_en": "🇺🇸 English",

  "hero_volume": "VOLUME I",
  "hero_subtitle": "The Hidden Strategist · Joseon Kingdom",
  "stat_readers": "Readers",
  "stat_episodes": "Episodes",
  "stat_kingdoms": "Kingdoms",

  "sidebar_episodes": "EPISODES",
  "sidebar_locked": "Locked",
  "sidebar_free_preview": "Free preview",

  "gate_title": "Continue reading?",
  "gate_subtitle": "Create a free account to unlock all episodes of The Pillar.",
  "gate_cta_signup": "Create free account",
  "gate_cta_signin": "Sign in",

  "auth_join_title": "Join the story",
  "auth_join_subtitle": "Free. No ads. Just the novel.",
  "auth_name_label": "Name",
  "auth_email_label": "Email",
  "auth_password_label": "Password",
  "auth_signup_btn": "Create account",
  "auth_signin_btn": "Sign in",
  "auth_switch_to_signin": "Already have an account?",
  "auth_switch_to_signup": "Don't have an account?",

  "comments_title": "Comments",
  "comments_placeholder": "Leave a thought... (3–500 characters)",
  "comments_post_btn": "Post",
  "comments_signin_prompt": "Sign in to leave a comment",
  "comments_empty": "No comments yet. Be the first reader.",
  "comments_loading": "Loading comments...",

  "visitor_label": "Views",
  "reading_time_suffix": "min read",

  "ep_prev": "Previous",
  "ep_next": "Next"
}
```

---

## Episode Manifest (`src/_data/episodes.json`)

This file drives the sidebar list and lock status. Update it whenever a new episode is added.

```json
[
  {
    "slug": "ep1",
    "episode": 1,
    "free": true,
    "published": true,
    "titles": {
      "ko": "바둑과 구씨",
      "en": "The Go and the Gu"
    }
  },
  {
    "slug": "ep2",
    "episode": 2,
    "free": false,
    "published": true,
    "titles": {
      "ko": "바둑판과 말들",
      "en": "The Go Board and Its Pieces"
    }
  },
  {
    "slug": "ep3",
    "episode": 3,
    "free": false,
    "published": true,
    "titles": {
      "ko": "희생의 대마",
      "en": "The Great Piece of Sacrifice"
    }
  },
  {
    "slug": "ep4",
    "episode": 4,
    "free": false,
    "published": true,
    "titles": {
      "ko": "같은 곳에 두 번 치는 번개",
      "en": "Lightning Strikes the Same Place Twice"
    }
  }
]
```

**`free: true`** = show 2-paragraph preview to guests. All other locked episodes (free: false) show nothing — just the lock icon in the sidebar.

---

## Site Config (`src/_data/site.json`)

```json
{
  "name": "THE PILLAR",
  "nameKo": "기둥",
  "tagline": "Volume I: The Hidden Strategist",
  "url": "https://thepillar.vercel.app",
  "ogImage": "/assets/img/og-image.jpg",
  "twitterHandle": "",
  "defaultLang": "ko",
  "availableLangs": ["ko", "en"]
}
```