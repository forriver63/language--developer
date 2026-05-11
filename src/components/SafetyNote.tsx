export function SafetyNote({ text }: { text: string }) {
  if (!text) return null;
  return (
    <aside className="safety">
      <div className="safety-mark">·</div>
      <p className="safety-text">{text}</p>
    </aside>
  );
}
