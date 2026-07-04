import { ScreenshotMode } from '../types';

interface ModeSelectorProps {
  mode: ScreenshotMode;
  onChange: (mode: ScreenshotMode) => void;
  disabled?: boolean;
}

const modes: { id: ScreenshotMode; label: string; icon: JSX.Element }[] = [
  {
    id: 'fullpage',
    label: 'Full Page',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M3 15h18"/>
      </svg>
    ),
  },
  {
    id: 'visible',
    label: 'Visible',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <rect x="8" y="8" width="8" height="8" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'selected',
    label: 'Region',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
        <path d="M12 10v4M10 12h4" strokeWidth="2"/>
      </svg>
    ),
  },
];

export default function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-1.5">
        Capture Mode
      </p>
      <div className="flex p-1.5 bg-bg-secondary border border-border-subtle rounded-full shadow-inner relative">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[11px] font-semibold transition-all duration-300 relative z-10 ${
              mode === m.id
                ? 'text-[#0a0a0a] shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-base/50 scale-95 hover:scale-100'
            } disabled:opacity-35 disabled:cursor-not-allowed`}
          >
            {mode === m.id && (
              <span className="absolute inset-0 bg-accent rounded-full -z-10 animate-fade-in shadow-[0_0_15px_rgba(215,207,190,0.3)]" />
            )}
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
