import type { LayerNode } from '../types/report';
import { LAYER_COLOR } from '../types/report';

export function LayeredChainView({ chain }: { chain: LayerNode[] }) {
  if (chain.length === 0) return null;
  return (
    <div className="layered-chain">
      {chain.map((n, i) => {
        const cls = LAYER_COLOR[n.layer] ?? 'event';
        return (
          <div key={i} className="layer-wrap">
            <div className={`layer layer-${cls}`}>
              <div className="layer-head">
                <span className="layer-name">{n.layer}</span>
                {n.note && <span className="layer-note">{n.note}</span>}
              </div>
              <p className="layer-text">{n.text}</p>
            </div>
            {i < chain.length - 1 && (
              <div className="layer-arrow">
                <span className="layer-arrow-line" />
                <span className="layer-arrow-head">↓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
