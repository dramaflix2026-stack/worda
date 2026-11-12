'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, RotateCcw } from 'lucide-react';

interface PannellumViewer { destroy?: () => void; setYaw?: (yaw: number) => void; }
interface PannellumGlobal { viewer: (element: HTMLElement, options: Record<string, unknown>) => PannellumViewer; }

declare global { interface Window { pannellum?: PannellumGlobal } }

export function PanoramaViewer({ panoramaUrl, photoUrl, credit, creditUrl, onNext, onPrevious, canNext, canPrevious }: { panoramaUrl?: string; photoUrl?: string; credit?: string; creditUrl?: string; onNext?: () => void; onPrevious?: () => void; canNext?: boolean; canPrevious?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<PannellumViewer | null>(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!panoramaUrl || !rootRef.current) return;
    setError(false);
    setReady(false);
    let cancelled = false;
    const script = document.createElement('script');
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(css);
    const start = () => {
      if (cancelled || !rootRef.current || !window.pannellum) { setError(true); return; }
      try {
        instanceRef.current = window.pannellum.viewer(rootRef.current, {
          type: 'equirectangular', panorama: panoramaUrl, autoLoad: true,
          showZoomCtrl: true, showFullscreenCtrl: true, compass: false,
          hfov: 100, minHfov: 50, maxHfov: 120, mouseZoom: true,
        });
        setReady(true);
      } catch { setError(true); }
    };
    if (window.pannellum) start();
    else { script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'; script.onload = start; script.onerror = () => setError(true); document.body.appendChild(script); }
    return () => { cancelled = true; try { instanceRef.current?.destroy?.(); } catch {} instanceRef.current = null; script.remove(); css.remove(); };
  }, [panoramaUrl]);

  if (!panoramaUrl) return (
    <div className="panorama-placeholder" aria-label="Área preparada para panorama real em 360 graus">
      <div className="preview-real-photo" style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}/>
      <a className="preview-credit" href={creditUrl || "https://commons.wikimedia.org"} target="_blank" rel="noreferrer">Foto: {credit || "Wikimedia Commons"} · fonte e licença · recorte</a><div className="scene-waypoints"><button disabled={!canPrevious} onClick={onPrevious} aria-label="Cena anterior"><ArrowLeft size={17}/> Anterior</button><button disabled={!canNext} onClick={onNext} aria-label="Próxima cena">Próxima cena <ArrowRight size={17}/></button></div>
      <div className="placeholder-tag">CENA FOTOGRÁFICA · 2D</div>
    </div>
  );
  return <div className="panorama-frame"><div ref={rootRef} className="panorama-view" aria-label="Visualizador panorâmico 360 graus"/>{error ? <div className="panorama-load-state">Não foi possível carregar o panorama. Verifique a URL e as permissões CORS.</div> : !ready ? <div className="panorama-load-state">Preparando exploração 360°…</div> : <div className="panorama-hint"><RotateCcw size={14}/> Arraste para olhar ao redor <Maximize2 size={14}/></div>}</div>;
}
