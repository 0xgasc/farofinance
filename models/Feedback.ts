import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  organizationId: string;
  userId: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'feedback';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  url: string;
  userAgent: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'done' | 'closed';
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  organizationId: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  type: { type: String, enum: ['bug', 'feature', 'feedback'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: String,
  userAgent: String,
  status: { type: String, enum: ['new', 'reviewed', 'in_progress', 'done', 'closed'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

FeedbackSchema.index({ organizationId: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1, type: 1 });

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);
