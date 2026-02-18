import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  organizationId: mongoose.Types.ObjectId;
  role: 'admin' | 'editor' | 'viewer' | 'investor';
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  image: String,
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer', 'investor'],
    default: 'admin'
  },
  emailVerified: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 });
UserSchema.index({ organizationId: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
