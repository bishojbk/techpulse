# TechPulse

A modern, production-ready tech news aggregator that runs as a **native desktop app** on macOS and Windows. Built with Next.js 15, Tauri v2, and a Rust backend — zero cost, no databases, no paid APIs, no auth.

TechPulse fetches news from 10+ sources in real-time, categorizes articles using keyword matching, and presents them in a clean, responsive UI with dark/light mode support.

![macOS](https://img.shields.io/badge/macOS-supported-brightgreen) ![Windows](https://img.shields.io/badge/Windows-supported-blue) ![License](https://img.shields.io/badge/license-MIT-gray)

---

## Features

- **10+ News Sources** — TechCrunch, The Verge, Ars Technica, Wired, MIT Tech Review, VentureBeat, Engadget, Hacker News, Reddit (r/technology, r/programming, r/artificial)
- **Rust RSS Backend** — Blazing fast parallel feed fetching using `reqwest`, `rss`, and `atom_syndication` crates
- **Auto-Categorization** — Articles sorted into AI, Dev, Security, Hardware, Startups, Science, and General using keyword matching
- **Native Desktop App** — Tauri v2 wraps the app in a lightweight native WebView (~7MB on macOS)
- **Command Palette Search** — Press `Cmd+K` (or `Ctrl+K`) to instantly search across all loaded articles
- **Bookmarks** — Save articles to read later, stored in localStorage
- **Dark/Light Mode** — Default dark theme with one-click toggle
- **10-Min Cache** — In-memory Rust cache prevents redundant API calls
- **Responsive UI** — Mobile-first design with 1/2/3 column grid layouts
- **Zero Cost** — No database, no paid APIs, no authentication required

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| **Desktop Shell** | Tauri v2 (WebKit on macOS, WebView2 on Windows) |
| **Backend** | Rust (reqwest, rss, atom_syndication, chrono, tokio) |
| **Fonts** | DM Sans (via next/font/google) |
| **Theming** | next-themes |
| **Icons** | Inline SVGs + Google Favicons API |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│               Tauri v2 Shell                │
│  ┌────────────────────────────────────────┐ │
│  │        Next.js Static Export           │ │
│  │  ┌──────────┐  ┌───────────────────┐  │ │
│  │  │  Pages   │  │   Components      │  │ │
│  │  │ (Client) │  │ ArticleCard       │  │ │
│  │  │          │  │ CategoryBar       │  │ │
│  │  │ /        │  │ SearchCommand     │  │ │
│  │  │ /category│  │ BookmarkButton    │  │ │
│  │  │ /bookmark│  │ Header/Footer     │  │ │
│  │  └──────────┘  └───────────────────┘  │ │
│  │         │ invoke("fetch_all_feeds")    │ │
│  └─────────┼─────────────────────────────┘ │
│            │                                │
│  ┌─────────▼─────────────────────────────┐ │
│  │         Rust Backend                   │ │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ │ │
│  │  │ RSS     │ │ Hacker   │ │ Reddit │ │ │
│  │  │ Feeds   │ │ News API │ │ Atom   │ │ │
│  │  └────┬────┘ └────┬─────┘ └───┬────┘ │ │
│  │       └────────────┼───────────┘      │ │
│  │            ┌───────▼──────┐           │ │
│  │            │  Normalize   │           │ │
│  │            │  Deduplicate │           │ │
│  │            │  Categorize  │           │ │
│  │            │  Cache (10m) │           │ │
│  │            └──────────────┘           │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Data Sources

### RSS Feeds (parsed with `rss` / `atom_syndication` crates)
| Source | Format | URL |
|--------|--------|-----|
| TechCrunch | RSS | `https://techcrunch.com/feed/` |
| The Verge | Atom | `https://www.theverge.com/rss/index.xml` |
| Ars Technica | RSS | `https://feeds.arstechnica.com/arstechnica/index` |
| Wired | RSS | `https://www.wired.com/feed/rss` |
| MIT Tech Review | RSS | `https://www.technologyreview.com/feed/` |
| VentureBeat | RSS | `https://venturebeat.com/feed/` |
| Engadget | RSS | `https://www.engadget.com/rss.xml` |
| r/technology | Atom | `https://www.reddit.com/r/technology/.rss` |
| r/programming | Atom | `https://www.reddit.com/r/programming/.rss` |
| r/artificial | Atom | `https://www.reddit.com/r/artificial/.rss` |

### Hacker News API (free, no auth)
- Top stories: `GET https://hacker-news.firebaseio.com/v0/topstories.json`
- Story details: `GET https://hacker-news.firebaseio.com/v0/item/{id}.json`
- Fetches top 30 stories with points and comment counts

---

## Project Structure

```
techpulse/
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider
│   ├── page.tsx                  # Homepage (client component)
│   ├── globals.css               # Tailwind + custom animations
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx          # Category page (server wrapper + client)
│   └── bookmarks/
│       └── page.tsx              # Bookmarks page (client component)
├── components/
│   ├── article-card.tsx          # Article card with hover effects
│   ├── article-grid.tsx          # Responsive grid with orphan handling
│   ├── article-skeleton.tsx      # Skeleton loading grid
│   ├── back-to-top.tsx           # Floating scroll-to-top button
│   ├── bookmark-button.tsx       # Heart toggle with pulse animation
│   ├── category-bar.tsx          # Sticky horizontal category tabs
│   ├── category-page-client.tsx  # Client-side category page logic
│   ├── client-shell.tsx          # App shell (header + nav + footer)
│   ├── empty-state.tsx           # Category-aware empty states
│   ├── footer.tsx                # Minimal footer
│   ├── header.tsx                # Sticky header with search + bookmarks
│   ├── page-heading.tsx          # Page title + article count
│   ├── providers.tsx             # ThemeProvider wrapper
│   ├── search-command.tsx        # Cmd+K command palette
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── articles-context.tsx      # React context for articles
│   ├── use-articles.ts           # Client-side fetch hook + auto-refresh
│   └── use-bookmarks.ts          # localStorage bookmarks with useSyncExternalStore
├── lib/
│   ├── categorize.ts             # Keyword-based categorization
│   ├── feeds.ts                  # Node.js RSS fetching (web fallback)
│   ├── open-url.ts               # Cross-platform URL opener (Tauri/browser)
│   ├── sources.ts                # Source definitions + gradient maps
│   ├── tauri.ts                  # Tauri invoke wrapper with runtime detection
│   ├── types.ts                  # TypeScript interfaces + category metadata
│   └── utils.ts                  # relativeTime, stripHtml, truncate, hash
├── src-tauri/
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri window/bundle config
│   ├── capabilities/
│   │   └── default.json          # Permissions (core + opener)
│   ├── icons/                    # App icons for all platforms
│   └── src/
│       ├── main.rs               # Rust entry point
│       ├── lib.rs                # Tauri builder + plugin registration
│       └── feeds.rs              # Full RSS/Atom/HN fetching engine
├── next.config.ts                # Static export config
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- **Node.js** v20+
- **Rust** (via [rustup](https://rustup.rs/))
- **macOS**: Xcode Command Line Tools
- **Windows**: Microsoft Visual Studio C++ Build Tools + WebView2

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/bishojbk/techpulse.git
cd techpulse
npm install
```

### 2. Development (hot-reload)

```bash
npm run tauri:dev
```

This starts the Next.js dev server and opens TechPulse in a native window. Changes to the frontend hot-reload instantly.

### 3. Production build

```bash
npm run tauri:build
```

**Output:**
- macOS: `src-tauri/target/release/bundle/macos/TechPulse.app` (~7MB) and `.dmg` installer (~4MB)
- Windows: `src-tauri/target/release/bundle/msi/` (`.msi` installer) and `nsis/` (`.exe` installer)

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (web only) |
| `npm run build` | Build Next.js static export to `/out` |
| `npm run tauri:dev` | Development mode with Tauri (hot-reload) |
| `npm run tauri:build` | Production build (generates installers) |
| `npm run tauri:icon` | Generate app icons from `src-tauri/icons/icon.png` |
| `npm run lint` | Run ESLint |

---

## Category System

Articles are automatically categorized by matching keywords in the title and excerpt:

| Category | Keywords (sample) |
|----------|------------------|
| **AI** | artificial intelligence, machine learning, LLM, GPT, ChatGPT, OpenAI, Anthropic, deep learning, transformer |
| **Dev** | programming, JavaScript, TypeScript, React, API, GitHub, framework, Docker, Kubernetes, open source |
| **Security** | hack, breach, vulnerability, malware, encryption, CVE, ransomware, zero-day, phishing |
| **Hardware** | chip, processor, GPU, CPU, semiconductor, AMD, Intel, NVIDIA, quantum computing, robotics |
| **Startups** | startup, funding, Series A/B/C, acquisition, IPO, venture capital, Y Combinator |
| **Science** | space, NASA, climate, biotech, physics, CRISPR, genome, SpaceX, astronomy |
| **General** | Everything else |

The categorization runs in Rust for the desktop app and in TypeScript for the web fallback. Both use identical keyword lists.

---

## UI Features

### Branded Gradient Placeholders
Cards without images show source-specific gradient backgrounds (e.g., green for TechCrunch, orange for Ars Technica) with a noise texture overlay and category watermark.

### Card Interactions
- **Hover**: Smooth lift (-4px), shadow expansion, border glow
- **Click**: Opens article in default browser via Tauri's opener plugin
- **Bookmark**: Heart icon with pulse animation on toggle
- **HN Comments**: Separate clickable comment count for Hacker News stories

### Smart Category Badges
Category badges are shown on the homepage but hidden on category-specific pages (redundant information removed).

### Staggered Animations
Cards fade in with a staggered delay (50ms per card, max 400ms) for a polished loading experience.

### Orphan Card Handling
When the last row has a single card, it spans 2 columns to avoid awkward whitespace.

---

## Caching Strategy

The Rust backend maintains an in-memory cache:
- **TTL**: 10 minutes
- **Behavior**: First request fetches all feeds in parallel (~3-5s). Subsequent requests within 10 minutes return cached data instantly.
- **Resilience**: If any individual feed fails (timeout, 403, parse error), it's skipped. Other feeds still load.
- **Deduplication**: Articles are deduplicated by normalized URL (stripped of query params and trailing slashes).
- **Limit**: Maximum 100 articles kept, sorted by publish date (newest first).

---

## Cross-Platform Notes

### macOS
- Uses WebKit (Safari's engine) via Tauri
- App bundle is ~7MB (vs ~150MB+ for Electron)
- `.dmg` installer generated automatically

### Windows
- Uses WebView2 (Edge's engine) via Tauri
- Requires WebView2 runtime (pre-installed on Windows 10/11)
- `.msi` and `.exe` (NSIS) installers generated
- Build on a Windows machine: `npm run tauri:build`

### Web (optional)
The frontend can also run as a standalone web app, but feed fetching requires a server backend (the Rust fetcher only runs in Tauri). To deploy on the web:
1. Revert `next.config.ts` to remove `output: "export"`
2. Re-enable server components in pages
3. Deploy to Vercel

---

## License

MIT
