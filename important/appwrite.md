# Appwrite Setup — THE PILLAR

> This document covers every Appwrite resource needed. Create these in the Appwrite Console before running the app. See `Architecture.md` for SDK initialization code.

---

## Project Setup

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and create a project named `the-pillar`
2. Note the **Project ID** — add it to `.env.local` and Vercel env vars
3. Under **Platforms**, add a **Web** platform:
   - Name: `THE PILLAR Web`
   - Hostname: `localhost` (for dev) + your Vercel domain (for prod)
   - Add both as separate entries

---

## Auth Configuration

**Method:** Email + Password only.

In Appwrite Console → Auth → Settings:
- ✅ Enable **Email/Password** provider
- ❌ Disable all OAuth providers (Google, GitHub, etc.)
- ❌ Disable Magic URL
- ❌ Disable Anonymous sessions

**Session settings:**
- Session length: 30 days
- Session limit per user: 5

**Email templates** (optional but recommended):
- Customize the verification email with THE PILLAR branding
- From name: "THE PILLAR · 기둥"

---

## Database

Database name: `the-pillar-db`
Database ID: `the_pillar_db` (set this explicitly for predictability)

### Collection 1: `comments`

Collection ID: `comments`

| Attribute | Type | Required | Size | Notes |
|-----------|------|----------|------|-------|
| `episodeSlug` | String | ✅ | 20 | e.g. `ep1`, `ep2` |
| `language` | String | ✅ | 5 | `ko` or `en` |
| `userId` | String | ✅ | 36 | Appwrite user `$id` |
| `userName` | String | ✅ | 80 | Stored at post time (denormalized) |
| `body` | String | ✅ | 500 | Comment text — max 500 chars |
| `createdAt` | Datetime | ✅ | — | ISO 8601, set server-side |

**Indexes:**
- Index on `episodeSlug` + `language` (for fast episode comment queries)
- Index on `userId` (for user comment history)
- Index on `createdAt` DESC (for newest-first ordering)

**Permissions:**
```
Read:   any              (guests can read comments)
Create: users            (must be logged in to post)
Update: user:{userId}    (own comments only)
Delete: user:{userId}    (own comments only)
```

Set via Appwrite Console → Database → comments → Settings → Permissions.

---

### Collection 2: `visitors`

Collection ID: `visitors`

| Attribute | Type | Required | Size | Notes |
|-----------|------|----------|------|-------|
| `slug` | String | ✅ | 20 | e.g. `ep1`, `home` |
| `count` | Integer | ✅ | — | Default: 0 |
| `lastUpdated` | Datetime | ✅ | — | Auto-updated by Function |

**Indexes:**
- Unique index on `slug` (one document per episode)

**Permissions:**
```
Read:   any              (everyone can see counts)
Create: (none — created by Function only)
Update: (none — updated by Function only)
Delete: (none)
```

**Pre-create documents** for each episode:
```json
[
  { "$id": "ep1", "slug": "ep1", "count": 0 },
  { "$id": "ep2", "slug": "ep2", "count": 0 },
  { "$id": "ep3", "slug": "ep3", "count": 0 },
  { "$id": "ep4", "slug": "ep4", "count": 0 },
  { "$id": "home", "slug": "home", "count": 0 }
]
```

---

## Appwrite Function: `increment_visitor`

This Function is called by the client when a reader lands on an episode page. It atomically increments the view count. Running this as a Function (not direct DB write) prevents client-side abuse.

**Function settings:**
- Name: `increment_visitor`
- Function ID: `increment_visitor`
- Runtime: `node-18.0`
- Entry point: `src/index.js`
- Timeout: 10 seconds
- Execute permissions: `any` (guests also increment the counter)

**Function code (`src/index.js`):**

```javascript
const { Client, Databases } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const slug = req.body?.slug || req.query?.slug;

  if (!slug) {
    return res.json({ ok: false, message: "slug required" }, 400);
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);

  const DB_ID = process.env.DATABASE_ID || "the_pillar_db";
  const COL_ID = "visitors";

  try {
    // Get current doc
    const doc = await db.getDocument(DB_ID, COL_ID, slug);
    const newCount = (doc.count || 0) + 1;

    // Update
    await db.updateDocument(DB_ID, COL_ID, slug, {
      count: newCount,
      lastUpdated: new Date().toISOString()
    });

    log(`Incremented ${slug} → ${newCount}`);
    return res.json({ ok: true, count: newCount });
  } catch (err) {
    error("Increment failed: " + err.message);
    return res.json({ ok: false, message: err.message }, 500);
  }
};
```

**Function environment variables** (set in Appwrite Console → Functions → increment_visitor → Settings → Variables):
```
DATABASE_ID = the_pillar_db
```
The other `APPWRITE_FUNCTION_*` vars are injected automatically by Appwrite.

**Function dependencies (`package.json` in function folder):**
```json
{
  "dependencies": {
    "node-appwrite": "^12.0.0"
  }
}
```

---

## Client-Side SDK Usage

### appwrite.js (full init)

```javascript
// src/js/appwrite.js
import { Client, Account, Databases, Functions } from
  "https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js";

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR_PROJECT_ID");          // ← replace with actual ID

export const account  = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const DB_ID      = "the_pillar_db";
export const COL_COMMENTS  = "comments";
export const COL_VISITORS  = "visitors";
export const FN_INCREMENT  = "increment_visitor";
```

### auth.js

```javascript
import { account } from './appwrite.js';

// Sign up
export async function signUp(name, email, password) {
  try {
    await account.create('unique()', email, password, name);
    await signIn(email, password);     // auto sign in after signup
  } catch (err) {
    throw new Error(parseAppwriteError(err));
  }
}

// Sign in
export async function signIn(email, password) {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (err) {
    throw new Error(parseAppwriteError(err));
  }
}

// Sign out
export async function signOut() {
  await account.deleteSession('current');
  window.location.reload();
}

// Get current session (returns null if not logged in)
export async function getSession() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

// Parse Appwrite error codes into user-friendly messages
function parseAppwriteError(err) {
  const code = err?.code;
  if (code === 401) return "Invalid email or password.";
  if (code === 409) return "An account with this email already exists.";
  if (code === 429) return "Too many attempts. Please wait a moment.";
  return err?.message || "Something went wrong. Please try again.";
}
```

### comments.js

```javascript
import { databases, DB_ID, COL_COMMENTS } from './appwrite.js';
import { Query } from "https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js";

// Load comments for an episode in a language
export async function loadComments(episodeSlug, language) {
  const result = await databases.listDocuments(DB_ID, COL_COMMENTS, [
    Query.equal('episodeSlug', episodeSlug),
    Query.equal('language', language),
    Query.orderDesc('createdAt'),
    Query.limit(50)
  ]);
  return result.documents;
}

// Post a comment
export async function postComment(episodeSlug, language, userId, userName, body) {
  if (body.length < 3 || body.length > 500) {
    throw new Error("Comment must be between 3 and 500 characters.");
  }
  return await databases.createDocument(DB_ID, COL_COMMENTS, 'unique()', {
    episodeSlug,
    language,
    userId,
    userName,
    body: body.trim(),
    createdAt: new Date().toISOString()
  });
}
```

### counter.js

```javascript
import { functions, FN_INCREMENT } from './appwrite.js';

export async function incrementVisitor(slug) {
  try {
    await functions.createExecution(FN_INCREMENT, JSON.stringify({ slug }));
  } catch (err) {
    console.warn("Counter increment failed:", err.message);
    // Non-critical — fail silently
  }
}
```

---

## Appwrite Console Checklist

Before going live, verify:

- [ ] Project created, Web platform added with correct hostnames
- [ ] Email/Password auth enabled, all OAuth disabled
- [ ] `the-pillar-db` database created
- [ ] `comments` collection created with all attributes and indexes
- [ ] `visitors` collection created with all attributes
- [ ] Visitor documents pre-created for ep1–ep4 and home
- [ ] `comments` permissions: Read=any, Create=users
- [ ] `visitors` permissions: Read=any, Create/Update=none (Function only)
- [ ] `increment_visitor` Function deployed and tested
- [ ] Function environment variable `DATABASE_ID` set
- [ ] All env vars added to Vercel dashboard