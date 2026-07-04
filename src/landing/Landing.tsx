/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Router, Route, Switch, Link } from 'wouter';
import '../popup/index.css';

import Home from './pages/Home';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Guide from './pages/Guide';
import MetaPage from './pages/MetaPage';
import About from './pages/About';
import ImageToolkit from '../components/ImageToolkit';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './useTheme';

function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLight, toggle } = useTheme();

  return (
    <Router>
      {/* Mobile Sidebar Overlay (Outside main wrapper to prevent clipping) */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-dvh z-50 flex justify-end lg:hidden animate-fade-in">
          <div 
            className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="relative w-[280px] max-w-[80vw] h-full bg-bg-base border-l border-border-default shadow-2xl flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-border-subtle bg-bg-secondary shrink-0">
              <span className="font-mono text-[11px] font-bold tracking-widest text-text-primary uppercase">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-text-secondary hover:text-accent-ink focus:outline-none transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col p-6 gap-6 font-mono text-sm tracking-widest uppercase font-semibold flex-1 min-h-0 overflow-y-auto">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/toolkit" className="text-text-secondary hover:text-accent-ink transition-colors">Image Toolkit</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/meta" className="text-text-secondary hover:text-accent-ink transition-colors">Meta Inspector</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/guide" className="text-text-secondary hover:text-accent-ink transition-colors">Guide</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="text-text-secondary hover:text-accent-ink transition-colors">About</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/faq" className="text-text-secondary hover:text-accent-ink transition-colors">FAQ</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="text-text-secondary hover:text-accent-ink transition-colors">Contact</Link>
            </div>
            <div className="p-6 border-t border-border-subtle bg-bg-secondary shrink-0 space-y-4">
              <button
                onClick={(e) => toggle(e)}
                className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-bg-base border border-border-subtle hover:border-accent transition-all text-text-primary font-mono text-xs uppercase tracking-widest"
              >
                <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
                <span className="w-5 h-5 flex items-center justify-center text-text-secondary" aria-hidden="true">
                  {isLight ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </span>
              </button>
              <a
                href="https://github.com/mosabbir-maruf/FullScreenShot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-bg-base border border-border-subtle hover:border-accent hover:text-accent-ink transition-all text-text-primary font-mono text-xs uppercase tracking-widest shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}

      <div className="bg-bg-base text-text-primary flex flex-col font-sans select-none antialiased overflow-x-hidden" style={{ minHeight: '100dvh' }}>
        {/* Editorial Grid Line Header */}
        <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-8 w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-3 overflow-hidden cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold tracking-tight uppercase leading-none truncate group-hover:text-accent-ink transition-colors">DevTools</h1>
              </div>
            </Link>

            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-[11px] font-mono font-semibold tracking-widest uppercase">
              <Link href="/toolkit" className="text-text-secondary hover:text-accent-ink transition-colors">Image Toolkit</Link>
              <Link href="/meta" className="text-text-secondary hover:text-accent-ink transition-colors">Meta Inspector</Link>
              <Link href="/guide" className="text-text-secondary hover:text-accent-ink transition-colors">Guide</Link>
              <Link href="/about" className="text-text-secondary hover:text-accent-ink transition-colors">About</Link>
              <Link href="/faq" className="text-text-secondary hover:text-accent-ink transition-colors">FAQ</Link>
              <Link href="/contact" className="text-text-secondary hover:text-accent-ink transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-text-tertiary shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok shrink-0 animate-pulse" />
              <span className="text-ok font-semibold text-[9px] tracking-wider">SYS_OPERATIONAL</span>
            </div>
            <ThemeToggle isLight={isLight} onToggle={toggle} />
            <a
              href="https://github.com/mosabbir-maruf/FullScreenShot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-1.5 rounded-md border border-border-subtle hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
              title="View Source on GitHub"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </header>

        {/* Main Content Area Routing */}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/toolkit">
            <div className="flex-1 flex flex-col relative z-10 min-h-0 bg-bg-base">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
                <div className="text-center space-y-6 mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-accent-ink font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">Toolkit</span>
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-[36px] sm:text-[52px] font-semibold tracking-tight leading-[1.05] text-text-primary">
                      Image Toolkit
                    </h1>
                    <p className="text-text-secondary text-[16px] max-w-xl mx-auto leading-relaxed">
                      Convert, compress, resize, crop, and edit images entirely in your browser — no uploads, no servers.
                    </p>
                  </div>
                </div>
              </div>
              <ImageToolkit />
            </div>
          </Route>
          <Route path="/meta" component={MetaPage} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={Faq} />
          <Route path="/contact" component={Contact} />
          <Route path="/guide" component={Guide} />
          <Route>
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              <Link href="/" className="text-accent-ink hover:underline">Return Home</Link>
            </div>
          </Route>
        </Switch>

        {/* Footer editorial details */}
        <footer className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-12 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 mt-auto text-[9px] sm:text-[10px] text-text-tertiary font-mono">
          <div className="order-2 md:order-1 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <p className="text-center md:text-left">© 2026 DEVTOOLS. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-3">
              <span className="font-semibold tracking-widest">VERSION: V2.0</span>
              <div className="w-px h-3 bg-border-subtle" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ok shrink-0 animate-pulse" />
                <span className="text-ok font-semibold tracking-wider text-[8px]">SYS_OPERATIONAL</span>
              </div>
            </div>
          </div>

          <div className="order-3 md:order-2 text-center md:text-right">
            DESIGNED & CRAFTED BY{' '}
            <a 
              href="https://github.com/mosabbir-maruf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              MOSABBIR MARUF
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<LandingPage />);
}
