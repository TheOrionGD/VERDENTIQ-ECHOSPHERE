import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    const db = await getMongoDb();

    if (db) {
      const usersCollection = db.collection('users');
      const query: Record<string, any> = {};

      if (email) query.email = email.toLowerCase();
      if (role) query.role = role;

      const users = await usersCollection.find(query).toArray();
      return NextResponse.json({ success: true, count: users.length, users });
    }

    return NextResponse.json({ success: true, count: 0, users: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getMongoDb();

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (db) {
      const usersCollection = db.collection('users');
      const result = await usersCollection.insertOne({
        ...body,
        email: body.email.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, insertedId: result.insertedId });
    }

    return NextResponse.json({ success: true, note: 'Local mode active' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
