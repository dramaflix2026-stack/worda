// Generate each Copacabana chapter once, then serve the resulting MP3s as static assets.
// Run locally with OPENAI_API_KEY set in your environment:
//   node scripts/generate-copacabana-audio.mjs
// Never commit API keys. Audio generation incurs API usage charges.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('Set OPENAI_API_KEY before generating audio.'); process.exit(1); }
const source = await readFile('src/data/copacabana.ts', 'utf8');
const chapters = [...source.matchAll(/id: '([^']+)'[^\n]*?story: '([^']+)'/g)].map(([, id, story]) => ({ id, story }));
if (chapters.length !== 5) throw new Error('Expected exactly five Copacabana chapters.');
const output = join('public', 'audio', 'copacabana');
await mkdir(output, { recursive: true });
for (const chapter of chapters) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.WORLDA_TTS_MODEL || 'gpt-4o-mini-tts', voice: 'nova', input: chapter.story, response_format: 'mp3', instructions: 'Fale em português brasileiro com voz calorosa e natural de guia de viagem. Ritmo conversacional, pausas suaves e entusiasmo discreto.' }),
  });
  if (!response.ok) throw new Error(`Audio generation failed for ${chapter.id}: HTTP ${response.status} ${await response.text()}`);
  await writeFile(join(output, `${chapter.id}.mp3`), Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${chapter.id}.mp3`);
}
console.log('All chapter MP3 files are ready in public/audio/copacabana/.');
