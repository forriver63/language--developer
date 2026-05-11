import { useState } from 'react';

interface Props {
  items: string[];
  onFollow?: (questionIndex: number, answer: string) => Promise<void> | void;
  busy?: boolean;
}

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
      {items.map((q, i) => (
        <li key={i} className="question">
          <div className="question-main">
            <span className="question-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="question-text">{q}</span>
            {onFollow && openIdx !== i && (
              <button
                className="question-follow"
                onClick={() => open(i)}
                disabled={busy}
                title="顺着这一问继续显影"
              >
                接 着 想　→
              </button>
            )}
          </div>
          {openIdx === i && (
            <div className="followup">
              <textarea
                className="followup-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="顺着这一问，写下你的想法——可以只是几个字。"
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
                  {busy ? '显　影　中' : '继　续　显　影'}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
