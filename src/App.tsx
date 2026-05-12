import { useEffect, useRef, useState } from 'react';
import { Seal } from './components/Seal';
import { ProgressRail } from './components/ProgressRail';
import { Step } from './components/Step';
import { OverviewView } from './components/OverviewView';
import { LayeredChainView } from './components/LayeredChainView';
import { LeapsView } from './components/LeapsView';
import { BindingsView } from './components/BindingsView';
import { RewritesView } from './components/RewritesView';
import { QuestionsList } from './components/QuestionsList';
import { SafetyNote } from './components/SafetyNote';
import { ExamplesBar } from './components/ExamplesBar';
import { NotSuitable } from './components/NotSuitable';
import { ShareModal } from './components/ShareModal';
import { fetchDevelop } from './lib/llm';
import type { DevelopReport } from './types/report';

type Phase = 'compose' | 'developing' | 'developed';

const TITLE = '语言显影器';
const STEP_IDS = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];

interface HistoryFrame {
  text: string;
  report: DevelopReport;
}

export default function App() {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('compose');
  const [report, setReport] = useState<DevelopReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sealPressing, setSealPressing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [history, setHistory] = useState<HistoryFrame[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (phase !== 'developed' || !report || report.notSuitable) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = STEP_IDS.indexOf(e.target.id);
            if (idx >= 0) setActiveStep(idx + 1);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );
    STEP_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [phase, report]);

  async function run() {
    const t = text.trim();
    if (!t) return;
    setSealPressing(true);
    setTimeout(() => setSealPressing(false), 600);
    setError(null);
    setReport(null);
    setPhase('developing');
    const ctl = new AbortController();
    abortRef.current = ctl;
    try {
      const r = await fetchDevelop(t, ctl.signal);
      setReport(r);
      setPhase('developed');
      setActiveStep(1);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError((e as Error).message);
      setPhase('compose');
    }
  }

  function reset() {
    abortRef.current?.abort();
    setText('');
    setReport(null);
    setError(null);
    setPhase('compose');
    setActiveStep(1);
    setHistory([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onFollow(questionIndex: number, answer: string) {
    if (!report || followLoading) return;
    const question = report.reflectionQuestions[questionIndex];
    if (!question) return;
    const followupPrompt = `[追问]\n原话：${text}\n反思问题：${question}\n我的回应：${answer}`;
    setFollowLoading(true);
    const ctl = new AbortController();
    abortRef.current = ctl;
    try {
      const newReport = await fetchDevelop(followupPrompt, ctl.signal);
      setHistory((h) => [...h, { text, report }]);
      setText(answer);
      setReport(newReport);
      setActiveStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message);
      }
    } finally {
      setFollowLoading(false);
    }
  }

  function goBack() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setText(prev.text);
      setReport(prev.report);
      setActiveStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return h.slice(0, -1);
    });
  }

  function jumpTo(n: number) {
    const el = document.getElementById(`step-${n}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const isEmpty =
    report &&
    !report.notSuitable &&
    report.layeredChain.length === 0 &&
    report.leaps.length === 0 &&
    report.rewrites.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-12 pb-4 px-6 flex flex-col items-center">
        <div className="title-wrap">
          <h1 className="title">
            {TITLE.split('').map((ch, i) => (
              <span key={i} className="title-char" style={{ animationDelay: `${i * 120}ms` }}>
                {ch}
              </span>
            ))}
          </h1>
          <div className={`absolute -right-14 top-1 hidden sm:block ${sealPressing ? 'seal-press' : 'seal'}`}>
            <Seal size={52} />
          </div>
        </div>
        <p className="subtitle">语 言 链 条 · 结 构 显 影</p>
      </header>

      {phase === 'compose' && (
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <p className="intro">
            输入一句让你卡住的话，显影器会拆出其中的<strong>推导链</strong>、<strong>隐藏前提</strong>和<strong>绑定关系</strong>
            <br />
            <span className="intro-soft">不判断对错 · 不做心理咨询 · 不做宗教解释——只是帮你看见语言结构</span>
          </p>

          <div className="sheet sheet-compose px-8 sm:px-12 py-10 sm:py-12">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="比如：「我必须好好学习，这样父母才不会失望，我才不是一个没用的人。」"
              className="w-full min-h-[36vh] text-[17px] leading-[2.1] ink resize-none placeholder:ink-faint"
              autoFocus
              maxLength={3500}
            />
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[11px] ink-faint tracking-widest tabular-nums">
                {text.length} / 3500
              </span>
              <button onClick={run} disabled={!text.trim()} className="brush-btn">
                显　影
              </button>
              <span className="w-[60px]" />
            </div>
            {error && <p className="mt-4 text-sm vermilion text-center">{error}</p>}
          </div>

          <ExamplesBar onPick={setText} />
        </main>
      )}

      {phase === 'developing' && (
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="sheet px-8 py-12 text-center">
            <div className="ink-faint text-sm tracking-[0.4em]">
              墨 在 化 开
              <span className="shimmer-dot">·</span>
              <span className="shimmer-dot">·</span>
              <span className="shimmer-dot">·</span>
            </div>
            <p className="ink-faint text-xs mt-3 tracking-widest">正在拆解语言结构</p>
          </div>
        </main>
      )}

      {phase === 'developed' && report && report.notSuitable && (
        <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 pb-16">
          <div className="origin-quote origin-quote-narrow">
            <span className="origin-mark">原</span>
            <p className="origin-text">{text}</p>
          </div>
          <NotSuitable message={report.notSuitable} onBack={reset} />
        </main>
      )}

      {phase === 'developed' && report && !report.notSuitable && (
        <div className="developed-shell">
          <ProgressRail active={activeStep} onJump={jumpTo} />

          <main className="developed-main">
            {history.length > 0 && (
              <div className="history-bar">
                <button onClick={goBack} className="history-back">
                  ← 返 回 上 一 次（共 {history.length} 步）
                </button>
              </div>
            )}
            <div className="origin-quote">
              <span className="origin-mark">{history.length > 0 ? '续' : '原'}</span>
              <p className="origin-text">{text}</p>
            </div>

            {isEmpty ? (
              <p className="text-sm ink-soft text-center py-8">这段话里没有明显的语言结构需要拆解。</p>
            ) : (
              <>
                <div className="reveal step-flow">
                  <Step id="step-1" index={1} title="总览显影" doing="一句话指出这段话的核心推导。">
                    <OverviewView overview={report.overview} />
                  </Step>

                  {report.layeredChain.length > 0 && (
                    <Step
                      id="step-2"
                      index={2}
                      title="层级链条"
                      doing="把一句话拆成事件 → 解释 → 价值 → 存在/行动 几个层。"
                    >
                      <LayeredChainView chain={report.layeredChain} />
                    </Step>
                  )}

                  {report.leaps.length > 0 && (
                    <Step
                      id="step-3"
                      index={3}
                      title="关键跳跃"
                      doing="指出哪几步是语言制造的跳跃，不是事实本身。"
                    >
                      <LeapsView leaps={report.leaps} />
                    </Step>
                  )}

                  {report.bindings.length > 0 && (
                    <Step
                      id="step-4"
                      index={4}
                      title="绑定关系"
                      doing="找出被语言焊接在一起、但未必天然成立的对象。"
                    >
                      <BindingsView bindings={report.bindings} />
                    </Step>
                  )}

                  {report.rewrites.length > 0 && (
                    <Step
                      id="step-5"
                      index={5}
                      title="分层重构"
                      doing="按递进顺序给出四种重写，从减压到具体行动。"
                    >
                      <RewritesView rewrites={report.rewrites} />
                    </Step>
                  )}

                  {report.reflectionQuestions.length > 0 && (
                    <section className="reflect">
                      <h3 className="reflect-title">继续观察</h3>
                      <p className="reflect-hint">点任意一问"接着想"，模型会顺着这条线继续显影。</p>
                      <QuestionsList
                        items={report.reflectionQuestions}
                        onFollow={onFollow}
                        busy={followLoading}
                      />
                    </section>
                  )}

                  {report.safetyNote && <SafetyNote text={report.safetyNote} />}
                </div>

                <div className="mt-12 mb-4 flex items-center justify-center gap-10 flex-wrap">
                  <button onClick={() => setShareOpen(true)} className="minor-btn">
                    生 成 卡 片
                  </button>
                  <button onClick={reset} className="minor-btn">
                    重 新 写
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      )}

      {shareOpen && report && !report.notSuitable && (
        <ShareModal text={text} report={report} onClose={() => setShareOpen(false)} />
      )}

      <footer className="py-10 text-center">
        <p className="text-[11px] ink-faint tracking-[0.3em] leading-loose max-w-md mx-auto px-4">
          这是一个语言结构分析工具。不评判、不安慰、不替你做决定。<br />
          文字仅在你的浏览器与服务器之间流转，不被存储。
        </p>
        <div className="alpha-banner">
          <span className="alpha-banner-dot" />
          <span className="alpha-banner-text">
            <strong>Alpha</strong>　仍在实验中　·　欢迎反馈：
            <a
              href="mailto:1946726864@qq.com?subject=语言显影器反馈"
              className="alpha-banner-mail"
            >
              1946726864@qq.com
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
