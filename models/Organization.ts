import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'growth' | 'scale';
  currency: string;
  fiscalYearEnd: string;
  industry?: string;
  settings: {
    defaultCurrency: string;
    dateFormat: string;
    timezone: string;
  };
  billing: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: {
    type: String,
    enum: ['free', 'starter', 'growth', 'scale'],
    default: 'free'
  },
  currency: { type: String, default: 'USD' },
  fiscalYearEnd: { type: String, default: '12-31' },
  industry: String,
  settings: {
    defaultCurrency: { type: String, default: 'USD' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    timezone: { type: String, default: 'America/New_York' }
  },
  billing: {
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrganizationSchema.index({ slug: 1 });

export default mongoose.models.Organization ||
  mongoose.model<IOrganization>('Organization', OrganizationSchema);
