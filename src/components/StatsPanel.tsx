import type { PatternId } from '../engine/types';
import { PATTERN_COLORS, PATTERN_NAMES } from '../engine/types';

interface Props {
  stats: Record<PatternId, number>;
  enabled: Record<PatternId, boolean>;
  onToggle: (id: PatternId) => void;
}

const IDS: PatternId[] = ['binary', 'imperative', 'judgmental', 'absolutizing', 'identity', 'attachment'];

export function StatsPanel({ stats, enabled, onToggle }: Props) {
  const total = IDS.reduce((s, id) => s + stats[id], 0);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-medium text-stone-700">📊 模式统计</h2>
        <span className="text-xs text-stone-400">共 {total} 处</span>
      </div>
      <ul className="space-y-1">
        {IDS.map((id) => {
          const on = enabled[id];
          const count = stats[id];
          return (
            <li key={id}>
              <button
                onClick={() => onToggle(id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded border text-sm transition ${
                  on ? PATTERN_COLORS[id] : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${on ? 'bg-current opacity-70' : 'bg-stone-300'}`} />
                  {PATTERN_NAMES[id]}
                </span>
                <span className="tabular-nums">×{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-stone-400 mt-3">点击关闭某类高亮。这只是显影，不是评分。</p>
    </div>
  );
}
