import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.server') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'VerdantIQ';

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env.server');
}

let client = null;
let db = null;

export async function connectToDatabase() {
  if (db) return { client, db };

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB Atlas: [Database: ${dbName}]`);
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}
