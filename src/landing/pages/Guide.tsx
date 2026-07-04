import { useState } from 'react';

export default function Guide() {
  const [activeTab, setActiveTab] = useState('run-guide');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const text = `git clone https://github.com/mosabbir-maruf/FullScreenShot.git
cd FullScreenShot
npm install
npm run build`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent-ink font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">Documentation</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-[36px] sm:text-[52px] font-semibold tracking-tight leading-[1.05] text-text-primary">
              Installation Guide
            </h1>
            <p className="text-text-secondary text-[16px] max-w-2xl mx-auto leading-relaxed">
              Everything you need to clone, install, and master the DevTools extension.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'run-guide', label: 'Run Guide' },
            { id: 'features', label: 'Features Guide' },
            { id: 'exporting', label: 'Export Options' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-on-accent shadow-sm'
                  : 'bg-bg-base border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full">

          {/* Run Guide Section */}
          {activeTab === 'run-guide' && (
            <div className="space-y-6 animate-fade-in">

              {/* Step 1 */}
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center">
                    <span className="text-text-primary font-mono font-bold text-sm">01</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">Clone the GitHub Repo</h2>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-5 relative z-10 max-w-[600px]">
                  Get the source code from our GitHub repository and install the required dependencies to build the project locally.
                </p>

                <div className="rounded-xl bg-bg-base border border-border-subtle overflow-hidden relative z-10 shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-border-subtle">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-err/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-ok/70" />
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">bash</span>
                    <button
                      onClick={handleCopy}
                      className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <><span className="text-[9px] font-mono text-ok">Copied</span><svg className="w-3.5 h-3.5 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg></>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="p-5 font-mono text-xs sm:text-sm text-text-primary overflow-x-auto leading-relaxed">
                    <span className="text-accent-ink">git</span> clone https://github.com/mosabbir-maruf/FullScreenShot.git{'\n'}
                    <span className="text-accent-ink">cd</span> FullScreenShot{'\n'}
                    <span className="text-accent-ink">npm</span> install{'\n'}
                    <span className="text-accent-ink">npm</span> run build
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center">
                    <span className="text-text-primary font-mono font-bold text-sm">02</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">Install the Extension</h2>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-5 relative z-10 max-w-[600px]">
                  Once built, you need to load the extension into Chrome Developer mode.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                  {[
                    { step: 'A', text: 'Open Chrome and navigate to chrome://extensions' },
                    { step: 'B', text: 'Enable Developer mode in the top right corner.' },
                    { step: 'C', text: 'Click Load unpacked in the top left.' },
                    { step: 'D', text: 'Select the dist folder inside your project directory.' },
                  ].map(item => (
                    <div key={item.step} className="bg-bg-base border border-border-subtle rounded-xl p-4 hover:border-border-default transition-colors">
                      <span className="text-[9px] font-mono text-text-tertiary font-bold uppercase tracking-wider">Step {item.step}</span>
                      <p className="text-xs sm:text-sm text-text-secondary mt-1.5">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center">
                    <span className="text-text-primary font-mono font-bold text-sm">03</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">Uninstall</h2>
                </div>
                <div className="bg-bg-base border border-border-subtle rounded-xl p-5 relative z-10 space-y-3">
                  {[
                    'Go back to chrome://extensions',
                    'Find DevTools in your list of extensions.',
                    'Click the Remove button.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <svg className={`w-4 h-4 shrink-0 ${i === 2 ? 'text-err' : 'text-text-tertiary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {i === 2
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        }
                      </svg>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {[
                {
                  badge: 'Screenshot Utility',
                  accent: true,
                  title: 'High-Fidelity Capturing',
                  desc: 'Capture Full Page, visible viewports, or crop selective coordinates on the screen. Auto-stitching handles complex, long webpages with ease.'
                },
                {
                  badge: 'Font Inspect',
                  accent: false,
                  title: 'Live Font Inspector',
                  desc: 'Query true element styles on-click. Hovering outlines components, showing font-family, font-size, font-weight, color code, and more.'
                },
                {
                  badge: 'Color Picker',
                  accent: false,
                  title: 'Eyedropper Color Picker',
                  desc: 'Leverage browser\'s native EyeDropper API to pick pixels from anywhere. Review hex, rgb, and hsl values with one-click copy.'
                },
                {
                  badge: 'Meta Inspector',
                  accent: true,
                  title: 'SEO & Metadata Auditor',
                  desc: 'Inspect Open Graph tags, Twitter Cards, canonical links, hreflang, PWA manifests, and JSON-LD schemas 100% locally.'
                },
              ].map(item => (
                <div key={item.title} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-border-default transition-all">
                  <div className={`inline-block px-3 py-1 text-[9px] font-mono uppercase font-bold rounded-lg tracking-wider mb-5 ${
                    item.accent
                      ? 'bg-accent/10 text-accent-ink border border-accent/20'
                      : 'bg-bg-base border border-border-subtle text-text-secondary'
                  }`}>
                    {item.badge}
                  </div>
                  <h2 className="text-xl font-semibold text-text-primary tracking-tight mb-3">{item.title}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Exporting Options Section */}
          {activeTab === 'exporting' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {[
                { label: 'PNG', title: 'Lossless Image', desc: 'Best for UI design references and sharing crisp, pixel-perfect data.' },
                { label: 'JPG', title: 'Compressed Image', desc: 'Best for uploading to Slack or bug trackers where file size heavily matters.' },
                { label: 'PDF', title: 'Printable Document', desc: 'Best for sending full-page long layouts to clients or for physical printing.' },
                { label: 'Clipboard', title: 'Copy to Clipboard', desc: 'Instantly paste captured images, color codes, or font styling strings.', icon: true },
              ].map(item => (
                <div key={item.label} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 sm:p-7 flex flex-col items-start gap-4 group hover:border-border-default transition-all">
                  <div className="w-11 h-11 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center group-hover:border-accent/30 transition-colors">
                    {item.icon ? (
                      <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    ) : (
                      <span className="font-mono text-sm font-bold text-text-primary">{item.label}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
