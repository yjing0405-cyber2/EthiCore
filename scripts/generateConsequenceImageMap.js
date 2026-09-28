const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'src', 'assets', 'ConsequenceImage');
const outPath = path.join(process.cwd(), 'src', 'utils', 'consequenceImageMap.ts');

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (/\.png$/i.test(name)) {
      results.push(full);
    }
  }
  return results;
}

const images = walk(root);
const entries = [];
for (const img of images) {
  const rel = path.relative(root, img).replace(/\\/g, '/');
  const parts = rel.split('/');
  if (parts.length !== 4) continue;
  const [chapterDir, scenarioNumDir, category, fileName] = parts;
  if (!chapterDir.startsWith('Chapter_')) continue;

  const chapter = chapterDir.replace('Chapter_', '');
  const scenarioNumber = parseInt(scenarioNumDir, 10);
  if (!scenarioNumber || !['Ethical', 'Mixed', 'Unethical'].includes(category)) continue;

  const stageMap = { i: 'Immediate', r: 'Ripple', l: 'Long-Term' };
  const match = fileName.match(/^([irl])/i);
  if (!match) continue;

  const stage = stageMap[match[1].toLowerCase()];
  const verdict = category;
  const key = `${chapter}_${scenarioNumber}_${stage}_${verdict}`;
  const relPath = `../assets/ConsequenceImage/${chapterDir}/${scenarioNumDir}/${category}/${fileName}`;
  entries.push({ key, relPath });
}

entries.sort((a, b) => a.key.localeCompare(b.key));
const lines = [
  '// Generated file - do not edit by hand. This file maps chapter/scenario/stage/verdict to image asset imports.',
  "import { ImageRequireSource } from 'react-native';",
  '',
  'export type ConsequenceStage = "Immediate" | "Ripple" | "Long-Term";',
  'export type VerdictCategory = "Ethical" | "Mixed" | "Unethical";',
  'export type ConsequenceImageKey = `${number}_${number}_${ConsequenceStage}_${VerdictCategory}`;',
  '',
  'export const consequenceImageMap: Record<ConsequenceImageKey, ImageRequireSource> = {',
];

for (const entry of entries) {
  lines.push(`  '${entry.key}': require('${entry.relPath}'),`);
}

lines.push('};', '',
  'export const getConsequenceImageSource = (chapter?: number, scenarioNumber?: number, stage?: ConsequenceStage, verdict?: VerdictCategory) => {',
  '  if (!chapter || !scenarioNumber || !stage || !verdict) return undefined;',
  '  const key = `${chapter}_${scenarioNumber}_${stage}_${verdict}` as ConsequenceImageKey;',
  '  return consequenceImageMap[key];',
  '};',
  ''
);

fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Wrote ${outPath} with ${entries.length} entries.`);
