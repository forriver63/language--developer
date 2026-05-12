interface Props {
  text: string;
  depth?: number;
}

export function CoreInsight({ text, depth = 1 }: Props) {
  if (!text) return null;
  return (
    <figure className="core-insight">
      <blockquote className="core-insight-text">{text}</blockquote>
      <figcaption className="core-insight-caption">
        {depth > 1 ? '再 下 一 层' : '浮 现 的 一 层'}
      </figcaption>
    </figure>
  );
}
