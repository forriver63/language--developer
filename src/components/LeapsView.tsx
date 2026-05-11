import type { Leap } from '../types/report';

export function LeapsView({ leaps }: { leaps: Leap[] }) {
  if (leaps.length === 0) return null;
  return (
    <div className="leaps">
      {leaps.map((l, i) => (
        <div key={i} className="leap">
          <div className="leap-row">
            <span className="leap-chip">{l.from}</span>
            <span className="leap-arrow">→</span>
            <span className="leap-chip leap-chip-to">{l.to}</span>
          </div>
          <p className="leap-why">{l.whyItMatters}</p>
        </div>
      ))}
    </div>
  );
}
