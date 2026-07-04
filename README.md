<p align="center">
  <img src="public/assets/icon128.png" alt="DevTools" width="120" height="120">
</p>

<h1 align="center">DevTools — Screenshot, Fonts, Colors &amp; Meta Inspector</h1>

<p align="center">
  Free, open-source Chrome extension and all-in-one developer toolkit: capture full-page
  screenshots, inspect fonts on hover, pick colors with the eyedropper, and audit SEO
  metadata. <b>100% local, zero tracking.</b>
</p>

<p align="center">
  <a href="https://devtools-ext.vercel.app">Live site</a> ·
  <a href="#installation">Install</a> ·
  <a href="#environment-variables">Env setup</a> ·
  <a href="#project-structure">Structure</a>
</p>

---

## Overview

DevTools bundles the utilities developers and designers reach for every day into one
lightweight Chrome extension. Everything runs entirely in your browser — no servers, no
analytics, no telemetry. The repository also contains the marketing/landing site (a React
SPA) and a serverless contact endpoint.

## Features

- **🖥️ Screenshots** — Full Page (seamless scroll + stitch), Visible viewport, or custom
  Region. Includes device viewport presets and background layout options.
- **🔠 Fonts** — Hover any element to read `font-family`, `font-size`, `font-weight`,
  `color`, `line-height`, `letter-spacing`, style, and the HTML tag.
- **🎨 Colors** — Use the browser's native EyeDropper API to pick any pixel on screen and
  copy HEX, RGB, or HSL.
- **🔍 Meta Inspector** — Audit SEO headers, Open Graph tags, Twitter/X cards, manifests,
  hreflang alternates, and JSON-LD structured data.
- **🧰 Image Toolkit** — Convert, compress, crop, and resize images locally in the browser.

**Device presets:** iPhone SE / 14 series, Pixel 5/7, Galaxy S20/S21, Galaxy Fold, iPad
Mini / iPad / iPad Pro 11″/12.9″, Surface Pro, Surface Duo, or a custom width × height ×
DPR.

**Export formats:** PNG, JPEG, WebP, PDF, SVG.

**Privacy:** 100% local processing — nothing ever leaves your device. No telemetry, no
tracking, works offline.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (multi-entry build for popup / result / toolkit / landing + background & content scripts)
- **Tailwind CSS** (semantic theme tokens, dark/light)
- **wouter** (landing-site routing)
- **jsPDF** (PDF export)
- **Chrome Extension Manifest V3**
- **Vercel** serverless function (`/api/contact`) for the contact form

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/mosabbir-maruf/DevTools.git
cd DevTools
npm install
npm run build
```

<a id="installation"></a>

### Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the `dist` folder inside the project directory.

Pin the extension from the toolbar puzzle icon for one-click access.

## Development

```bash
npm run dev         # start the Vite dev server (landing site)
npm run typecheck   # type-check with tsc --noEmit
npm run lint        # run ESLint
npm run build       # type-check + production build to dist/
npm run preview     # preview the production build
```

## Environment Variables

The contact form on the landing site posts to a Vercel serverless function
(`api/contact.js`) that forwards submissions to a **Telegram** chat. These variables are
**server-side only** and are never exposed to the browser.

| Variable             | Description                                        |
| -------------------- | -------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID`   | Numeric chat/channel id that should receive messages |

### How to obtain them

1. **Create a bot** — message [@BotFather](https://t.me/BotFather) on Telegram, run
   `/newbot`, and copy the token it gives you (looks like `123456789:ABC-DEF...`).
2. **Get your chat id** — send any message to your new bot, then either:
   - message [@userinfobot](https://t.me/userinfobot) to read your numeric id, or
   - call `https://api.telegram.org/bot<TOKEN>/getUpdates` and read `result[].message.chat.id`.

### Local setup

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
TELEGRAM_BOT_TOKEN=123456789:your-bot-token-here
TELEGRAM_CHAT_ID=your-numeric-chat-id-here
```

> `.env` is git-ignored. Local `npm run dev` serves the static site only — the
> `/api/contact` function runs on Vercel (or `vercel dev`).

### Production setup (Vercel)

In your Vercel project: **Settings → Environment Variables** → add `TELEGRAM_BOT_TOKEN`
and `TELEGRAM_CHAT_ID`, then redeploy.

The endpoint includes a honeypot field, per-instance rate limiting, input validation, and
HTML escaping to guard against spam and injection.

## Deployment

The site deploys to **Vercel** as a static SPA plus the `/api` serverless function.
`vercel.json` rewrites all non-`/api` routes to `index.html` so client-side routing works:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

Connect the repo in the Vercel dashboard, set the environment variables above, and deploy.

## Project Structure

```
DevTools/
├── api/
│   └── contact.js               # Vercel serverless fn — forwards contact form to Telegram
├── public/
│   ├── assets/                  # Extension icons (16/32/48/128 PNG + icon.svg)
│   ├── favicon.ico
│   ├── manifest.json            # Chrome extension manifest (MV3)
│   ├── meta-og.png              # Open Graph / social preview image (PNG)
│   ├── meta-og.webp             # Open Graph / social preview image (WebP)
│   └── mosabbir-maruf.webp      # Author photo (About page)
├── src/
│   ├── background/
│   │   └── background.ts        # Service worker — message router, screen capture stitching
│   ├── content/
│   │   └── content.ts           # Selection overlays, font-hover highlights, EyeDropper trigger
│   ├── components/              # Shared tool UI (popup + landing)
│   │   ├── CaptureButton.tsx
│   │   ├── ColorPicker.tsx      # Eyedropper color picker panel
│   │   ├── ExportOptions.tsx    # Format & quality selector
│   │   ├── FontDetector.tsx     # Font inspector panel
│   │   ├── ImageToolkit.tsx     # Convert / compress / crop / resize studio
│   │   ├── MetaInspector.tsx    # SEO metadata inspector panel
│   │   ├── ModeSelector.tsx     # Capture mode picker
│   │   ├── PresetSelector.tsx   # Device preset & custom size UI
│   │   └── Preview.tsx          # Result viewer (pan, zoom, export, delete)
│   ├── popup/                   # Extension popup app (380×600)
│   │   ├── App.tsx              # Tool tabs navigation entry point
│   │   ├── main.tsx
│   │   ├── index.html
│   │   ├── index.css            # Tailwind imports, fonts, theme tokens, global styles
│   │   └── components/
│   │       ├── ImagesTab.tsx
│   │       └── WebsiteTab.tsx
│   ├── result/                  # Full-screen capture result page
│   │   ├── ResultApp.tsx
│   │   ├── main.tsx
│   │   └── index.html
│   ├── toolkit/                 # Standalone image toolkit page
│   │   ├── main.tsx
│   │   └── index.html
│   ├── landing/                 # Marketing site (React SPA)
│   │   ├── Landing.tsx          # Shell — header, footer, wouter router
│   │   ├── ThemeToggle.tsx      # Animated dark/light switch
│   │   ├── useTheme.ts          # Theme state + View Transitions reveal
│   │   ├── index.html           # SEO / OG / Twitter meta + JSON-LD
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── About.tsx
│   │       ├── Guide.tsx
│   │       ├── Faq.tsx
│   │       ├── Contact.tsx
│   │       └── MetaPage.tsx     # Standalone meta inspector tool page
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   └── utils/
│       ├── image.ts             # Image/PDF download & conversion
│       ├── imageProcessor.ts    # Client-side image transforms
│       ├── metadata.ts          # Metadata parsing helpers
│       ├── presets.ts           # Device preset definitions
│       └── zip.ts               # ZIP bundling for batch export
├── index.html                   # Root entry (dev mode)
├── vite.config.ts               # Vite build config (multi-entry)
├── tailwind.config.js           # Tailwind theme tokens
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── vercel.json                  # SPA rewrites + /api routing
├── .env.example                 # Telegram env template
├── LICENSE
└── README.md
```

## Uninstall

1. Go to `chrome://extensions`.
2. Find **DevTools** and click **Remove**.
3. (Optional) Delete the cloned project folder.

## License

[MIT](LICENSE)

## Author

**Mosabbir Maruf** — [GitHub](https://github.com/mosabbir-maruf)
