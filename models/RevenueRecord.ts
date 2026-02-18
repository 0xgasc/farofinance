import mongoose, { Schema, Document } from 'mongoose';

export interface IRevenueRecord extends Document {
  organizationId: string;
  customerId: string;
  customerName: string;
  product?: string;
  amount: number;
  currency: string;
  type: 'new' | 'expansion' | 'contraction' | 'churn' | 'reactivation';
  isRecurring: boolean;
  period: Date;
  startDate?: Date;
  endDate?: Date;
  source: 'manual' | 'stripe' | 'integration';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const RevenueRecordSchema = new Schema<IRevenueRecord>({
  organizationId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  product: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  type: {
    type: String,
    enum: ['new', 'expansion', 'contraction', 'churn', 'reactivation'],
    required: true
  },
  isRecurring: { type: Boolean, default: true },
  period: { type: Date, required: true },
  startDate: Date,
  endDate: Date,
  source: { type: String, enum: ['manual', 'stripe', 'integration'], default: 'manual' },
  metadata: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RevenueRecordSchema.index({ organizationId: 1, period: -1 });
RevenueRecordSchema.index({ organizationId: 1, customerId: 1 });

export default mongoose.models.RevenueRecord ||
  mongoose.model<IRevenueRecord>('RevenueRecord', RevenueRecordSchema);
