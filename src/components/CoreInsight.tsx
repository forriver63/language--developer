interface Props {
  text: string;
  depth?: number; // 1 = first, >1 = inside follow-up chain
}

export function CoreInsight({ text, depth = 1 }: Props) {
  if (!text) return null;
  return (
    <figure className="core-insight">
      <span className="core-insight-mark">○</span>
      <blockquote className="core-insight-text">{text}</blockquote>
      <figcaption className="core-insight-caption">
        {depth > 1 ? `第 ${depth} 层显影` : '核 心 显 影'}
      </figcaption>
    </figure>
  );
}
