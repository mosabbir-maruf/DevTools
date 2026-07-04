import { useCallback } from 'react';

const SITE_URL = 'https://devtools-ext.vercel.app';

const PAGES: { label: string; path: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'Guide', path: '/guide' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export default function WebsiteTab() {
  const openSite = useCallback((path = '/') => {
    const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
    chrome.tabs.create({ url });
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center text-accent mx-auto shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            DevTools Website
          </h3>
          <p className="text-[11px] text-text-secondary leading-normal max-w-[280px] mx-auto">
            Visit the official DevTools landing page for documentation, features overview, installation guide, and more.
          </p>
        </div>

        <button
          onClick={() => openSite('/')}
          className="w-full py-2.5 rounded-xl bg-accent text-[#0a0a0a] text-xs font-bold uppercase tracking-wider hover:bg-white active:scale-95 transition-all shadow-[0_0_12px_rgba(215,207,190,0.2)] cursor-pointer"
        >
          Open Website
        </button>
      </div>

      <div className="bg-bg-secondary/40 border border-border-subtle rounded-xl p-3.5 space-y-2.5">
        <span className="block text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
          Site Pages
        </span>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-secondary font-semibold">
          {PAGES.map(page => (
            <button
              key={page.label}
              onClick={() => openSite(page.path)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 bg-bg-base border border-border-subtle hover:border-accent/40 hover:text-text-primary transition-colors cursor-pointer text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span>{page.label}</span>
              <svg className="ml-auto text-text-muted" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="font-mono text-[9px] text-text-muted text-center uppercase tracking-wider">
        <span className="text-accent font-semibold">{SITE_URL}</span>
      </div>
    </div>
  );
}
