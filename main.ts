// gta6-meme-x-01 entry — the post itself is the entry.
// This program (Node 22, standard library only) copies POST.json, which names
// the X post, from the repository root to /output/POST.json for the gate.
// The house reads the post from X and builds the judge's dossier itself;
// nothing written here about the post is judged.
//
// Local run (stands in for /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const raw = readFileSync(source, 'utf8');
// The gate caps POST.json at 16384 bytes and reads only X post addresses.
if (Buffer.byteLength(raw, 'utf8') > 16384) {
  console.error(`POST.json is over the gate's 16384-byte cap: ${source}`);
  process.exit(1);
}
const post = JSON.parse(raw) as { url?: unknown };
const xPost = /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/(status|statuses|i\/web\/status)\/\d+$/;
if (typeof post.url !== 'string' || !xPost.test(post.url)) {
  console.error(`POST.json does not name an X post address: ${source}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'POST.json'));
console.log(`POST.json copied to ${outputDir}`);
