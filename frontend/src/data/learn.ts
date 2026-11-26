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
    zh: 'Math Card',
    tagEn: 'Indexed math context, parameters, documentation and references.',
    tagZh: 'View indexed math tags, parameters, source docs, and references.',
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
    zh: 'Learning Path',
    tagEn: 'A metadata-based reading guide with your saved progress.',
    tagZh: 'Reading suggestions based on index info, with progress saving and module switching.',
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
    zh: 'Related Functions',
    tagEn: 'Browse member functions, documentation and source code.',
    tagZh: 'View member functions, their descriptions, and source code.',
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
    zh: 'Call Graph',
    tagEn: 'Static call symbols resolved from indexed source.',
    tagZh: 'View static call relations in indexed source and unresolved symbols.',
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
    zh: 'Compare',
    tagEn: 'Compare parameters and mathematical methods within a module.',
    tagZh: 'Pick another algorithm in the same module and compare parameters and math methods.',
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
    zh: 'Complexity',
    tagEn: 'Inspect loops, branches and source size.',
    tagZh: 'View loops, branches, and source size.',
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
    zh: 'Self-check',
    tagEn: 'Source-aware questions with revealable reference answers.',
    tagZh: 'Dynamic questions from the current algorithm source and metadata, with answers and evidence.',
    bg: 'linear-gradient(155deg, rgba(139,151,181,0.82) 0%, rgba(66,79,109,0.88) 55%, rgba(34,44,67,0.96) 100%)',
    fg: '#f2f4f7',
    ink: 'rgba(242,244,247,0.38)',
    accent: '#39424d',
    pattern: 'prism',
  },
  {
    id: 'recommend',
    num: '08',
    en: 'Recommend',
    zh: 'Recommend',
    tagEn: 'Related algorithms ranked by semantic similarity and metadata overlap.',
    tagZh: 'Recommend similar algorithms by semantic score and module/task/math-method overlap.',
    bg: 'linear-gradient(155deg, rgba(218,228,243,0.82), rgba(66,79,109,0.88))',
    fg: '#edf3ff',
    ink: 'rgba(222,234,255,0.32)',
    accent: '#39424d',
    pattern: 'constellation',
  },
]
