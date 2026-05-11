export function QuestionsList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ol className="questions">
      {items.map((q, i) => (
        <li key={i} className="question">
          <span className="question-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="question-text">{q}</span>
        </li>
      ))}
    </ol>
  );
}
