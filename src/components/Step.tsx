import type { ReactNode } from 'react';

const CHIN = ['一', '二', '三', '四', '五'];

interface Props {
  id: string;
  index: number; // 1..5
  title: string;
  doing: string; // "这一层在做什么"
  children: ReactNode;
}

export function Step({ id, index, title, doing, children }: Props) {
  return (
    <section id={id} className="step">
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
