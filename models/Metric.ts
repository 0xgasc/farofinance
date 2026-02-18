import mongoose, { Schema, Document } from 'mongoose';

export interface IMetricData {
  date: Date;
  value: number;
}

export interface IMetric extends Document {
  name: string;
  category: string;
  organizationId: string;
  description?: string;
  unit: string;
  data: IMetricData[];
  target?: number;
  comparison_period?: 'mom' | 'qoq' | 'yoy';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MetricDataSchema = new Schema<IMetricData>({
  date: { type: Date, required: true },
  value: { type: Number, required: true }
});

const MetricSchema = new Schema<IMetric>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  organizationId: { type: String, required: true },
  description: String,
  unit: { type: String, required: true },
  data: [MetricDataSchema],
  target: Number,
  comparison_period: {
    type: String,
    enum: ['mom', 'qoq', 'yoy']
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Metric ||
  mongoose.model<IMetric>('Metric', MetricSchema);