import { NextRequest, NextResponse } from 'next/server';
import { stops } from '@/data/copacabana';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Five fixed chapter narrations only. One synthesis per chapter per server process.
// In-memory cache is reset on redeploy; persistent object storage can replace it later.
const cache = new Map<string, Buffer>();
const pending = new Map<string, Promise<Buffer>>();
const MAX_CHAPTERS = 5;

async function synthesize(id: string, story: string): Promise<Buffer> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not configured');
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.WORLDA_TTS_MODEL || 'gpt-4o-mini-tts',
      voice: 'nova',
      input: story,
      response_format: 'mp3',
      instructions: 'Narre em português brasileiro, como um guia turístico experiente. Voz humana, acolhedora e expressiva, com pausas naturais e ritmo conversacional.'
    }),
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Speech API returned HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('chapter');
  const chapter = stops.find(stop => stop.id === id);
  if (!chapter || stops.length !== MAX_CHAPTERS) {
    return NextResponse.json({ error: 'Invalid chapter' }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Neural narration unavailable' }, { status: 503 });
  }
  try {
    let audio = cache.get(chapter.id);
    if (!audio) {
      let work = pending.get(chapter.id);
      if (!work) {
        work = synthesize(chapter.id, chapter.story);
        pending.set(chapter.id, work);
      }
      try {
        audio = await work;
        cache.set(chapter.id, audio);
      } finally {
        pending.delete(chapter.id);
      }
    }
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audio.length),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Unable to generate narration' }, { status: 502 });
  }
}
