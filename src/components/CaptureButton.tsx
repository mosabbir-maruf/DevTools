import { ScreenshotMode } from '../types';

interface CaptureButtonProps {
  onClick: () => void;
  isCapturing: boolean;
  mode: ScreenshotMode;
}

const labels: Record<ScreenshotMode, { idle: string; busy: string }> = {
  visible:  { idle: 'Capture Visible Area', busy: 'Capturing…' },
  fullpage: { idle: 'Capture Full Page',    busy: 'Stitching…' },
  selected: { idle: 'Select Region',        busy: 'Selecting…' },
};

export default function CaptureButton({ onClick, isCapturing, mode }: CaptureButtonProps) {
  const { idle, busy } = labels[mode];

  return (
    <div className="pt-2">
      <button
        onClick={onClick}
        disabled={isCapturing}
        className={`w-full h-12 rounded-xl text-[13px] font-bold tracking-wide flex items-center justify-center gap-3
          transition-all duration-300 relative group overflow-hidden
          ${isCapturing
            ? 'bg-[#111] border border-[#222] text-text-tertiary cursor-not-allowed'
            : 'bg-accent text-[#0a0a0a] border-transparent hover:bg-white active:scale-95 shadow-[0_0_15px_rgba(215,207,190,0.2)] hover:shadow-[0_0_25px_rgba(215,207,190,0.4)] cursor-pointer'
          }
        `}
      >
        {!isCapturing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
        
        {isCapturing ? (
          <>
            <svg className="animate-spin-slow shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="2.5"/>
              <path d="M12 3a9 9 0 0 1 9 9" stroke="#666" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="uppercase">{busy}</span>
          </>
        ) : (
          <>
            <span className="uppercase relative z-10">{idle}</span>
            <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
