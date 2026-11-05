import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('email');
    const role = searchParams.get('role');

    const db = await getMongoDb();
    if (db) {
      const col = db.collection('activity_logs');
      let query: any = {};
      if (userEmail) {
        query.userEmail = userEmail;
      } else if (userId) {
        query.$or = [{ userId }, { householdId: userId }];
      } else if (role === 'student') {
        query.userEmail = 'student@institution.org';
      } else if (role === 'household' || role === 'user') {
        query.userEmail = 'user@verdantiq.org';
      }

      const logs = await col.find(query).sort({ timestamp: -1 }).limit(100).toArray();
      return NextResponse.json({ success: true, activityLogs: logs });
    }

    return NextResponse.json({ success: true, activityLogs: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getMongoDb();
    if (db) {
      const col = db.collection('activity_logs');
      const item = {
        ...body,
        id: body.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      await col.insertOne(item);
      return NextResponse.json({ success: true, activity: item });
    }
    return NextResponse.json({ success: true, note: 'Local mode active' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
