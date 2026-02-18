import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetItem {
  category: string;
  subcategory?: string;
  planned: number;
  actual: number;
  variance: number;
  period: Date;
}

export interface IBudget extends Document {
  name: string;
  organizationId: string;
  fiscal_year: number;
  items: IBudgetItem[];
  total_planned: number;
  total_actual: number;
  total_variance: number;
  status: 'draft' | 'approved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const BudgetItemSchema = new Schema<IBudgetItem>({
  category: { type: String, required: true },
  subcategory: String,
  planned: { type: Number, required: true },
  actual: { type: Number, default: 0 },
  variance: { type: Number, default: 0 },
  period: { type: Date, required: true }
});

const BudgetSchema = new Schema<IBudget>({
  name: { type: String, required: true },
  organizationId: { type: String, required: true },
  fiscal_year: { type: Number, required: true },
  items: [BudgetItemSchema],
  total_planned: { type: Number, default: 0 },
  total_actual: { type: Number, default: 0 },
  total_variance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'approved', 'closed'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BudgetSchema.pre('save', function(next) {
  this.total_planned = this.items.reduce((sum, item) => sum + item.planned, 0);
  this.total_actual = this.items.reduce((sum, item) => sum + item.actual, 0);
  this.total_variance = this.total_actual - this.total_planned;

  this.items.forEach(item => {
    item.variance = item.actual - item.planned;
  });

  next();
});

export default mongoose.models.Budget ||
  mongoose.model<IBudget>('Budget', BudgetSchema);