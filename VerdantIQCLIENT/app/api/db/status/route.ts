import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoDbConfigured } from '@/lib/mongodb';
import { isFirebaseConfigured } from '@/lib/firebase';

export async function GET(req: NextRequest) {
  const mongoConfigured = isMongoDbConfigured();
  let mongoConnected = false;
  let mongoError = null;

  if (mongoConfigured) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.command({ ping: 1 });
        mongoConnected = true;
      }
    } catch (err: any) {
      mongoError = err.message || 'Failed to ping MongoDB';
    }
  }

  const firebaseConfigured = isFirebaseConfigured();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    mongodb: {
      configured: mongoConfigured,
      connected: mongoConnected,
      dbName: process.env.MONGODB_DB_NAME || 'verdantiq',
      error: mongoError,
    },
    firebase: {
      configured: firebaseConfigured,
      providers: ['email_password', 'google', 'outlook_microsoft'],
    },
  });
}
