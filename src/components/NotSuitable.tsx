interface Props {
  message: string;
  onBack: () => void;
}

export function NotSuitable({ message, onBack }: Props) {
  return (
    <div className="not-suitable">
      <div className="not-suitable-mark">·　·　·</div>
      <p className="not-suitable-text">{message}</p>
      <div className="not-suitable-actions">
        <button onClick={onBack} className="minor-btn">
          换 一 句　→
        </button>
      </div>
    </div>
  );
}
