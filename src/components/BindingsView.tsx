import type { Binding } from '../types/report';

export function BindingsView({ bindings }: { bindings: Binding[] }) {
  if (bindings.length === 0) return null;
  return (
    <div className="bindings">
      {bindings.map((b, i) => (
        <div key={i} className="binding">
          <div className="binding-row">
            {b.items.map((it, j) => (
              <span key={j} className="binding-chip-wrap">
                <span className="binding-chip">{it}</span>
                {j < b.items.length - 1 && <span className="binding-link">↔</span>}
              </span>
            ))}
          </div>
          <p className="binding-explain">{b.explanation}</p>
        </div>
      ))}
      <p className="binding-footnote">这些绑定未必天然成立，它们需要被看见，也可以被松动。</p>
    </div>
  );
}
