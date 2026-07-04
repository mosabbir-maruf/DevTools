import { useCallback } from 'react';

export default function ImagesTab() {
  const openToolkit = useCallback(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('toolkit.html') });
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Introduction Card */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-subtle flex items-center justify-center text-accent mx-auto shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Local Image Toolkit
          </h3>
          <p className="text-[11px] text-text-secondary leading-normal max-w-[280px] mx-auto">
            Convert, compress, resize, crop, rotate, flip, and view/strip EXIF metadata from your images entirely locally.
          </p>
        </div>

        {/* Dashboard Launcher Button */}
        <button
          onClick={openToolkit}
          className="w-full py-2.5 rounded-xl bg-accent text-[#0a0a0a] text-xs font-bold uppercase tracking-wider hover:bg-white active:scale-95 transition-all shadow-[0_0_12px_rgba(215,207,190,0.2)] cursor-pointer"
        >
          Open Workspace
        </button>
      </div>

      {/* Feature Checkpoints */}
      <div className="bg-bg-secondary/40 border border-border-subtle rounded-xl p-3.5 space-y-2.5">
        <span className="block text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
          Features
        </span>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-secondary font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            <span>Format Converter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            <span>EXIF Metadata Stripper</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            <span>Batch Optimizer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            <span>Precision Cropper</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
