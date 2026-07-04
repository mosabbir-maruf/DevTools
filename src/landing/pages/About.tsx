import { Link } from 'wouter';

const utilities = [
  {
    tag: 'Screenshots',
    desc: 'Full-page scroll stitching, visible viewport grabs, and custom region selection with device presets. Export to PNG, JPEG, WebP, PDF, or SVG.',
  },
  {
    tag: 'Fonts',
    desc: 'Hover any element to read font family, size, weight, color, line-height, letter-spacing, and the underlying HTML tag in real time.',
  },
  {
    tag: 'Colors',
    desc: 'Pick any pixel on screen with the native EyeDropper API and copy HEX, RGB, or HSL values in a single click.',
  },
  {
    tag: 'Meta',
    desc: 'Audit standard headers, Open Graph cards, Twitter/X metadata, manifests, hreflang alternates, and JSON-LD structured schemas.',
  },
];

const principles = [
  { k: '01', title: 'Local by default', desc: 'Every capture, inspection, and conversion runs in your browser. Nothing is ever uploaded.' },
  { k: '02', title: 'Zero tracking', desc: 'No analytics, no telemetry, no accounts. Nothing to sign up for, nothing to opt out of.' },
  { k: '03', title: 'Open source', desc: 'Released under the MIT license. Read the source, file an issue, or send a pull request.' },
  { k: '04', title: 'Works offline', desc: 'Because processing is local, the toolkit keeps working with or without a connection.' },
];

const stats = [
  { value: '4', label: 'Utilities' },
  { value: '5', label: 'Export formats' },
  { value: '0', label: 'Servers' },
  { value: 'MIT', label: 'License' },
];

export default function About() {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto">

        {/* Hero — editorial, left-aligned */}
        <section className="border-b border-border-subtle pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent-ink font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">About</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <h1 className="lg:col-span-8 text-[34px] sm:text-[56px] font-semibold tracking-tight leading-[1.05] text-text-primary">
              A developer toolkit that respects your <span className="text-accent-ink italic">privacy.</span>
            </h1>
            <p className="lg:col-span-4 text-text-secondary text-[15px] leading-relaxed">
              A free, open-source Chrome extension that brings four everyday web utilities into one
              lightweight popup — running entirely inside your browser.
            </p>
          </div>
        </section>

        {/* Stat strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 border-b border-border-subtle">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 sm:px-6 py-8 sm:py-10 border-border-subtle ${
                i % 2 === 0 ? 'border-r' : ''
              } sm:border-r sm:last:border-r-0 ${
                i >= 2 ? 'border-t sm:border-t-0' : ''
              }`}
            >
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">{s.value}</div>
              <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-12 sm:py-20 border-b border-border-subtle">
          <div className="lg:col-span-4">
            <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">[ Why it exists ]</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-light tracking-tight text-text-primary">Built for the browser, not the cloud.</h2>
          </div>
          <div className="lg:col-span-8 space-y-4 text-text-secondary text-[15px] leading-relaxed lg:text-[16px]">
            <p>
              Most screenshot and design tools ship your content to a remote server before you get a result.
              For sensitive pages, internal dashboards, or client work, that trade-off is rarely acceptable.
            </p>
            <p>
              DevTools takes the opposite approach. It keeps the tools developers and designers reach for
              every day close at hand, and processes everything on-device. No uploads, no queues, no waiting —
              just fast, reliable output you can trust with any page.
            </p>
          </div>
        </section>

        {/* Utilities — numbered editorial list */}
        <section className="py-12 sm:py-20 border-b border-border-subtle">
          <div className="flex items-baseline justify-between mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-text-primary">Four utilities, one extension</h2>
            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">01 — 04</span>
          </div>
          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {utilities.map((u, i) => (
              <div key={u.tag} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-6 sm:py-7 group">
                <div className="sm:col-span-1 font-mono text-xs font-bold text-accent-ink">{String(i + 1).padStart(2, '0')}</div>
                <div className="sm:col-span-3">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-ink transition-colors">{u.tag}</h3>
                </div>
                <p className="sm:col-span-8 text-[14px] text-text-secondary leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Principles — compact numbered grid */}
        <section className="py-12 sm:py-20 border-b border-border-subtle">
          <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">[ What we stand for ]</span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {principles.map((p) => (
              <div key={p.k} className="space-y-3">
                <span className="font-mono text-[11px] font-bold text-text-tertiary">{p.k}</span>
                <div className="w-full h-px bg-border-subtle" />
                <h3 className="text-sm font-semibold text-text-primary">{p.title}</h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Maker + CTA — closing panel */}
        <section className="py-12 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-secondary">
            {/* ambient glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
            {/* corner ticks */}
            <span className="absolute top-4 left-4 w-2 h-2 border-t border-l border-border-default" />
            <span className="absolute top-4 right-4 w-2 h-2 border-t border-r border-border-default" />
            <span className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-border-default" />
            <span className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-border-default" />

            <div className="relative z-10 p-8 sm:p-12 lg:p-14">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                {/* Maker identity */}
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <img
                      src="/mosabbir-maruf.webp"
                      alt="Mosabbir Maruf"
                      loading="lazy"
                      className="w-16 h-16 rounded-2xl object-cover border border-border-default"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center" title="Verified">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Verified">
                        <path fill="#1d9bf0" d="M12 2.5l2.36 1.7 2.9-.02 1.68 2.36 2.86.65-.02 2.9.65 2.86-2.36 1.68-.02 2.9-2.9-.02L14.36 22 12 20.3 9.64 22l-1.68-2.36-2.9.02-.02-2.9-2.36-1.68.65-2.86-.02-2.9 2.86-.65L7.28 4.18l2.9.02z"/>
                        <path fill="#fff" d="M10.6 14.6l-2.2-2.2-1.2 1.2 3.4 3.4 6-6-1.2-1.2z"/>
                      </svg>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-[0.2em]">Designed & built by</span>
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary leading-none">Mosabbir Maruf</h2>
                    <a
                      href="https://github.com/mosabbir-maruf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-mono text-text-secondary hover:text-accent-ink transition-colors"
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      @mosabbir-maruf
                    </a>
                  </div>
                </div>

                {/* divider */}
                <div className="hidden lg:block w-px self-stretch bg-border-subtle" />

                {/* Closing note + actions */}
                <div className="lg:max-w-sm space-y-5">
                  <p className="text-[14px] text-text-secondary leading-relaxed">
                    DevTools is an open-source project, free forever. Contributions, bug reports, and feature
                    ideas are always welcome.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://github.com/mosabbir-maruf/FullScreenShot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-accent text-on-accent rounded-full font-semibold hover:bg-accent-dim hover:scale-[1.02] active:scale-95 transition-all duration-200 text-[13px]"
                    >
                      Install From GitHub
                    </a>
                    <Link
                      href="/guide"
                      className="inline-flex items-center justify-center px-6 py-3 bg-bg-base text-text-primary rounded-full font-medium hover:bg-bg-tertiary hover:scale-[1.02] active:scale-95 transition-all duration-200 text-[13px] border border-border-default"
                    >
                      Read the Guide
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
