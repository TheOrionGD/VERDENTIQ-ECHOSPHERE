import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const db = await getMongoDb();
    if (db) {
      const col = db.collection('notifications');
      const query = userId ? { $or: [{ userId }, { userId: 'global' }] } : {};
      const notifications = await col.find(query).sort({ timestamp: -1 }).limit(30).toArray();
      return NextResponse.json({ success: true, notifications });
    }

    return NextResponse.json({ success: true, notifications: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getMongoDb();
    if (db) {
      const col = db.collection('notifications');
      const notif = {
        ...body,
        id: body.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        read: false,
        timestamp: new Date().toISOString(),
      };
      await col.insertOne(notif);
      return NextResponse.json({ success: true, notification: notif });
    }
    return NextResponse.json({ success: true, note: 'Local mode active' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, read } = body;
    const db = await getMongoDb();
    if (db && id) {
      const col = db.collection('notifications');
      await col.updateOne({ id }, { $set: { read: read ?? true } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true, note: 'Local mode active' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
