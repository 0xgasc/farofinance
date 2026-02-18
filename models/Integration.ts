import mongoose, { Schema, Document } from 'mongoose';

export interface IIntegrationConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  webhookUrl?: string;
  customFields?: Record<string, any>;
}

export interface IFieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: any;
}

export interface IDataSync {
  lastSyncAt: Date;
  nextSyncAt: Date;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  syncStatus: 'active' | 'paused' | 'error';
  recordsProcessed: number;
  recordsFailed: number;
  errorMessage?: string;
}

export interface IIntegration extends Document {
  name: string;
  type: 'accounting' | 'crm' | 'hris' | 'payment' | 'dataWarehouse' | 'custom';
  provider: 'quickbooks' | 'xero' | 'salesforce' | 'hubspot' | 'stripe' | 'gusto' | 'snowflake' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  organizationId: string;
  entityId?: string; // For multi-entity support
  config: IIntegrationConfig;
  fieldMappings: IFieldMapping[];
  dataSync: IDataSync;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['accounting', 'crm', 'hris', 'payment', 'dataWarehouse', 'custom'],
    required: true
  },
  provider: {
    type: String,
    enum: ['quickbooks', 'xero', 'salesforce', 'hubspot', 'stripe', 'gusto', 'snowflake', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'syncing'],
    default: 'disconnected'
  },
  organizationId: { type: String, required: true },
  entityId: String,
  config: {
    apiKey: String,
    apiSecret: String,
    accessToken: String,
    refreshToken: String,
    webhookUrl: String,
    customFields: { type: Map, of: Schema.Types.Mixed }
  },
  fieldMappings: [{
    sourceField: String,
    targetField: String,
    transformation: String,
    defaultValue: Schema.Types.Mixed
  }],
  dataSync: {
    lastSyncAt: Date,
    nextSyncAt: Date,
    syncFrequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    syncStatus: {
      type: String,
      enum: ['active', 'paused', 'error'],
      default: 'active'
    },
    recordsProcessed: { type: Number, default: 0 },
    recordsFailed: { type: Number, default: 0 },
    errorMessage: String
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Integration ||
  mongoose.model<IIntegration>('Integration', IntegrationSchema);