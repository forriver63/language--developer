import type { ChainMemory } from '../types/report';

interface Props {
  chainMemory: ChainMemory;
}

const CHIN = ['一', '二', '三', '四', '五', '六', '七', '八'];

export function ChainBreadcrumb({ chainMemory }: Props) {
  if (!chainMemory || chainMemory.path.length === 0) return null;

  return (
    <div className="breadcrumb">
      <div className="breadcrumb-head">
        <span className="breadcrumb-label">已 走 过</span>
        <span className="breadcrumb-count">{chainMemory.path.length} 层</span>
      </div>

      <div className="breadcrumb-thread">
        <div className="breadcrumb-step is-origin">
          <span className="breadcrumb-marker">○</span>
          <div className="breadcrumb-content">
            <span className="breadcrumb-tier">起点</span>
            <p className="breadcrumb-text">{chainMemory.originalInput}</p>
          </div>
        </div>

        {chainMemory.path.map((step, i) => (
          <div key={i} className="breadcrumb-step">
            <span className="breadcrumb-marker">{CHIN[i]}</span>
            <div className="breadcrumb-content">
              <span className="breadcrumb-tier">第 {CHIN[i]} 层</span>
              <p className="breadcrumb-insight">{step.coreInsight}</p>
              {step.text && step.text !== chainMemory.originalInput && (
                <p className="breadcrumb-reply">↳ 我说：{step.text}</p>
              )}
            </div>
          </div>
        ))}

        {chainMemory.triggerQuestion && (
          <div className="breadcrumb-step is-trigger">
            <span className="breadcrumb-marker">？</span>
            <div className="breadcrumb-content">
              <span className="breadcrumb-tier">由此问触发</span>
              <p className="breadcrumb-question">{chainMemory.triggerQuestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
