import mongoose, { Schema, Document } from 'mongoose';

export interface ICashPosition extends Document {
  organizationId: string;
  accountName: string;
  balance: number;
  currency: string;
  date: Date;
  source: 'manual' | 'plaid' | 'integration';
  sourceIntegrationId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CashPositionSchema = new Schema<ICashPosition>({
  organizationId: { type: String, required: true },
  accountName: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  date: { type: Date, required: true },
  source: { type: String, enum: ['manual', 'plaid', 'integration'], default: 'manual' },
  sourceIntegrationId: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CashPositionSchema.index({ organizationId: 1, date: -1 });

export default mongoose.models.CashPosition ||
  mongoose.model<ICashPosition>('CashPosition', CashPositionSchema);
