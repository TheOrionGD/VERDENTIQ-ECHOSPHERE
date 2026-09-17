import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getMongoDb();

    let userRecord: any = null;

    if (db) {
      const usersCollection = db.collection('users');
      userRecord = await usersCollection.findOne({ email: cleanEmail });

      if (!userRecord) {
        // Create user in database on first login
        const newId = `usr_${Math.random().toString(36).substring(2, 9)}`;
        const newUser = {
          id: newId,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          role: role || 'user',
          tenantId: 'tenant_default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await usersCollection.insertOne(newUser);
        userRecord = newUser;
      } else if (role && userRecord.role !== role) {
        await usersCollection.updateOne(
          { email: cleanEmail },
          { $set: { role, updatedAt: new Date().toISOString() } }
        );
        userRecord.role = role;
      }
    } else {
      // Local database fallback representation
      userRecord = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        role: role || 'user',
        tenantId: 'tenant_default',
        createdAt: new Date().toISOString(),
      };
    }

    // Mock token generated for local Next.js session
    const token = `db_jwt_${Buffer.from(JSON.stringify({ uid: userRecord.id, email: userRecord.email, role: userRecord.role })).toString('base64')}`;

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully via Database Auth',
      user: userRecord,
      token,
    });
  } catch (error: any) {
    console.error('Database login error:', error);
    return NextResponse.json({ error: error?.message || 'Authentication failed' }, { status: 500 });
  }
}
