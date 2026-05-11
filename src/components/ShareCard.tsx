import { forwardRef } from 'react';
import type { DevelopReport, Rewrite } from '../types/report';

interface Props {
  text: string;
  report: DevelopReport;
  preferredLevel: string;
}

function pickRewrite(rewrites: Rewrite[], preferred: string): Rewrite | undefined {
  return (
    rewrites.find((r) => r.level === preferred) ||
    rewrites.find((r) => r.level === '深度重构') ||
    rewrites.find((r) => r.level === '中度重构') ||
    rewrites[0]
  );
}

export const ShareCard = forwardRef<HTMLDivElement, Props>(({ text, report, preferredLevel }, ref) => {
  const chain = report.layeredChain;
  const rewrite = pickRewrite(report.rewrites, preferredLevel);

  return (
    <div ref={ref} className="card">
      <div className="card-grain" />
      <header className="card-head">
        <div className="card-brand">语 言 显 影 器</div>
        <div className="card-seal">顯</div>
      </header>
      <div className="card-divider" />

      <section className="card-block">
        <div className="card-label">原 文</div>
        <p className="card-body">{text}</p>
      </section>

      {report.overview.corePattern && (
        <section className="card-block">
          <div className="card-label">总 览 显 影</div>
          <p className="card-body card-body-em">{report.overview.corePattern}</p>
        </section>
      )}

      {chain.length > 0 && (
        <section className="card-block card-block-chain">
          <div className="card-label">语 言 链 条</div>
          <div className="card-chain">
            {chain.map((n, i) => (
              <div key={i} className="card-chain-row">
                <div className="card-chain-layer">{n.layer}</div>
                <div className="card-chain-node">{n.text}</div>
                {i < chain.length - 1 && <div className="card-chain-arrow">↓</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {rewrite && (
        <section className="card-block card-block-rewrite">
          <div className="card-label">{rewrite.level}</div>
          <p className="card-rewrite">{rewrite.text}</p>
        </section>
      )}

      <footer className="card-foot">
        <span className="card-foot-line">语言显影器　·　帮你看见语言结构</span>
        <span className="card-foot-url">language-developer.vercel.app</span>
      </footer>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
