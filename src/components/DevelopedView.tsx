interface Props {
  text: string;
  streaming: boolean;
}

interface Line {
  kind: 'observation' | 'rewrite' | 'blank';
  text: string;
}

function parse(raw: string): Line[] {
  return raw.split('\n').map((line) => {
    if (line.trim() === '') return { kind: 'blank', text: '' };
    if (/^\s*[·•・]\s*/.test(line)) {
      return { kind: 'observation', text: line.replace(/^\s*[·•・]\s*/, '') };
    }
    return { kind: 'rewrite', text: line };
  });
}

export function DevelopedView({ text, streaming }: Props) {
  const lines = parse(text);
  const hasObservation = lines.some((l) => l.kind === 'observation');
  const observations = lines.filter((l) => l.kind === 'observation');
  const rewriteLines = [...lines];
  // drop leading observation+blank block from rewriteLines
  if (hasObservation) {
    while (rewriteLines.length && rewriteLines[0].kind !== 'rewrite') {
      rewriteLines.shift();
    }
  }
  const rewrite = rewriteLines.map((l) => l.text).join('\n').replace(/^\n+/, '');

  return (
    <div>
      {observations.length > 0 && (
        <ul className="mb-8 space-y-2">
          {observations.map((l, i) => (
            <li key={i} className="text-[14px] leading-[1.9] ink-soft flex gap-3 fade-line">
              <span className="vermilion select-none">·</span>
              <span>{l.text}</span>
            </li>
          ))}
        </ul>
      )}

      {observations.length > 0 && rewrite && (
        <hr className="border-line mb-6 w-12" />
      )}

      <div
        className={`text-[17px] leading-[2.1] ink whitespace-pre-wrap ${
          streaming && rewrite ? 'caret' : ''
        }`}
      >
        {rewrite}
      </div>
    </div>
  );
}
