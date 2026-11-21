import winkNLP from 'wink-nlp'
import model from 'wink-eng-lite-web-model'

const nlp = winkNLP(model)
const its = nlp.its

export type Intent = 'resume' | 'projects' | 'contact' | 'off-topic'

// Lemma/keyword sets per intent. Matching is on lowercased lemmas, so "worked", "working" → "work".
const KEYWORDS: Record<Exclude<Intent, 'off-topic'>, string[]> = {
  contact: [
    'contact',
    'email',
    'mail',
    'hire',
    'reach',
    'linkedin',
    'call',
    'meet',
    'available',
    'availability',
    'connect',
    'message',
    'interview',
    'recruit',
    'opportunity',
    'freelance',
    'job',
    'offer',
    'touch',
  ],
  projects: [
    'project',
    'build',
    'built',
    'portfolio',
    'app',
    'application',
    'solutionizer',
    'shopping',
    'ecommerce',
    'e-commerce',
    'website',
    'site',
    'chatbot',
    'demo',
    'github',
    'repo',
    'case',
    'made',
    'create',
    'develop',
    'ship',
  ],
  resume: [
    'experience',
    'work',
    'job',
    'intern',
    'trainee',
    'codexlabz',
    'skill',
    'stack',
    'tech',
    'language',
    'education',
    'study',
    'degree',
    'mca',
    'college',
    'university',
    'gpa',
    'cgpa',
    'certification',
    'certificate',
    'certify',
    'cert',
    'google',
    'azure',
    'cloud',
    'mern',
    'react',
    'node',
    'mongodb',
    'express',
    'javascript',
    'typescript',
    'ml',
    'ai',
    'nlp',
    'machine',
    'learn',
    'strength',
    'background',
    'resume',
    'cv',
    'about',
    'who',
    'yourself',
    'achievement',
    'award',
    'leadership',
    'ugc',
    'net',
    'boxing',
    'olympiad',
    'speak',
    'event',
    'organize',
    'hobby',
    'location',
    'satara',
    'based',
    'live',
    'shridhar',
    'chavan',
    'he',
    'his',
    'him',
    'you',
    'your',
    'hello',
    'hi',
    'hey',
    'thanks',
    'thank',
  ],
}

// Strong signals of an unrelated request. Only decisive when no on-topic keyword is present.
const OFF_TOPIC = [
  'weather',
  'recipe',
  'cook',
  'poem',
  'song',
  'lyrics',
  'joke',
  'story',
  'essay',
  'homework',
  'translate',
  'stock',
  'bitcoin',
  'crypto',
  'election',
  'president',
  'politics',
  'movie',
  'football',
  'cricket',
  'score',
  'capital',
  'population',
  'solve',
  'equation',
  'integral',
  'debug',
  'fix',
  'write',
  'code',
  'function',
  'script',
  'sql',
  'regex',
  'ignore',
  'pretend',
  'roleplay',
  'jailbreak',
  'prompt',
  'instructions',
  'system',
]

const toSet = (a: string[]) => new Set(a)
const SETS = {
  contact: toSet(KEYWORDS.contact),
  projects: toSet(KEYWORDS.projects),
  resume: toSet(KEYWORDS.resume),
  off: toSet(OFF_TOPIC),
}

export function tokensOf(text: string) {
  const doc = nlp.readDoc(text.toLowerCase())
  const words = doc.tokens().filter((t) => t.out(its.type) === 'word')
  // Surface forms + lemmas + stems: "projects", "built", "apps" all match their base keyword.
  return new Set<string>([
    ...words.out(),
    ...(words.out(its.lemma as never) as string[]),
    ...(words.out(its.stem as never) as string[]),
  ])
}

/** Lightweight rule-based intent detection over lemmas (wink-nlp). Runs locally, no API cost. */
export function detectIntent(text: string): Intent {
  const tokens = tokensOf(text)
  const score = (s: Set<string>) => [...tokens].filter((t) => s.has(t)).length
  const scores = {
    contact: score(SETS.contact),
    projects: score(SETS.projects),
    resume: score(SETS.resume),
  }
  const off = score(SETS.off)
  const onTopic = scores.contact + scores.projects + scores.resume

  // Prompt-injection attempts are refused outright, whatever else they mention.
  const injection = ['ignore', 'pretend', 'jailbreak', 'roleplay', 'disregard'].some((w) =>
    tokens.has(w),
  )
  if (
    injection &&
    ['instruction', 'prompt', 'rule', 'previous', 'system'].some((w) => tokens.has(w))
  )
    return 'off-topic'

  if (onTopic === 0) return off > 0 ? 'off-topic' : 'resume' // unknown but harmless → let the model answer
  // A request like "write me a sorting function in javascript" mentions a skill but is still a task.
  const asksForTask =
    tokens.has('write') || tokens.has('solve') || tokens.has('debug') || tokens.has('translate')
  const aboutHim = ['shridhar', 'chavan', 'he', 'his', 'him', 'you', 'your'].some((w) =>
    tokens.has(w),
  )
  if (asksForTask && !aboutHim && off >= scores.contact + scores.projects + scores.resume)
    return 'off-topic'

  if (scores.contact > 0 && scores.contact >= scores.projects) return 'contact'
  if (scores.projects > 0 && scores.projects >= scores.resume - 1) return 'projects'
  return 'resume'
}
