import winkNLP from 'wink-nlp'
import model from 'wink-eng-lite-web-model'

const nlp = winkNLP(model)
const its = nlp.its

export type SentimentLabel = 'positive' | 'neutral' | 'negative'
export type Sentiment = { label: SentimentLabel; score: number }

const THRESHOLD = 0.15

/** Lexicon-based sentiment (wink-nlp, runs locally, no API cost). Score is in [-1, 1]. */
export function tagSentiment(text: string): Sentiment {
  const raw = nlp.readDoc(text).out(its.sentiment) as number
  const score = Math.round(raw * 100) / 100
  const label: SentimentLabel =
    score > THRESHOLD ? 'positive' : score < -THRESHOLD ? 'negative' : 'neutral'
  return { label, score }
}
