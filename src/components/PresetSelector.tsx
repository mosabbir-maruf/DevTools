import { useState } from 'react';
import { DevicePreset, Orientation } from '../types';

interface PresetSelectorProps {
  presets: { mobile: DevicePreset[]; tablet: DevicePreset[] };
  selectedPreset: string | null;
  orientation: Orientation;
  customWidth?: number;
  customHeight?: number;
  customDpr?: number;
  onPresetChange: (presetId: string | null) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onCustomSizeChange: (width: number, height: number, dpr: number) => void;
  disabled?: boolean;
}

type TabType = 'mobile' | 'tablet' | 'custom';

const tabs: { id: TabType; label: string }[] = [
  { id: 'mobile',  label: 'Mobile'  },
  { id: 'tablet',  label: 'Tablet'  },
  { id: 'custom',  label: 'Custom'  },
];

export default function PresetSelector({
  presets, selectedPreset, orientation, customWidth, customHeight, customDpr,
  onPresetChange, onOrientationChange, onCustomSizeChange, disabled,
}: PresetSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('mobile');
  const [width, setWidth]   = useState(customWidth  || 1920);
  const [height, setHeight] = useState(customHeight || 1080);
  const [dpr, setDpr]       = useState(customDpr    || 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentPresets = activeTab !== 'custom' ? presets[activeTab] : [];
  const getSize = (p: DevicePreset) => {
    return orientation === 'landscape' ? `${p.height}×${p.width}` : `${p.width}×${p.height}`;
  };

  const inputClass = `w-full px-3 py-2 bg-[#0a0a0a] border border-[#222] rounded-xl
    text-xs text-text-primary placeholder-text-muted
    focus:outline-none focus:border-accent/50 focus:shadow-[0_0_10px_rgba(215,207,190,0.1)]
    disabled:opacity-35 transition-all duration-300`;

  const hasPresetSelected = !!(selectedPreset || customWidth || customHeight);

  return (
    <div className="bg-[#111] border border-[#222] rounded-[24px] p-4 shadow-panel group hover:border-border-default transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">
          Device Preset
        </p>
        {hasPresetSelected && (
          <button
            onClick={() => onPresetChange(null)}
            disabled={disabled}
            className="text-[10px] font-semibold text-accent hover:text-white transition-colors cursor-pointer border-none bg-transparent p-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-bg-base border border-[#222] rounded-full mb-4 shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={disabled}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full ${
              activeTab === tab.id
                ? 'bg-bg-tertiary text-text-primary shadow-sm scale-100'
                : 'text-text-tertiary hover:text-text-secondary scale-95'
            } disabled:opacity-35`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'custom' ? (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-text-secondary font-medium mb-1.5 ml-1">Width (px)</label>
              <input type="number" value={width}  onChange={e => setWidth(parseInt(e.target.value)  || 0)} disabled={disabled} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] text-text-secondary font-medium mb-1.5 ml-1">Height (px)</label>
              <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} disabled={disabled} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-text-secondary font-medium mb-1.5 ml-1">Device Pixel Ratio</label>
            <input type="number" step="0.5" min="0.5" max="4" value={dpr} onChange={e => setDpr(parseFloat(e.target.value) || 1)} disabled={disabled} className={inputClass} />
          </div>
          <button
            onClick={() => onCustomSizeChange(width, height, dpr)}
            disabled={disabled}
            className="w-full mt-2 h-9 rounded-xl text-xs font-semibold bg-bg-base border border-[#222] text-text-primary hover:text-accent hover:border-accent/30 active:scale-95 transition-all duration-300 disabled:opacity-35"
          >
            Apply Custom Size
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <div>
            <label className="block text-[10px] text-text-secondary font-medium mb-1.5 ml-1">Select Device</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
                disabled={disabled}
                className={`${inputClass} flex items-center justify-between cursor-pointer w-full text-left`}
              >
                <span>
                  {selectedPreset
                    ? `${currentPresets.find(p => p.id === selectedPreset)?.name} — ${getSize(currentPresets.find(p => p.id === selectedPreset)!)}`
                    : 'Viewport Default'}
                </span>
                <svg className={`w-3 h-3 text-text-tertiary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a0a0a] border border-[#222] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-slide-up">
                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                      <button
                        onClick={() => { onPresetChange(null); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${!selectedPreset ? 'bg-accent/10 text-accent font-semibold' : 'text-text-secondary hover:bg-[#111] hover:text-text-primary'}`}
                      >
                        Viewport Default
                        {!selectedPreset && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                      </button>
                      {currentPresets.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { onPresetChange(p.id); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${selectedPreset === p.id ? 'bg-accent/10 text-accent font-semibold' : 'text-text-secondary hover:bg-[#111] hover:text-text-primary'}`}
                        >
                          <span>{p.name} <span className="opacity-50 ml-1">— {getSize(p)}</span></span>
                          {selectedPreset === p.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-text-secondary font-medium mb-1.5 ml-1">Orientation</label>
            <div className="flex gap-2">
              {(['portrait', 'landscape'] as const).map(o => (
                <button
                  key={o}
                  onClick={() => onOrientationChange(o)}
                  disabled={disabled}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                    orientation === o
                      ? 'bg-accent/10 border-accent/30 text-accent'
                      : 'bg-[#0a0a0a] border-[#222] text-text-secondary hover:border-border-default'
                  } disabled:opacity-35`}
                >
                  {o === 'portrait' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                      <line x1="18" y1="12" x2="18.01" y2="12"/>
                    </svg>
                  )}
                  <span className="capitalize">{o}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
