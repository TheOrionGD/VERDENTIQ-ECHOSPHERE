import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, uid, email, name, role, tenantId, institution, department, provider, isVerifiedStudent } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userId = id || uid || `usr_${Math.random().toString(36).substring(2, 9)}`;
    const db = await getMongoDb();

    const userData = {
      id: userId,
      firebaseUid: uid || null,
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      role: role || 'user',
      tenantId: tenantId || 'tenant_default',
      institution: institution || (email.endsWith('.edu') ? 'Academic Partner' : undefined),
      department: department || undefined,
      provider: provider || 'email',
      isVerifiedStudent: isVerifiedStudent ?? (role === 'student' || email.endsWith('.edu')),
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      const usersCollection = db.collection('users');
      
      // Upsert into MongoDB as source of truth
      await usersCollection.updateOne(
        { email: email.toLowerCase() },
        {
          $set: userData,
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );

      const dbUser = await usersCollection.findOne({ email: email.toLowerCase() });
      return NextResponse.json({
        success: true,
        source: 'mongodb',
        user: dbUser,
      });
    }

    // Fallback response if MongoDB URI is not set yet
    return NextResponse.json({
      success: true,
      source: 'local_fallback',
      user: { ...userData, createdAt: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Error syncing user to MongoDB:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
