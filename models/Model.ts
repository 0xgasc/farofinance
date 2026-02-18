import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver {
  name: string;
  value: number;
  unit: string;
  category: 'revenue' | 'expense' | 'headcount' | 'custom';
  formula?: string;
  dependencies?: string[];
}

export interface IScenario {
  name: string;
  description: string;
  drivers: IDriver[];
  assumptions: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFinancialModel extends Document {
  name: string;
  description: string;
  organizationId: string;
  drivers: IDriver[];
  scenarios: IScenario[];
  dimensions: {
    name: string;
    values: string[];
  }[];
  timeRange: {
    start: Date;
    end: Date;
    granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  category: {
    type: String,
    enum: ['revenue', 'expense', 'headcount', 'custom'],
    required: true
  },
  formula: String,
  dependencies: [String]
});

const ScenarioSchema = new Schema<IScenario>({
  name: { type: String, required: true },
  description: String,
  drivers: [DriverSchema],
  assumptions: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FinancialModelSchema = new Schema<IFinancialModel>({
  name: { type: String, required: true },
  description: String,
  organizationId: { type: String, required: true },
  drivers: [DriverSchema],
  scenarios: [ScenarioSchema],
  dimensions: [{
    name: String,
    values: [String]
  }],
  timeRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    granularity: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.FinancialModel ||
  mongoose.model<IFinancialModel>('FinancialModel', FinancialModelSchema);