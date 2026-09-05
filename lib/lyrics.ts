export type LyricLine = { time: number; text: string };

export function parseLrc(source: string): LyricLine[] {
  return source.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\](.*)$/);
    if (!match) return [];
    return [{ time: Number(match[1]) * 60 + Number(match[2]), text: match[3].trim() }];
  }).filter((line) => line.text).sort((a, b) => a.time - b.time);
}
