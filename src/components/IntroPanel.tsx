import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ld_intro_collapsed';

export function IntroPanel() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setOpen(stored !== '1'); // default open, "1" means collapsed
    } catch {
      setOpen(true);
    }
  }, []);

  function toggle() {
    setOpen((v) => {
      const next = !v;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '0' : '1');
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  if (open === null) return null; // wait for hydration

  return (
    <div className={`intro-panel ${open ? 'is-open' : 'is-closed'}`}>
      {open ? (
        <>
          <div className="intro-panel-body">
            <p>
              许多痛苦不只来自事情本身，
              <br />
              也来自语言把世界切开的方式——
              <br />
              <span className="intro-panel-dim">成功 / 失败，应该 / 不应该，值得 / 不值得。</span>
            </p>
            <p>
              这个工具不替你重写句子，
              <br />
              只显影：一句话里藏着怎样的思维结构。
            </p>
          </div>
          <button onClick={toggle} className="intro-panel-toggle">
            收 起
          </button>
        </>
      ) : (
        <button onClick={toggle} className="intro-panel-peek">
          → 为什么有这面镜
        </button>
      )}
    </div>
  );
}
