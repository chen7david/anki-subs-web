// NOTE: Avoid using the `subtitle` package in the browser due to Node stream polyfills.
// We provide lightweight SRT/VTT parsing and serialization below.
import type { SubtitleCue } from "../state/subtitles";

/**
 * Convert time in milliseconds to SRT timestamp string.
 */
export function msToSrtTimestamp(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  const pad = (n: number, z = 2) => String(n).padStart(z, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(
    milliseconds,
    3
  )}`;
}

/**
 * Convert SRT/VTT timestamp to milliseconds. Accepts 00:00:00,000 or 00:00:00.000 styles.
 */
export function timestampToMs(ts: string): number {
  const normalized = ts.replace(".", ",");
  const match = normalized.match(/(\d{2}):(\d{2}):(\d{2}),(\d{1,3})/);
  if (!match) return 0;
  const [, hh, mm, ss, mmm] = match;
  return (
    parseInt(hh, 10) * 3600000 +
    parseInt(mm, 10) * 60000 +
    parseInt(ss, 10) * 1000 +
    parseInt(mmm.padEnd(3, "0"), 10)
  );
}

/**
 * Parse subtitle file content using `subtitle` package into normalized cues.
 */
export function parseSubtitleContent(content: string): SubtitleCue[] {
  const isVtt = /^WEBVTT/m.test(content);
  const text = content.replace(/\r/g, "").trim();
  const blocks = text
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const cues: SubtitleCue[] = [];
  let idCounter = 1;

  for (const block of blocks) {
    if (isVtt && /^WEBVTT/.test(block)) continue;

    const lines = block.split(/\n/);
    let i = 0;
    if (/^\d+$/.test(lines[0])) i = 1; // SRT index line

    const timeLine = lines[i] ?? "";
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{1,3})/
    );
    if (!timeMatch) continue;
    const startMs = timestampToMs(timeMatch[1]);
    const endMs = timestampToMs(timeMatch[2]);

    const textLines = lines.slice(i + 1);
    const cueText = textLines.join("\n").trim();
    cues.push({ id: idCounter++, startMs, endMs, text: cueText });
  }
  return cues;
}

/**
 * Serialize normalized cues back into SRT text using `subtitle` package.
 */
export function serializeCuesToSrt(cues: SubtitleCue[]): string {
  return cues
    .map((c, idx) => {
      const index = idx + 1;
      const start = msToSrtTimestamp(c.startMs);
      const end = msToSrtTimestamp(c.endMs);
      return `${index}\n${start} --> ${end}\n${c.text}`;
    })
    .join("\n\n");
}
