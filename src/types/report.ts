export interface Overview {
  corePattern: string;
  plainExplanation: string;
}
export interface LayerNode {
  layer: string;
  text: string;
  note?: string;
}
export interface Leap {
  from: string;
  to: string;
  whyItMatters: string;
}
export interface Binding {
  items: string[];
  explanation: string;
}
export interface Rewrite {
  level: string;
  purpose: string;
  text: string;
}
export interface DevelopReport {
  notSuitable?: string;
  coreInsight: string;
  overview: Overview;
  layeredChain: LayerNode[];
  leaps: Leap[];
  bindings: Binding[];
  rewrites: Rewrite[];
  reflectionQuestions: string[];
  chainSummary: string;
  safetyNote?: string;
}

export interface ChainStep {
  text: string;
  coreInsight: string;
  summary: string;
}
export interface ChainMemory {
  originalInput: string;
  path: ChainStep[];
  triggerQuestion?: string;
}

export const LAYER_COLOR: Record<string, string> = {
  事件层: 'event',
  解释层: 'interp',
  价值层: 'value',
  存在层: 'exist',
  行动层: 'action',
};

export const REWRITE_TAG: Record<string, string> = {
  轻度重构: '轻',
  中度重构: '中',
  深度重构: '深',
  行动型重构: '行',
};
