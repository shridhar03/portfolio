import { Schema, model, type InferSchemaType } from 'mongoose'

const messageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    sentiment: {
      label: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
      score: { type: Number, required: true },
    },
    emailed: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'messages' },
)

export type MessageDoc = InferSchemaType<typeof messageSchema>
export const MessageModel = model('Message', messageSchema)
