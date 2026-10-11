import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'verdantiq';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // Allow global Mongo client cache in development to prevent connection leaks
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 4000,
  connectTimeoutMS: 4000,
};

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoDbConfigured()) {
    return null;
  }

  const mongoUri = process.env.MONGODB_URI as string;

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(mongoUri, MONGO_OPTIONS);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(mongoUri, MONGO_OPTIONS);
        clientPromise = client.connect();
      }
    }

    const connectedClient = await clientPromise;
    return connectedClient;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = undefined;
    }
    clientPromise = null;
    return null;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db(dbName);
}
