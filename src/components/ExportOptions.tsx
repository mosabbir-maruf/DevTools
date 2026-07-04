import { ExportFormat } from '../types';

interface ExportOptionsProps {
  format: ExportFormat;
  quality: number;
  onFormatChange: (format: ExportFormat) => void;
  onQualityChange: (quality: number) => void;
  disabled?: boolean;
}

const formats: { id: ExportFormat; label: string; hint: string }[] = [
  { id: 'png',  label: 'PNG',  hint: 'Lossless' },
  { id: 'jpeg', label: 'JPEG', hint: 'Smaller'  },
  { id: 'webp', label: 'WebP', hint: 'Best'     },
  { id: 'pdf',  label: 'PDF',  hint: 'Document' },
];

// Formats that support quality adjustment
const hasQuality = (f: ExportFormat) => f === 'jpeg' || f === 'webp';

export default function ExportOptions({
  format, quality, onFormatChange, onQualityChange, disabled,
}: ExportOptionsProps) {
  const fillPct = ((quality - 10) / 90) * 100;

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-3 shadow-panel group hover:border-border-default transition-colors">
      <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
        Export Format
      </p>

      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {formats.map(f => (
          <button
            key={f.id}
            onClick={() => onFormatChange(f.id)}
            disabled={disabled}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 border ${
              format === f.id
                ? 'bg-accent/10 border-accent/40 text-accent'
                : 'bg-[#0a0a0a] border-[#222] text-text-tertiary hover:text-text-secondary hover:border-border-default'
            } disabled:opacity-35`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {hasQuality(format) && (
        <div className="animate-fade-in flex items-center gap-2 px-2.5 py-1.5 bg-[#0a0a0a] border border-[#222] rounded-lg">
          <span className="text-[9px] font-medium text-text-secondary shrink-0">Quality</span>
          <input
            type="range"
            min="10" max="100"
            value={quality}
            onChange={e => onQualityChange(parseInt(e.target.value))}
            disabled={disabled}
            className="flex-1 h-1 rounded-full appearance-none outline-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #D7CFBE 0%, #D7CFBE ${fillPct}%, #222 ${fillPct}%, #222 100%)`
            }}
          />
          <span className="text-[9px] font-bold text-accent tabular-nums shrink-0 w-8 text-right">{quality}%</span>
        </div>
      )}
    </div>
  );
}
