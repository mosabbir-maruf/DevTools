<p align="center">
  <img src="public/assets/icon128.png" alt="DevTools" width="128" height="128">
</p>

# DevTools — Screenshot, Fonts & Colors Chrome Extension

All-in-one local developer toolkit: capture screenshots, inspect CSS/fonts on-hover, and pick color codes from any web page. A free, open-source Chrome extension that runs entirely in your browser with zero analytics or privacy risks.

## Features

- **Four Integrated Utilities**
  - 🖥️ **Screenshots** — Capture Full Page (seamless scrolling/stitching), visible viewports, or custom regions with background style layouts and presets.
  - 🔠 **Fonts** — Inspect styles live on hover: reads fontFamily, fontSize, fontWeight, color, lineHeight, letterSpacing, styles and HTML tags.
  - 🎨 **Colors** — Use browser's native EyeDropper API to pick pixels from anywhere on screen and copy HEX, RGB, or HSL parameters instantly.
  - 🔍 **Meta Inspector** — Audit SEO headers, Open Graph tags, Twitter/X cards, manifest targets, alternate language URLs, and JSON-LD structured schemas.

- **Device Viewport Presets**
  - Mobile: iPhone SE, iPhone 14 series, Pixel 5/7, Galaxy S20/S21, Galaxy Fold
  - Tablet: iPad Mini, iPad, iPad Pro 11"/12.9", Surface Pro, Surface Duo
  - Custom: set any width, height, and device pixel ratio

- **Screenshot & Image Formats**
  - PNG (lossless), JPEG (compressed), WebP (optimized), PDF (printable document), SVG (vector wrapper)

- **Built for Privacy**
  - 100% local processing — no data ever leaves your device
  - No external servers, no telemetry, no tracking, works completely offline

## Installation

### From Source

```bash
git clone https://github.com/mosabbir-maruf/FullScreenShot.git
cd FullScreenShot
npm install
npm run build
```

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist` folder inside the cloned project directory

The extension icon will appear in your toolbar. Pin it for easy access.

## Uninstallation

1. Open Chrome and go to `chrome://extensions`
2. Find **DevTools** in your list of extensions
3. Click **Remove**
4. (Optional) Delete the cloned project folder from your file system

## Usage

1. Navigate to any webpage.
2. Click the DevTools extension icon in your toolbar.
3. Select your tool tab at the top:
   - **Screenshot** — choose a mode (Full Page, Visible, Region), preset viewports, layout, formats, and click Capture.
   - **Fonts** — click "Start Detecting" and click any highlighted element to show its CSS font properties. Press Escape or toggle off to stop.
   - **Colors** — click "Pick Color" and use the cursor eyedropper to click any pixel on the screen. Select HEX, RGB, or HSL to copy.
   - **Meta** — inspect standard header tags, Open Graph cards, Twitter metadata, manifests, language alternates, and JSON-LD schemas instantly.

## Project Structure

```
FullScreenShot/
├── public/                    # Static extension assets
│   ├── assets/                # Icons (16, 32, 48, 128 PNG + SVG)
│   ├── favicon.ico
│   ├── manifest.json          # Chrome extension manifest (MV3)
│   └── meta-og.webp           # Open Graph preview image
├── src/
│   ├── background/
│   │   └── background.ts      # Service worker — message router, screen capture stitching
│   ├── components/
│   │   ├── CaptureButton.tsx   # Capture action button
│   │   ├── ExportOptions.tsx   # Format & quality selector
│   │   ├── ModeSelector.tsx    # Capture mode picker
│   │   ├── PresetSelector.tsx  # Device preset & custom size UI
│   │   ├── Preview.tsx         # Result viewer (pan, zoom, export, delete)
│   │   ├── FontDetector.tsx    # Font inspector tool tab panel
│   │   ├── ColorPicker.tsx     # Eyedropper color picker tool tab panel
│   │   └── MetaInspector.tsx   # SEO metadata inspector tool tab panel
│   ├── content/
│   │   └── content.ts         # Selection overlays, live font hover highlights, native EyeDropper trigger
│   ├── landing/
│   │   ├── Landing.tsx         # Marketing site shell (header, footer, router)
│   │   ├── index.html
│   │   └── pages/
│   │       ├── Contact.tsx
│   │       ├── Faq.tsx
│   │       ├── Guide.tsx
│   │       └── Home.tsx
│   ├── popup/
│   │   ├── App.tsx             # Popup window — tool tabs navigation entry point
│   │   ├── index.css           # Tailwind imports, fonts, global styles
│   │   ├── index.html
│   │   └── main.tsx
│   ├── result/
│   │   ├── ResultApp.tsx       # Capture result loader
│   │   ├── index.html
│   │   └── main.tsx
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   └── utils/
│       ├── image.ts            # Image/PDF download & conversion
│       └── presets.ts          # Device preset definitions
├── index.html                 # Root entry (dev mode)
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts             # Vite build config (multi-entry)
├── tailwind.config.js         # Tailwind theme tokens
├── postcss.config.js
├── eslint.config.js
├── generate-icons.js          # Icon generation script (sharp)
├── LICENSE
└── README.md
```

## Development

```bash
# Start dev server (landing page)
npm run dev

# Type-check
npm run typecheck

# Production build
npm run build
```

## License

[MIT](LICENSE)

## Author

**Mosabbir Maruf** — [GitHub](https://github.com/mosabbir-maruf)
