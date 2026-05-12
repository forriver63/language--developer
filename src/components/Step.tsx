import type { ReactNode } from 'react';

const CHIN = ['一', '二', '三', '四', '五'];

interface Props {
  id: string;
  index: number; // 1..5
  title: string;
  doing: string;
  stagger?: number; // 0..N, used for entrance delay
  children: ReactNode;
}

export function Step({ id, index, title, doing, stagger = 0, children }: Props) {
  return (
    <section
      id={id}
      className="step"
      style={{ animationDelay: `${stagger * 120}ms` }}
    >
      <header className="step-head">
        <span className="step-num">{CHIN[index - 1]}</span>
        <div>
          <h2 className="step-title">{title}</h2>
          <p className="step-doing">{doing}</p>
        </div>
      </header>
      <div className="step-body">{children}</div>
    </section>
  );
}
