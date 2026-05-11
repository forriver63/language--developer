interface Props {
  size?: number;
  className?: string;
  char?: string;
}

export function Seal({ size = 56, className = '', char = '顯' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      <defs>
        <filter id="seal-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 1
                                 0 0 0 0 1
                                 0 0 0 0 1
                                 0 0 0 0.45 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="3" fill="#a23a2a" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="58"
        fontFamily='"Songti SC","STSong","SimSun",serif'
        fill="#f4efe6"
        fontWeight="700"
      >
        {char}
      </text>
      <rect x="6" y="6" width="88" height="88" rx="3" fill="transparent" stroke="#7a2418" strokeWidth="2" />
      <rect x="6" y="6" width="88" height="88" rx="3" fill="#f4efe6" filter="url(#seal-grain)" opacity="0.6" />
    </svg>
  );
}
