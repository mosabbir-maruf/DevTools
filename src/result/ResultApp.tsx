import { useState, useEffect } from 'react';
import { CaptureResult } from '../types';
import Preview from '../components/Preview';

export default function ResultApp() {
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    chrome.runtime.sendMessage({ type: 'GET_LATEST_CAPTURE' }, (response) => {
      if (!mounted) return;
      setLoading(false);
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message || 'Failed to communicate with background script.');
        return;
      }
      if (response && response.result) {
        setResult(response.result);
      } else {
        setError('No capture result found.');
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Loading capture...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#2a0a0a', border: '1px solid #5a1a1a', padding: '16px 24px', borderRadius: '8px', maxWidth: '400px' }}>
          <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0, fontFamily: 'sans-serif' }}>{error}</p>
        </div>
      </div>
    );
  }

  return result ? <Preview result={result} onClear={() => window.close()} /> : null;
}
