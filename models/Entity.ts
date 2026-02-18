import mongoose, { Schema, Document } from 'mongoose';

export interface IEntity extends Document {
  name: string;
  code: string;
  type: 'subsidiary' | 'division' | 'department' | 'costCenter' | 'profitCenter';
  parentEntityId?: string;
  organizationId: string;
  currency: string;
  country: string;
  taxId?: string;
  consolidationRules: {
    eliminateIntercompany: boolean;
    consolidationMethod: 'full' | 'proportional' | 'equity';
    ownershipPercentage?: number;
  };
  accountingSettings: {
    fiscalYearEnd: string;
    accountingStandard: 'GAAP' | 'IFRS' | 'LocalGAAP';
    chartOfAccountsPrefix?: string;
  };
  integrations: string[]; // Integration IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['subsidiary', 'division', 'department', 'costCenter', 'profitCenter'],
    required: true
  },
  parentEntityId: { type: String, ref: 'Entity' },
  organizationId: { type: String, required: true },
  currency: { type: String, default: 'USD' },
  country: { type: String, required: true },
  taxId: String,
  consolidationRules: {
    eliminateIntercompany: { type: Boolean, default: true },
    consolidationMethod: {
      type: String,
      enum: ['full', 'proportional', 'equity'],
      default: 'full'
    },
    ownershipPercentage: Number
  },
  accountingSettings: {
    fiscalYearEnd: { type: String, default: '12-31' },
    accountingStandard: {
      type: String,
      enum: ['GAAP', 'IFRS', 'LocalGAAP'],
      default: 'GAAP'
    },
    chartOfAccountsPrefix: String
  },
  integrations: [{ type: Schema.Types.ObjectId, ref: 'Integration' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Entity ||
  mongoose.model<IEntity>('Entity', EntitySchema);