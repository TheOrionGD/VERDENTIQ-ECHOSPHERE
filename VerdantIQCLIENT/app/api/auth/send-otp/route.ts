import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// Fallback in-memory OTP store if MongoDB is initializing
const memoryOtpStore = new Map<string, { otp: string; expiresAt: number; name?: string }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, purpose = 'ID Verification' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const recipientEmail = email.toLowerCase().trim();
    const recipientName = name || recipientEmail.split('@')[0];

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save to database / store
    const db = await getMongoDb();
    if (db) {
      const otpsCol = db.collection('otps');
      await otpsCol.updateOne(
        { email: recipientEmail },
        {
          $set: {
            email: recipientEmail,
            otp: otpCode,
            purpose,
            expiresAt: new Date(expiresAt),
            createdAt: new Date(),
            verified: false,
          },
        },
        { upsert: true }
      );
    } else {
      memoryOtpStore.set(recipientEmail, { otp: otpCode, expiresAt, name: recipientName });
    }

    // Call Brevo REST API to send One-Time Verification Password (OTP) email
    const brevoApiKey = process.env.BREVO_API_KEY;
    let brevoStatus = 'not_configured';
    let brevoResponseData: any = null;

    if (brevoApiKey && brevoApiKey.trim().length > 0) {
      try {
        const senderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@verdantiq.org';
        const senderName = 'Verdantiq Verification System';

        const brevoPayload = {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: recipientEmail, name: recipientName }],
          subject: `Verdantiq One-Time Verification Password (OTP) - ${purpose}`,
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0a09; color: #f5f5f4; margin: 0; padding: 20px; }
                .card { max-width: 550px; margin: 20px auto; background-color: #1c1917; border: 1px solid #059669; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                .logo { color: #10b981; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
                .title { font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 12px; }
                .desc { font-size: 14px; color: #a8a29e; line-height: 1.6; margin-bottom: 24px; }
                .otp-box { background-color: #064e3b; border: 2px solid #10b981; color: #ecfdf5; font-size: 36px; font-weight: 800; letter-spacing: 8px; text-align: center; padding: 18px; border-radius: 12px; margin: 20px 0; }
                .footer { font-size: 12px; color: #78716c; text-align: center; margin-top: 24px; border-t: 1px solid #292524; padding-top: 16px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">🌿 VerdantIQ Verification</div>
                <div class="title">Your One-Time Verification Password</div>
                <div class="desc">
                  Hello <strong>${recipientName}</strong>,<br>
                  Use the following 6-digit One-Time Verification Password (OTP) to complete your <strong>${purpose}</strong>.
                </div>
                <div class="otp-box">${otpCode}</div>
                <div class="desc" style="text-align: center;">
                  This verification code is valid for <strong>10 minutes</strong>. Do not share this password with anyone.
                </div>
                <div class="footer">
                  Sent via Brevo Transactional Mail API for Verdantiq Institutional Identity Verification.
                </div>
              </div>
            </body>
            </html>
          `,
        };

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': brevoApiKey.trim(),
          },
          body: JSON.stringify(brevoPayload),
        });

        brevoResponseData = await res.json().catch(() => ({}));
        if (res.ok) {
          brevoStatus = 'sent';
        } else {
          console.error('Brevo API email sending error:', brevoResponseData);
          brevoStatus = 'failed';
        }
      } catch (err: any) {
        console.error('Brevo API fetch exception:', err);
        brevoStatus = 'error';
      }
    }

    return NextResponse.json({
      success: true,
      message: `One-Time Verification Password (OTP) sent to ${recipientEmail}.`,
      brevoStatus,
      brevoResponse: brevoResponseData,
      // For local development testing when key is not set
      devOtpHint: !brevoApiKey ? otpCode : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send verification OTP' }, { status: 500 });
  }
}
