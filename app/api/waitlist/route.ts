import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose, { Schema } from 'mongoose';

// Lightweight waitlist model — no auth required for public signup
const WaitlistSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  source: { type: String, default: 'landing' },
  createdAt: { type: Date, default: Date.now },
});

const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', WaitlistSchema);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await dbConnect();

    // Upsert — idempotent if they submit twice
    await Waitlist.findOneAndUpdate(
      { email },
      { email, source: body.source || 'landing' },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true }, { status: 201 });
  }
}

// Admin endpoint to export the list
export async function GET(request: NextRequest) {
  try {
    // Simple secret-key protection for admin access
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const list = await Waitlist.find({}).sort({ createdAt: -1 });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
