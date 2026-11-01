export type PatternKind = 'orbit' | 'trajectory' | 'constellation' | 'lattice' | 'singularity' | 'wave' | 'prism'

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
    tagEn: 'Indexed math context, parameters, documentation and references.',
    tagZh: '查看索引中的数学标签、参数、源码文档与参考文献。',
    bg: 'linear-gradient(155deg, rgba(237,243,252,0.8) 0%, rgba(176,192,215,0.64) 48%, rgba(228,234,245,0.92) 100%)',
    fg: '#1b1f24',
    ink: 'rgba(27, 31, 36, 0.32)',
    accent: '#3d4652',
    pattern: 'orbit',
  },
  {
    id: 'path',
    num: '02',
    en: 'Path',
    zh: '学习路径',
    tagEn: 'A metadata-based reading guide with your saved progress.',
    tagZh: '基于索引信息的阅读建议，支持进度保存和模块切换。',
    bg: 'linear-gradient(155deg, rgba(218,228,243,0.82) 0%, rgba(141,160,188,0.72) 52%, rgba(204,215,232,0.94) 100%)',
    fg: '#1b1f24',
    ink: 'rgba(27, 31, 36, 0.34)',
    accent: '#454f5c',
    pattern: 'trajectory',
  },
  {
    id: 'related-functions',
    num: '03',
    en: 'Related\nFunctions',
    zh: '相关函数',
    tagEn: 'Browse member functions, documentation and source code.',
    tagZh: '查看成员函数、函数说明和源码。',
    bg: 'linear-gradient(155deg, rgba(108,130,164,0.82) 0%, rgba(43,61,89,0.86) 55%, rgba(27,39,60,0.96) 100%)',
    fg: '#edf3ff',
    ink: 'rgba(222, 234, 255, 0.32)',
    accent: '#2e3641',
    pattern: 'constellation',
  },
  {
    id: 'call-graph',
    num: '04',
    en: 'Call\nGraph',
    zh: '调用图',
    tagEn: 'Static call symbols resolved from indexed source.',
    tagZh: '查看索引源码中的静态调用关系及未解析符号。',
    bg: 'linear-gradient(155deg, rgba(112,126,150,0.78) 0%, rgba(49,64,87,0.86) 55%, rgba(25,35,53,0.96) 100%)',
    fg: '#f2f4f7',
    ink: 'rgba(242, 244, 247, 0.38)',
    accent: '#39424d',
    pattern: 'lattice',
  },
  {
    id: 'compare',
    num: '05',
    en: 'Compare',
    zh: '算法对比',
    tagEn: 'Compare parameters and mathematical methods within a module.',
    tagZh: '选择同模块的另一个算法，比较参数和数学方法。',
    bg: 'linear-gradient(155deg, rgba(69,78,103,0.88) 0%, rgba(28,35,53,0.94) 55%, rgba(13,20,35,0.98) 100%)',
    fg: '#edf0f4',
    ink: 'rgba(237, 240, 244, 0.32)',
    accent: '#232a33',
    pattern: 'singularity',
  },
  {
    id: 'complexity',
    num: '06',
    en: 'Complexity',
    zh: '源码复杂度',
    tagEn: 'Inspect loops, branches and source size.',
    tagZh: '查看循环、分支与源码规模。',
    bg: 'linear-gradient(155deg, rgba(224,233,247,0.82) 0%, rgba(151,174,204,0.7) 55%, rgba(197,213,233,0.95) 100%)',
    fg: '#1b1f24',
    ink: 'rgba(27,31,36,0.32)',
    accent: '#3d4652',
    pattern: 'wave',
  },
  {
    id: 'quiz',
    num: '07',
    en: 'Self-check',
    zh: '理解自测',
    tagEn: 'Source-aware questions with revealable reference answers.',
    tagZh: '依据当前算法元数据自测，思考后展开参考答案。',
    bg: 'linear-gradient(155deg, rgba(139,151,181,0.82) 0%, rgba(66,79,109,0.88) 55%, rgba(34,44,67,0.96) 100%)',
    fg: '#f2f4f7',
    ink: 'rgba(242,244,247,0.38)',
    accent: '#39424d',
    pattern: 'prism',
  },
]
