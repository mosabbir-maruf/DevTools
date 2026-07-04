import { useState } from 'react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is DevTools and how does it work?",
      a: "DevTools is a unified developer browser extension. It integrates three major local utilities: Screenshot capture (Full Page, Visible, and custom Region selection), Font Inspector (hover to extract layout styles like font family, size, weight, line-height, letter-spacing), and Color Picker (using browser EyeDropper API). It runs 100% locally on your computer with zero external dependencies."
    },
    {
      q: "Is there any privacy risk or analytics tracking?",
      a: "Absolutely none. DevTools has zero telemetry, zero analytics script, and zero server network requests. Your screenshots, inspected colors, and visited font styling stays completely local in memory. It operates within your tab environment secure and offline by design."
    },
    {
      q: "What permissions does the extension require?",
      a: "DevTools requests activeTab (to capture or inspect contents of the currently selected tab) and scripting (to load content script wrappers). No permission is required to fetch resources or store external history, ensuring your browser stays fast."
    },
    {
      q: "How does the Font Detector work?",
      a: "When you activate the Font Detector, a lightweight outline highlights the hovered elements. Clicking on any highlighted element queries window.getComputedStyle() to pull true applied styling details. Pressing Escape stops detection and cleans up all DOM markers."
    },
    {
      q: "How does the Color Picker eyedropper work?",
      a: "The Color Picker opens Chrome's native built-in EyeDropper API. This allows picking pixel colors anywhere on your visible computer screen (even outside the webpage body). It parses values into HEX, RGB, and HSL formats with copy shortcuts."
    },
    {
      q: "How does full-page screenshot capture work?",
      a: "Full-page screenshot mode scrolls down the viewport section by section, captures visible tiles, and stitches them inside an Offscreen Canvas context before letting you save it. It automatically hides sticky navigation bars during capture to avoid duplicate overlays."
    },
    {
      q: "How does the Meta Inspector work?",
      a: "The Meta Inspector sends a local message to the content script of your active tab. The script queries webpage elements directly in the DOM (such as standard title, description, canonical link elements, Open Graph tags, Twitter card tags, PWA manifest URLs, and script blocks of type application/ld+json) and returns them to the popup workspace without performing any network requests."
    },
    {
      q: "Is any webpage metadata collected or shared?",
      a: "Never. DevTools is built with a strict offline privacy-first architecture. All metadata parsing and JSON structural audits run entirely locally in your extension sandbox on your machine. No webpage contents, metadata, or URL records are ever collected, cached, or shared with external APIs."
    },
    {
      q: "Is DevTools free and open source?",
      a: "Yes, DevTools is completely free, MIT licensed, and fully open-source. The code is available on GitHub for audit and collaboration."
    }
  ];

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent-ink font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">Support</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-[36px] sm:text-[52px] font-semibold tracking-tight leading-[1.05] text-text-primary">
              FAQ
            </h1>
            <p className="text-text-secondary text-[16px] max-w-xl mx-auto leading-relaxed">
              Everything you need to know about how DevTools works behind the scenes.
            </p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-bg-secondary border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-accent/40 shadow-[0_0_30px_rgba(215,207,190,0.05)]'
                    : 'border-border-subtle hover:border-border-default'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-start sm:items-center justify-between p-5 sm:p-6 cursor-pointer text-left gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors duration-300 ${
                      isOpen ? 'bg-accent text-on-accent' : 'bg-bg-base border border-border-subtle text-text-secondary'
                    }`}>
                      <span className="font-mono font-bold text-[10px]">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <span className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                      isOpen ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-7 h-7 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 border-accent/30' : ''
                  }`}>
                    <svg className={`w-3.5 h-3.5 ${isOpen ? 'text-accent-ink' : 'text-text-tertiary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 sm:px-6 pb-6 sm:pb-6 pt-1">
                    <p className="text-[14px] sm:text-[15px] text-text-secondary leading-relaxed pl-10 sm:pl-11">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
