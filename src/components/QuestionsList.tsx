import { useState } from 'react';

interface Props {
  items: string[];
  onFollow?: (questionIndex: number, answer: string) => Promise<void> | void;
  busy?: boolean;
}

const CONTINUE_PHRASES = [
  '顺着这条线继续往下',
  '再往下一层',
  '看看这层下面还有什么',
];

export function QuestionsList({ items, onFollow, busy }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');

  if (items.length === 0) return null;

  async function submit(i: number) {
    if (!answer.trim() || !onFollow) return;
    await onFollow(i, answer.trim());
    setOpenIdx(null);
    setAnswer('');
  }

  function open(i: number) {
    setOpenIdx(i);
    setAnswer('');
  }

  function cancel() {
    setOpenIdx(null);
    setAnswer('');
  }

  return (
    <ol className="questions">
      {items.map((q, i) => {
        const phrase = CONTINUE_PHRASES[i % CONTINUE_PHRASES.length];
        return (
          <li key={i} className="question">
            <div className="question-main">
              <span className="question-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="question-body">
                <span className="question-text">{q}</span>
                {onFollow && openIdx !== i && (
                  <button
                    className="question-follow-link"
                    onClick={() => open(i)}
                    disabled={busy}
                  >
                    → {phrase}
                  </button>
                )}
              </div>
            </div>
            {openIdx === i && (
              <div className="followup">
                <div className="followup-prompt">
                  顺着这一问，写下你看到的——
                  <span className="ink-faint">几个字也可以。</span>
                </div>
                <textarea
                  className="followup-input"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="……"
                  rows={3}
                  autoFocus
                  maxLength={1500}
                />
                <div className="followup-actions">
                  <button onClick={cancel} className="minor-btn" disabled={busy}>
                    取 消
                  </button>
                  <button
                    onClick={() => submit(i)}
                    disabled={!answer.trim() || busy}
                    className="brush-btn brush-btn-small"
                  >
                    {busy ? '正 在 展 开…' : '再 往 下 一 层'}
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
