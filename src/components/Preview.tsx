import { useState, useRef, useEffect } from 'react';
import { CaptureResult } from '../types';
import { generateFilename, downloadImage, downloadAsPdf } from '../utils/image';

interface PreviewProps {
  result: CaptureResult;
  onClear: () => void;
}

type ViewMode = 'fit' | 'page';

export default function Preview({ result, onClear }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('fit');
  const [zoom, setZoom] = useState(100);

  // Pan state for fit mode
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const didDrag = useRef(false); // distinguish click vs drag

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    didDrag.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
    setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(false);
    // Only switch mode if it was a click (not a drag)
    if (!didDrag.current) handleImageClick();
  };

  // Drag-to-scroll state for page mode
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [isPageDragging, setIsPageDragging] = useState(false);
  const pageDragStart = useRef({ mx: 0, my: 0, sl: 0, st: 0 });
  const pageDidDrag = useRef(false);

  const handlePageMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click
    if (e.button !== 0 || !pageContainerRef.current) return;
    e.preventDefault();
    setIsPageDragging(true);
    pageDidDrag.current = false;
    pageDragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      sl: pageContainerRef.current.scrollLeft,
      st: pageContainerRef.current.scrollTop
    };
  };

  const handlePageMouseMove = (e: React.MouseEvent) => {
    if (!isPageDragging || !pageContainerRef.current) return;
    const dx = e.clientX - pageDragStart.current.mx;
    const dy = e.clientY - pageDragStart.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      pageDidDrag.current = true;
    }
    pageContainerRef.current.scrollLeft = pageDragStart.current.sl - dx;
    pageContainerRef.current.scrollTop = pageDragStart.current.st - dy;
  };

  const handlePageMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPageDragging(false);
    if (!pageDidDrag.current) {
      handleImageClick();
    }
  };

  const handleDownloadImage = () => downloadImage(result.dataUrl, generateFilename('png'));
  const handleDownloadPdf = () => downloadAsPdf(result.dataUrl, generateFilename('pdf'), result.width, result.height);

  const [showSaveAsSubmenu, setShowSaveAsSubmenu] = useState(false);

  const convertAndDownloadImage = (format: 'png' | 'jpeg' | 'webp') => {
    if (format === 'png') {
      downloadImage(result.dataUrl, generateFilename('png'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const mimeType = `image/${format}`;
      const convertedDataUrl = canvas.toDataURL(mimeType, 0.92);
      downloadImage(convertedDataUrl, generateFilename(format));
    };
    img.onerror = () => {
      downloadImage(result.dataUrl, generateFilename('png'));
    };
    img.src = result.dataUrl;
  };


  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    if (!contextMenu.visible) {
      setShowSaveAsSubmenu(false);
    }
  }, [contextMenu.visible]);


  const copyImageToClipboard = async () => {
    try {
      const response = await fetch(result.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  };

  const copyOriginalUrl = () => {
    if (result.url) {
      navigator.clipboard.writeText(result.url).catch(console.error);
    }
  };

  const openOriginalUrl = () => {
    if (result.url) {
      window.open(result.url, '_blank');
    }
  };


  const zoomIn  = () => setZoom(z => Math.min(z + 25, 400));
  const zoomOut = () => setZoom(z => Math.max(z - 25, 25));
  const resetZoom = () => setZoom(100);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    chrome.runtime.sendMessage({ type: 'DELETE_CAPTURE' }, () => {
      window.close();
    });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleImageClick = () => {
    if (viewMode === 'fit') {
      setViewMode('page');
      setZoom(100);
      setPan({ x: 0, y: 0 });
    } else {
      setViewMode('fit');
      setPan({ x: 0, y: 0 });
    }
  };

  const switchToFit = () => {
    setViewMode('fit');
    setPan({ x: 0, y: 0 });
  };

  const isFit = viewMode === 'fit';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', fontFamily: 'system-ui, sans-serif' }}>

      {/* Fixed top toolbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '44px', background: '#111', borderBottom: '1px solid #2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', color: 'white', userSelect: 'none',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', minWidth: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: '13px', flexShrink: 0 }}>DevTools</span>
          {result.title && (
            <>
              <span style={{ color: '#444', flexShrink: 0 }}>—</span>
              {result.url ? (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    color: '#888',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.textDecoration = 'none'; }}
                  title="Click to open original webpage"
                >
                  {result.title}
                </a>
              ) : (
                <span style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.title}</span>
              )}
            </>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>

          {/* View mode toggle */}
          <div style={{ display: 'flex', background: '#1e1e1e', border: '1px solid #333', borderRadius: '6px', overflow: 'hidden', marginRight: '4px' }}>
            <ModeBtn active={isFit} onClick={switchToFit} title="Fit to screen">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
              Fit
            </ModeBtn>
            <ModeBtn active={!isFit} onClick={() => { setViewMode('page'); setZoom(100); }} title="Page view (scrollable)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
              Page
            </ModeBtn>
          </div>

          {/* Zoom controls — only visible in page mode */}
          {!isFit && <>
            <Btn onClick={zoomOut} title="Zoom Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </Btn>
            <button onClick={resetZoom} title="Reset zoom" style={{
              background: 'transparent', border: '1px solid #333', color: '#aaa',
              padding: '2px 8px', borderRadius: '4px', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, minWidth: '46px', textAlign: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa'; }}
            >{zoom}%</button>
            <Btn onClick={zoomIn} title="Zoom In">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </Btn>
            <Divider />
          </>}



          <Btn onClick={handleDownloadPdf} title="Download as PDF">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </Btn>
          <Btn onClick={handleDownloadImage} title="Download PNG">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PNG
          </Btn>

          <Divider />

          <Btn onClick={handleDeleteClick} title="Delete screenshot from memory" danger>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </Btn>

          <Divider />

          <Btn onClick={onClear} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </Btn>
        </div>
      </div>

      {/* Content */}
      <div
        onContextMenu={handleContextMenu}
        style={{ marginTop: '44px', flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        {isFit ? (
          /* ── FIT MODE: image contained, centered, click to switch ── */
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            style={{
              width: '100%', height: '100%',
              background: '#1a1a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: isDragging ? 'grabbing' : 'grab',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            <img
              src={result.dataUrl}
              alt="Screenshot"
              style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain', display: 'block',
                transform: `translate(${pan.x}px, ${pan.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease',
                userSelect: 'none', pointerEvents: 'none',
              }}
              draggable={false}
            />
            {/* Hint */}
            {!isDragging && (
              <div style={{
                position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.6)', color: '#aaa', fontSize: '11px',
                padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap', pointerEvents: 'none',
                backdropFilter: 'blur(4px)',
              }}>
                Hold &amp; drag to pan · Click for page view
              </div>
            )}
          </div>
        ) : (
          /* ── PAGE MODE: full width, scrollable ── */
          <div
            ref={pageContainerRef}
            onMouseDown={handlePageMouseDown}
            onMouseMove={handlePageMouseMove}
            onMouseUp={handlePageMouseUp}
            onMouseLeave={() => setIsPageDragging(false)}
            style={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              overflowX: 'auto',
              background: '#1a1a1a',
              position: 'relative',
              cursor: isPageDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            title="Drag to scroll · Click to fit screen"
          >
            <img
              src={result.dataUrl}
              alt="Screenshot"
              style={{
                display: 'block',
                width: `${zoom}%`,
                height: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0, height: '30px', background: '#111', borderTop: '1px solid #222',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', userSelect: 'none',
      }}>
        <span style={{ fontSize: '11px', color: '#444' }}>Made by</span>
        <a href="https://github.com/mosabbir-maruf" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >Mosabbir Maruf</a>
      </div>

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '360px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#3f1616',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#f4f4f5', fontSize: '16px', fontWeight: 600 }}>Delete Screenshot</h3>
              <p style={{ margin: 0, color: '#a1a1aa', fontSize: '13px', lineHeight: '1.5' }}>
                Delete this screenshot? It will be permanently removed from memory.
              </p>
            </div>
            <div style={{ display: 'flex', width: '100%', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={cancelDelete}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #27272a',
                  borderRadius: '6px',
                  color: '#e4e4e7',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e4e4e7'; }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {contextMenu.visible && (
        <div style={{
          position: 'fixed',
          left: `${Math.min(contextMenu.x, window.innerWidth - 200)}px`,
          top: `${Math.min(contextMenu.y, window.innerHeight - 220)}px`,
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '8px',
          padding: '4px',
          zIndex: 9999,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
          minWidth: '190px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {/* Save Image as Submenu */}
          <div
            onMouseEnter={() => setShowSaveAsSubmenu(true)}
            onMouseLeave={() => setShowSaveAsSubmenu(false)}
            style={{ position: 'relative' }}
          >
            <ContextBtn onClick={() => {}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Save image as...
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </ContextBtn>
            {showSaveAsSubmenu && (
              <div style={{
                position: 'absolute',
                left: '100%',
                top: 0,
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                minWidth: '90px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 10000,
              }}>
                <ContextBtn onClick={() => convertAndDownloadImage('png')}>PNG</ContextBtn>
                <ContextBtn onClick={() => convertAndDownloadImage('jpeg')}>JPEG</ContextBtn>
                <ContextBtn onClick={() => convertAndDownloadImage('webp')}>WebP</ContextBtn>
              </div>
            )}
          </div>
          <ContextBtn onClick={handleDownloadPdf}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Save as PDF as
          </ContextBtn>
          <ContextBtn onClick={copyImageToClipboard}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy image
          </ContextBtn>
          {result.url && (
            <>
              <div style={{ height: '1px', background: '#27272a', margin: '4px 4px' }} />
              <ContextBtn onClick={copyOriginalUrl}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Copy original site URL
              </ContextBtn>
              <ContextBtn onClick={openOriginalUrl}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Open original site URL
              </ContextBtn>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', color: '#ccc',
  padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
  fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',
  display: 'flex', alignItems: 'center', gap: '5px',
};

function Divider() {
  return <div style={{ width: '1px', height: '20px', background: '#2a2a2a', margin: '0 4px' }} />;
}

function Btn({ onClick, title, children, danger }: {
  onClick: () => void; title?: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button onClick={onClick} title={title}
      style={{ ...btnStyle, color: danger ? '#e05252' : '#ccc' }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? '#3a1a1a' : '#2a2a2a'; e.currentTarget.style.color = danger ? '#ff6b6b' : 'white'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = danger ? '#e05252' : '#ccc'; }}
    >
      {children}
    </button>
  );
}

function ModeBtn({ active, onClick, title, children }: {
  active: boolean; onClick: () => void; title?: string; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} title={title} style={{
      background: active ? '#2a2a2a' : 'transparent',
      border: 'none', color: active ? 'white' : '#666',
      padding: '4px 10px', cursor: 'pointer',
      fontSize: '12px', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: '5px',
      transition: 'background 0.15s, color 0.15s',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#ccc'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#666'; } }}
    >
      {children}
    </button>
  );
}

function ContextBtn({ onClick, children, style }: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#a1a1aa',
        padding: '6px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 500,
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background 0.15s, color 0.15s',
        width: '100%',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
    >
      {children}
    </button>
  );
}

