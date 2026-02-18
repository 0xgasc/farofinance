import mongoose, { Schema, Document } from 'mongoose';

export interface ICondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface IAction {
  type: 'categorize' | 'tag' | 'allocate' | 'transform' | 'reject';
  targetField?: string;
  targetValue?: any;
  formula?: string;
  allocationRules?: {
    method: 'percentage' | 'fixed' | 'driver';
    allocations: { entityId: string; value: number }[];
  };
}

export interface IAccountingRule extends Document {
  name: string;
  description?: string;
  organizationId: string;
  entityId?: string;
  ruleType: 'journalEntry' | 'expenseClassification' | 'revenueRecognition' | 'intercompanyElimination' | 'consolidation';
  priority: number;
  conditions: ICondition[];
  actions: IAction[];
  isActive: boolean;
  appliedCount: number;
  lastAppliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccountingRuleSchema = new Schema<IAccountingRule>({
  name: { type: String, required: true },
  description: String,
  organizationId: { type: String, required: true },
  entityId: { type: String, ref: 'Entity' },
  ruleType: {
    type: String,
    enum: ['journalEntry', 'expenseClassification', 'revenueRecognition', 'intercompanyElimination', 'consolidation'],
    required: true
  },
  priority: { type: Number, default: 0 },
  conditions: [{
    field: { type: String, required: true },
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains', 'startsWith', 'endsWith', 'greaterThan', 'lessThan'],
      required: true
    },
    value: Schema.Types.Mixed,
    logicalOperator: {
      type: String,
      enum: ['AND', 'OR'],
      default: 'AND'
    }
  }],
  actions: [{
    type: {
      type: String,
      enum: ['categorize', 'tag', 'allocate', 'transform', 'reject'],
      required: true
    },
    targetField: String,
    targetValue: Schema.Types.Mixed,
    formula: String,
    allocationRules: {
      method: {
        type: String,
        enum: ['percentage', 'fixed', 'driver']
      },
      allocations: [{
        entityId: String,
        value: Number
      }]
    }
  }],
  isActive: { type: Boolean, default: true },
  appliedCount: { type: Number, default: 0 },
  lastAppliedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.AccountingRule ||
  mongoose.model<IAccountingRule>('AccountingRule', AccountingRuleSchema);