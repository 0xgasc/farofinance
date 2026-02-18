import mongoose, { Schema, Document } from 'mongoose';

export interface IHiringRole {
  title: string;
  department: string;
  baseSalary: number;
  benefitsMultiplier: number;
  equipmentCost: number;
  startDate: Date;
  headcount: number;
  status: 'planned' | 'approved' | 'hired' | 'cancelled';
}

export interface IHiringPlan extends Document {
  organizationId: string;
  name: string;
  roles: IHiringRole[];
  totalAnnualCost: number;
  totalMonthlyBurn: number;
  createdAt: Date;
  updatedAt: Date;
}

const HiringRoleSchema = new Schema<IHiringRole>({
  title: { type: String, required: true },
  department: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  benefitsMultiplier: { type: Number, default: 1.25 },
  equipmentCost: { type: Number, default: 2000 },
  startDate: { type: Date, required: true },
  headcount: { type: Number, default: 1 },
  status: { type: String, enum: ['planned', 'approved', 'hired', 'cancelled'], default: 'planned' }
});

const HiringPlanSchema = new Schema<IHiringPlan>({
  organizationId: { type: String, required: true },
  name: { type: String, required: true },
  roles: [HiringRoleSchema],
  totalAnnualCost: { type: Number, default: 0 },
  totalMonthlyBurn: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

HiringPlanSchema.pre('save', function(next) {
  let annualCost = 0;
  this.roles.forEach(role => {
    if (role.status !== 'cancelled') {
      const fullyLoaded = (role.baseSalary * role.benefitsMultiplier) + role.equipmentCost;
      annualCost += fullyLoaded * role.headcount;
    }
  });
  this.totalAnnualCost = annualCost;
  this.totalMonthlyBurn = annualCost / 12;
  next();
});

export default mongoose.models.HiringPlan ||
  mongoose.model<IHiringPlan>('HiringPlan', HiringPlanSchema);
