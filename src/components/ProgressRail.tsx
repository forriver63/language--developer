interface Props {
  active: number;
  onJump: (n: number) => void;
}

const STEPS = [
  { n: 1, label: '总览显影' },
  { n: 2, label: '层级链条' },
  { n: 3, label: '关键跳跃' },
  { n: 4, label: '绑定关系' },
  { n: 5, label: '分层重构' },
];

const CHIN = ['一', '二', '三', '四', '五'];

export function ProgressRail({ active, onJump }: Props) {
  return (
    <aside className="rail" aria-hidden={false}>
      <div className="rail-inner">
        <div className="rail-line" />
        {STEPS.map((s, i) => {
          const isActive = active === s.n;
          const past = active > s.n;
          return (
            <button
              key={s.n}
              className={`rail-step ${isActive ? 'is-active' : ''} ${past ? 'is-past' : ''}`}
              onClick={() => onJump(s.n)}
            >
              <span className="rail-num">{CHIN[i]}</span>
              <span className="rail-label">{s.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
