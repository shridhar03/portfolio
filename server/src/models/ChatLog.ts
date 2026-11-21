import { Schema, model, type InferSchemaType } from 'mongoose'

// Used by the chatbot (Phase 5). Stores anonymised Q&A only: no IPs, names or emails.
const chatLogSchema = new Schema(
  {
    sessionHash: { type: String, required: true, index: true },
    intent: { type: String, enum: ['resume', 'projects', 'contact', 'off-topic'], required: true },
    question: { type: String, required: true, maxlength: 2000 },
    answer: { type: String, default: '' },
  },
  { timestamps: true, collection: 'chatLogs' },
)
chatLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }) // keep 90 days

export type ChatLogDoc = InferSchemaType<typeof chatLogSchema>
export const ChatLogModel = model('ChatLog', chatLogSchema)
