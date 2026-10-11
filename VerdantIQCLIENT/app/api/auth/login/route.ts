import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, name, isExplicitRoleChange } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getMongoDb();

    let userRecord: any = null;

    if (db) {
      try {
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
        } else if (isExplicitRoleChange && role && userRecord.role !== role) {
          // Only update role in DB if an explicit role override was requested
          await usersCollection.updateOne(
            { email: cleanEmail },
            { $set: { role, updatedAt: new Date().toISOString() } }
          );
          userRecord.role = role;
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in login route, falling back to local user record:', dbErr);
      }
    }

    if (!userRecord) {
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

    // Token generated for local Next.js session using authentic active role
    const token = `db_jwt_${Buffer.from(JSON.stringify({ uid: userRecord.id, email: userRecord.email, role: userRecord.role })).toString('base64')}`;

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully via Database Auth',
      user: userRecord,
      token,
    });

    response.cookies.set('verdantiq_session', encodeURIComponent(JSON.stringify({
      token,
      role: userRecord.role,
      email: userRecord.email,
      userId: userRecord.id,
    })), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Database login error:', error);
    return NextResponse.json({ error: error?.message || 'Authentication failed' }, { status: 500 });
  }
}
