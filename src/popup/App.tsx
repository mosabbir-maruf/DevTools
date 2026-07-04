import { useState } from 'react';
import { ScreenshotMode, CaptureOptions, ExportFormat, Orientation, ActiveTool } from '../types';
import { allPresets, mobilePresets, tabletPresets } from '../utils/presets';
import ModeSelector    from '../components/ModeSelector';
import PresetSelector  from '../components/PresetSelector';
import ExportOptions   from '../components/ExportOptions';
import CaptureButton   from '../components/CaptureButton';
import FontDetector    from '../components/FontDetector';
import ColorPicker     from '../components/ColorPicker';
import ImagesTab       from './components/ImagesTab';
import MetaInspector   from '../components/MetaInspector';
import WebsiteTab      from './components/WebsiteTab';

const defaultOptions: CaptureOptions = {
  mode: 'fullpage',
  format: 'png',
  quality: 92,
  orientation: 'portrait',
};

const tools: { id: ActiveTool; label: string; icon: JSX.Element }[] = [
  {
    id: 'screenshot',
    label: 'Capture',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    id: 'fonts',
    label: 'Fonts',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
  },
  {
    id: 'colors',
    label: 'Colors',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
  },
  {
    id: 'images',
    label: 'Images',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>
    ),
  },
  {
    id: 'meta',
    label: 'Meta',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    id: 'website',
    label: 'Website',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export default function App() {
  const [options, setOptions]     = useState<CaptureOptions>(defaultOptions);
  const [isCapturing, setCapture] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('screenshot');

  const handleCapture = async () => {
    setCapture(true);
    setError(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id || !tab.windowId) throw new Error('No active tab');

      // For visible/selected mode: capture the screenshot HERE in the popup
      // while the user-gesture / activeTab permission is still active.
      // For fullpage mode, the background script handles scrolling itself and
      // needs to call captureVisibleTab multiple times, so we pass a pre-captured
      // first frame so it can reuse the windowId safely.
      let visibleDataUrl: string | null = null;

      if (options.mode === 'visible' || options.mode === 'selected') {
        // captureVisibleTab works fine here because we are still in the popup
        // execution context where activeTab is in effect.
        visibleDataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
          format: 'png',
          quality: 100,
        });
      }

      const response = await chrome.runtime.sendMessage({
        type: 'CAPTURE',
        payload: {
          options,
          tabId: tab.id,
          windowId: tab.windowId,
          url: tab.url,
          title: tab.title,
          visibleDataUrl, // pre-captured screenshot (for visible/selected)
        },
      });

      if (response?.error) throw new Error(response.error);
      if (!response?.waiting) {
        window.close();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Capture failed');
      setCapture(false);
    }
  };

  const set = <K extends keyof CaptureOptions>(key: K, val: CaptureOptions[K]) =>
    setOptions(p => ({ ...p, [key]: val }));

  const setPreset = (id: string | null) => {
    if (!id) { set('devicePreset', undefined); return; }
    const preset = allPresets.find(p => p.id === id);
    if (preset) set('devicePreset', preset);
  };

  const showPresets = options.mode !== 'selected';

  const activeMeta = tools.find(t => t.id === activeTool);
  const toolSubtitle: Record<ActiveTool, string> = {
    screenshot: 'Capture full-page, visible, or region screenshots',
    fonts: 'Inspect font families and typography on hover',
    colors: 'Pick any color from the page with the eyedropper',
    images: 'Convert, resize, crop, and clean image files',
    meta: 'Read SEO, Open Graph, and structured data',
    website: 'Open the DevTools landing site and docs',
  };

  return (
    <div className="w-[380px] h-[600px] flex bg-bg-base text-text-primary relative overflow-hidden font-sans select-none" style={{ height: '600px' }}>
      {/* Background glow effect */}
      <div className="absolute top-[-120px] right-[-40px] w-64 h-64 bg-accent/10 blur-[90px] rounded-full pointer-events-none" />

      {/* ── Left activity rail ───────────────────────────── */}
      <nav className="w-[68px] shrink-0 flex flex-col items-center bg-[#0d0d0d] border-r border-border-subtle relative z-10 py-3">
        {/* Logo mark */}
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(215,207,190,0.35)] mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>

        <div className="w-8 h-px bg-border-subtle mb-2" />

        <div className="flex-1 flex flex-col items-center gap-1.5 w-full px-2 overflow-y-auto scrollbar-hidden">
          {tools.map(t => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                title={t.label}
                className={`group relative w-full flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 cursor-pointer [&_svg]:w-[17px] [&_svg]:h-[17px] ${
                  isActive
                    ? 'bg-accent text-[#0a0a0a] shadow-[0_2px_12px_rgba(215,207,190,0.25)]'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-white/[0.05]'
                }`}
              >
                {t.icon}
                <span className="text-[8px] font-bold uppercase tracking-wide leading-none">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* GitHub */}
        <button
          onClick={() => chrome.tabs.create({ url: 'https://github.com/mosabbir-maruf' })}
          title="GitHub"
          className="mt-2 w-9 h-9 rounded-xl flex items-center justify-center text-text-tertiary hover:text-accent hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </button>
      </nav>

      {/* ── Content column ───────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Header */}
        <header className="px-4 pt-4 pb-3 border-b border-border-subtle flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight text-text-primary leading-none">
              {activeMeta?.label}
            </h1>
            <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
              {toolSubtitle[activeTool]}
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-mono shrink-0 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isCapturing ? 'bg-accent animate-pulse shadow-[0_0_8px_rgba(215,207,190,0.8)]' : 'bg-ok shadow-[0_0_8px_rgba(46,213,115,0.8)]'}`} />
            <span className={`text-[9px] font-semibold tracking-widest uppercase ${isCapturing ? 'text-accent' : 'text-ok'}`}>
              {isCapturing ? 'Active' : 'Ready'}
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 py-3 space-y-3 overflow-y-auto scrollbar-hidden">
          {activeTool === 'screenshot' && (
            <div className="space-y-3 animate-fade-in">
              <ModeSelector
                mode={options.mode}
                onChange={m => set('mode', m as ScreenshotMode)}
                disabled={isCapturing}
              />

              {showPresets && (
                <div className="animate-slide-up">
                  <PresetSelector
                    presets={{ mobile: mobilePresets, tablet: tabletPresets }}
                    selectedPreset={options.devicePreset?.id || null}
                    orientation={options.orientation}
                    customWidth={options.customWidth}
                    customHeight={options.customHeight}
                    customDpr={options.customDpr}
                    onPresetChange={setPreset}
                    onOrientationChange={o => set('orientation', o as Orientation)}
                    onCustomSizeChange={(w, h, d) => setOptions(p => ({ ...p, customWidth: w, customHeight: h, customDpr: d, devicePreset: undefined }))}
                    disabled={isCapturing}
                  />
                </div>
              )}

              <ExportOptions
                format={options.format}
                quality={options.quality}
                onFormatChange={f => set('format', f as ExportFormat)}
                onQualityChange={q => set('quality', q)}
                disabled={isCapturing}
              />

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-err/8 border border-err/20 text-xs text-err animate-fade-in">
                  <svg className="shrink-0 mt-px" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <CaptureButton
                onClick={handleCapture}
                isCapturing={isCapturing}
                mode={options.mode}
              />
            </div>
          )}

          {activeTool === 'fonts' && (
            <div className="animate-fade-in">
              <FontDetector />
            </div>
          )}

          {activeTool === 'colors' && (
            <div className="animate-fade-in">
              <ColorPicker />
            </div>
          )}

          {activeTool === 'images' && (
            <div className="animate-fade-in">
              <ImagesTab />
            </div>
          )}

          {activeTool === 'meta' && (
            <div className="animate-fade-in">
              <MetaInspector />
            </div>
          )}

          {activeTool === 'website' && (
            <div className="animate-fade-in">
              <WebsiteTab />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-4 py-2.5 border-t border-border-subtle flex items-center justify-between">
          <p className="text-[9px] font-mono font-semibold text-text-muted uppercase tracking-widest">v2.0 · DevTools</p>
          <span className="text-[9px] font-mono font-semibold text-text-tertiary uppercase tracking-widest">
            By <span className="text-accent">Mosabbir Maruf</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
