import type { Rewrite } from '../types/report';
import { REWRITE_TAG } from '../types/report';

export function RewritesView({ rewrites }: { rewrites: Rewrite[] }) {
  if (rewrites.length === 0) return null;
  return (
    <ol className="rewrites">
      {rewrites.map((r, i) => {
        const tag = REWRITE_TAG[r.level] ?? '?';
        return (
          <li key={i} className="rewrite">
            <div className="rewrite-rail">
              <span className="rewrite-tag">{tag}</span>
              {i < rewrites.length - 1 && <span className="rewrite-line" />}
            </div>
            <div className="rewrite-body">
              <div className="rewrite-meta">
                <span className="rewrite-level">{r.level}</span>
                <span className="rewrite-purpose">{r.purpose}</span>
              </div>
              <p className="rewrite-text">{r.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
