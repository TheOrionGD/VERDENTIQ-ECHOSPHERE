import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const recipientEmail = email.toLowerCase().trim();
    const enteredOtp = otp.toString().trim();

    const db = await getMongoDb();
    let isMatch = false;

    if (db) {
      const otpsCol = db.collection('otps');
      const record = await otpsCol.findOne({ email: recipientEmail });

      if (record && record.otp === enteredOtp) {
        const expiresAt = record.expiresAt ? new Date(record.expiresAt).getTime() : 0;
        if (expiresAt > Date.now()) {
          isMatch = true;
          // Mark OTP as verified
          await otpsCol.updateOne({ email: recipientEmail }, { $set: { verified: true } });
        }
      }
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid or expired One-Time Verification Password (OTP). Please request a new code.' },
        { status: 400 }
      );
    }

    // Update user record in MongoDB to set ID verification flags
    if (db) {
      const userCol = db.collection('users');
      await userCol.updateOne(
        { email: recipientEmail },
        {
          $set: {
            isVerified: true,
            isVerifiedStudent: true,
            idVerifiedAt: new Date().toISOString(),
            verificationMethod: 'BREVO_API_KEY_OTP',
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'ID Verification successful! Your account status is now verified.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'OTP verification failed' }, { status: 500 });
  }
}
