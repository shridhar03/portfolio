import { Schema, model, type InferSchemaType } from 'mongoose'

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['shipped', 'in-progress', 'coming-soon'], required: true },
    order: { type: Number, required: true },
    stack: { type: [String], default: [] },
    caseStudy: {
      type: new Schema({ problem: String, approach: String, outcome: String }, { _id: false }),
      default: null,
    },
    links: { type: new Schema({ live: String, repo: String }, { _id: false }), default: {} },
  },
  { timestamps: true, collection: 'projects' },
)

export type ProjectDoc = InferSchemaType<typeof projectSchema>
export const ProjectModel = model('Project', projectSchema)
