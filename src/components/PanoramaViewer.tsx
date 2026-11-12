'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, MousePointer2, RotateCcw } from 'lucide-react';

interface PannellumViewer { destroy?: () => void; setYaw?: (yaw: number) => void; }
interface PannellumGlobal { viewer: (element: HTMLElement, options: Record<string, unknown>) => PannellumViewer; }

declare global { interface Window { pannellum?: PannellumGlobal } }

export function PanoramaViewer({ panoramaUrl }: { panoramaUrl?: string }) {
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
      <div className="preview-real-photo"/>
      <div className="placeholder-message"><MousePointer2 size={22}/><strong>{error ? 'Não foi possível carregar a mídia 360°' : 'Copacabana em fotografia real'}</strong><span>{error ? 'Confira a URL e as permissões CORS da imagem.' : 'Esta é uma fotografia panorâmica 2D. A exploração esférica 360° será ativada quando a mídia adequada estiver disponível.'}</span></div>
      <a className="preview-credit" href="https://commons.wikimedia.org/wiki/File:Vista_Playa_Copacabana_A742250-Pano20241122.jpg" target="_blank" rel="noreferrer">Foto: Rjcastillo · CC BY 4.0 · recorte</a>
      <div className="placeholder-tag">FOTOGRAFIA REAL · VISUALIZAÇÃO 2D · NÃO É 360°</div>
    </div>
  );
  return <div className="panorama-frame"><div ref={rootRef} className="panorama-view" aria-label="Visualizador panorâmico 360 graus"/>{error ? <div className="panorama-load-state">Não foi possível carregar o panorama. Verifique a URL e as permissões CORS.</div> : !ready ? <div className="panorama-load-state">Preparando exploração 360°…</div> : <div className="panorama-hint"><RotateCcw size={14}/> Arraste para olhar ao redor <Maximize2 size={14}/></div>}</div>;
}
