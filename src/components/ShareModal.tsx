import { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { ShareCard } from './ShareCard';
import type { DevelopReport } from '../types/report';

interface Props {
  text: string;
  report: DevelopReport;
  onClose: () => void;
}

const LEVELS = ['深度重构', '中度重构', '行动型重构', '轻度重构'];

export function ShareModal({ text, report, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<string>('深度重构');

  const availableLevels = LEVELS.filter((l) =>
    report.rewrites.some((r) => r.level === l)
  );

  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    setGenerating(true);
    setError(null);
    setDataUrl(null);
    // wait one tick for layout
    const timer = setTimeout(() => {
      htmlToImage
        .toPng(card, { pixelRatio: 2, cacheBust: true, backgroundColor: '#f4efe6' })
        .then((url) => {
          setDataUrl(url);
          setGenerating(false);
        })
        .catch((e) => {
          setError(String((e as Error).message ?? e));
          setGenerating(false);
        });
    }, 80);
    return () => clearTimeout(timer);
  }, [text, report, level]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `语言显影器-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-card-stage" aria-hidden>
        <ShareCard ref={cardRef} text={text} report={report} preferredLevel={level} />
      </div>

      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="share-close" aria-label="关闭">
          ×
        </button>

        <div className="share-modal-head">
          <h3 className="share-modal-title">分 享 卡 片</h3>
          {availableLevels.length > 1 && (
            <div className="share-level-picker">
              <span className="share-level-hint">放哪一层重构？</span>
              <div className="share-level-tabs">
                {availableLevels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`share-level-tab ${level === l ? 'is-active' : ''}`}
                  >
                    {l.replace('重构', '')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="share-preview-frame">
          {generating && !dataUrl && (
            <div className="share-placeholder">
              <span className="ink-faint text-sm tracking-widest">正在生成卡片…</span>
            </div>
          )}
          {error && <p className="vermilion text-sm">生成失败：{error}</p>}
          {dataUrl && <img src={dataUrl} alt="分享卡片" className="share-image" />}
        </div>

        {dataUrl && (
          <>
            <p className="share-hint">
              <span className="share-hint-mobile">手机：长按图片保存到相册</span>
              <span className="share-hint-sep"> · </span>
              <span className="share-hint-desktop">电脑：点下方下载</span>
            </p>
            <div className="share-actions">
              <button onClick={download} className="brush-btn brush-btn-small">
                下 载 图 片
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
