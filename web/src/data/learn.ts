export type PatternKind = 'stripes' | 'lines' | 'dots' | 'graph' | 'noise'

export interface LearnMode {
  id: string
  num: string
  en: string // card title, may contain \n (rendered with pre-line)
  zh: string
  tagEn: string
  tagZh: string
  bg: string // card face — CSS background (silver metallic gradients)
  fg: string
  ink: string // canvas pattern color (rgba)
  accent: string // accent color for the content panel (readable on the light silver page)
  pattern: PatternKind
}

export const MODES: LearnMode[] = [
  {
    id: 'math-card',
    num: '01',
    en: 'Math\nCard',
    zh: '数学卡片',
    tagEn: 'Methods, key params, formulas, references & citation edges.',
    tagZh: '数学方法、关键参数、数学描述、参考文献与引用关系。',
    bg: 'linear-gradient(155deg, #f8f9fb 0%, #e4e7eb 48%, #c7cdd5 100%)',
    fg: '#1b1f24',
    ink: 'rgba(27, 31, 36, 0.32)',
    accent: '#3d4652',
    pattern: 'stripes',
  },
  {
    id: 'path',
    num: '02',
    en: 'Path',
    zh: '学习路径',
    tagEn: 'Prerequisites ordered into a step-by-step route.',
    tagZh: '按依赖关系排序的渐进式学习步骤。',
    bg: 'linear-gradient(155deg, #eceef2 0%, #cdd2da 52%, #aab2bd 100%)',
    fg: '#1b1f24',
    ink: 'rgba(27, 31, 36, 0.34)',
    accent: '#454f5c',
    pattern: 'lines',
  },
  {
    id: 'recommend',
    num: '03',
    en: 'Recommend',
    zh: '相似推荐',
    tagEn: 'Nearest algorithms ranked by similarity.',
    tagZh: '按相似度排序的邻近算法。',
    bg: 'linear-gradient(155deg, #c9cfd8 0%, #9aa2ad 55%, #79828e 100%)',
    fg: '#14181d',
    ink: 'rgba(20, 24, 29, 0.4)',
    accent: '#2e3641',
    pattern: 'dots',
  },
  {
    id: 'call-graph',
    num: '04',
    en: 'Call\nGraph',
    zh: '调用图',
    tagEn: 'The call chain inside one optimization step.',
    tagZh: '一次优化迭代内部的调用链。',
    bg: 'linear-gradient(155deg, #6d7583 0%, #4a525e 55%, #313842 100%)',
    fg: '#f2f4f7',
    ink: 'rgba(242, 244, 247, 0.38)',
    accent: '#39424d',
    pattern: 'graph',
  },
  {
    id: 'compare',
    num: '05',
    en: 'Compare',
    zh: '算法对比',
    tagEn: 'Side-by-side trade-offs against peer algorithms.',
    tagZh: '与同类算法的逐项权衡对比。',
    bg: 'linear-gradient(155deg, #3e434c 0%, #262a31 55%, #14171c 100%)',
    fg: '#edf0f4',
    ink: 'rgba(237, 240, 244, 0.32)',
    accent: '#232a33',
    pattern: 'noise',
  },
]

/* Sample algorithm used to populate the panels */
export const ALGO = {
  name: 'Adam',
  full: 'Adaptive Moment Estimation',
  zh: 'Adam 优化器',
  category: '一阶优化算法 · First-order Optimization',
  venue: 'ICLR 2015',
}
