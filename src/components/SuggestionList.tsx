import type { Suggestion, RawMatch } from '../engine/types';
import { PATTERN_NAMES, PATTERN_COLORS } from '../engine/types';

interface Props {
  suggestions: Suggestion[];
  matches: RawMatch[];
}

export function SuggestionList({ suggestions, matches }: Props) {
  if (suggestions.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-medium text-stone-700 mb-2">💡 改写建议</h2>
        <p className="text-sm text-stone-400">没有找到明显的模式，或暂无改写建议。</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-sm font-medium text-stone-700 mb-2">💡 改写建议</h2>
      <ul className="space-y-3">
        {suggestions.map((s, i) => {
          const m = matches[s.matchIndex];
          const color = m ? PATTERN_COLORS[m.patternId] : '';
          const name = m ? PATTERN_NAMES[m.patternId] : '';
          return (
            <li key={i} className="text-sm border border-stone-200 rounded p-2">
              {m && (
                <div className={`inline-block text-xs px-1.5 py-0.5 rounded ${color} mb-1`}>{name}</div>
              )}
              <div className="text-stone-500">原句：{s.original}</div>
              <div className="text-stone-800 mt-1">改写：{s.rewrite}</div>
              <div className="text-xs text-stone-400 mt-1">{s.rationale}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
