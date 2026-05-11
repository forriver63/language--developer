interface Props {
  onPick: (text: string) => void;
}

export const EXAMPLES = [
  '我必须成功，否则我就是失败的人。',
  '他不回我消息，就是不在乎我。',
  '我不相信这些东西，所以它们一定都是假的。',
  '我应该放下执着，但我就是做不到。',
];

export function ExamplesBar({ onPick }: Props) {
  return (
    <div className="examples">
      <span className="examples-label">试试这几句</span>
      <div className="examples-list">
        {EXAMPLES.map((t, i) => (
          <button key={i} className="example-btn" onClick={() => onPick(t)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
