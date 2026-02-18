import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  organizationId: string;
  entityId: string;
  sourceIntegration: string;
  date: Date;
  type: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  currency: string;
  accountCode?: string;
  accountName?: string;
  vendor?: string;
  customer?: string;
  project?: string;
  department?: string;
  location?: string;
  tags: string[];
  metadata: Record<string, any>;
  appliedRules: string[];
  isIntercompany: boolean;
  eliminationStatus?: 'pending' | 'eliminated' | 'retained';
  consolidationStatus: 'pending' | 'consolidated';
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  organizationId: { type: String, required: true },
  entityId: { type: String, ref: 'Entity', required: true },
  sourceIntegration: { type: String, ref: 'Integration', required: true },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ['revenue', 'expense', 'asset', 'liability', 'equity'],
    required: true
  },
  category: { type: String, required: true },
  subcategory: String,
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  accountCode: String,
  accountName: String,
  vendor: String,
  customer: String,
  project: String,
  department: String,
  location: String,
  tags: [String],
  metadata: { type: Map, of: Schema.Types.Mixed },
  appliedRules: [{ type: Schema.Types.ObjectId, ref: 'AccountingRule' }],
  isIntercompany: { type: Boolean, default: false },
  eliminationStatus: {
    type: String,
    enum: ['pending', 'eliminated', 'retained']
  },
  consolidationStatus: {
    type: String,
    enum: ['pending', 'consolidated'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient querying
TransactionSchema.index({ organizationId: 1, entityId: 1, date: -1 });
TransactionSchema.index({ organizationId: 1, type: 1, date: -1 });

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);