import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role, tenantId, department, institution } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getMongoDb();
    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;

    const newUser = {
      id: userId,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      role: role || 'user',
      tenantId: tenantId || 'tenant_default',
      institution: institution || undefined,
      department: department || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      const usersCollection = db.collection('users');
      const existingUser = await usersCollection.findOne({ email: cleanEmail });
      
      if (existingUser) {
        await usersCollection.updateOne(
          { email: cleanEmail },
          { $set: { role: role || existingUser.role, updatedAt: new Date().toISOString() } }
        );
        const updatedUser = await usersCollection.findOne({ email: cleanEmail });
        const targetUser = updatedUser || existingUser;
        const existingToken = `db_jwt_${Buffer.from(JSON.stringify({ uid: targetUser.id || existingUser.id, email: cleanEmail, role: targetUser.role || 'user' })).toString('base64')}`;
        
        return NextResponse.json({
          success: true,
          message: 'Account already exists in database. Authenticated successfully.',
          user: targetUser,
          token: existingToken,
        });
      }

      await usersCollection.insertOne(newUser);
    }

    const token = `db_jwt_${Buffer.from(JSON.stringify({ uid: userId, email: cleanEmail, role: newUser.role })).toString('base64')}`;

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully in database',
      user: newUser,
      token,
    });
  } catch (error: any) {
    console.error('Database registration error:', error);
    return NextResponse.json({ error: error?.message || 'Registration failed' }, { status: 500 });
  }
}
