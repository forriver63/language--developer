import type { RawMatch, PatternId } from '../engine/types';
import { PATTERN_COLORS, PATTERN_NAMES } from '../engine/types';

interface Props {
  text: string;
  matches: RawMatch[];
  enabled: Record<PatternId, boolean>;
}

interface Segment {
  start: number;
  end: number;
  matches: RawMatch[];
}

function buildSegments(text: string, matches: RawMatch[]): Segment[] {
  if (matches.length === 0) return [{ start: 0, end: text.length, matches: [] }];
  const points = new Set<number>([0, text.length]);
  for (const m of matches) {
    points.add(m.start);
    points.add(m.end);
  }
  const sorted = [...points].sort((a, b) => a - b);
  const segs: Segment[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const s = sorted[i];
    const e = sorted[i + 1];
    if (s === e) continue;
    const hit = matches.filter((m) => m.start < e && m.end > s);
    segs.push({ start: s, end: e, matches: hit });
  }
  return segs;
}

export function Highlighter({ text, matches, enabled }: Props) {
  const active = matches.filter((m) => enabled[m.patternId]);
  const segments = buildSegments(text, active);

  return (
    <div className="whitespace-pre-wrap leading-loose text-base text-stone-800">
      {segments.map((seg, i) => {
        const slice = text.slice(seg.start, seg.end);
        if (seg.matches.length === 0) {
          return <span key={i}>{slice}</span>;
        }
        const first = seg.matches[0];
        const color = PATTERN_COLORS[first.patternId];
        const tooltip = seg.matches
          .map((m) => `${PATTERN_NAMES[m.patternId]}：${m.reason}`)
          .join('\n');
        return (
          <span
            key={i}
            title={tooltip}
            className={`rounded px-0.5 border-b-2 ${color} cursor-help`}
          >
            {slice}
          </span>
        );
      })}
    </div>
  );
}
