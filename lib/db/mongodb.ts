import mongoose from "mongoose";

declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    activeUri: string | null;
  };
}

let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null, activeUri: null };
}

export class DatabaseError extends Error {
  userMessage: string;

  constructor(message: string, userMessage: string) {
    super(message);
    this.name = "DatabaseError";
    this.userMessage = userMessage;
  }
}

const PRIMARY_URI = process.env.MONGODB_URI;
const LOCAL_URI =
  process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/frameforge";
const SERVER_SELECTION_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS || 4000);

const LOCAL_FALLBACK_NOTE =
  "MongoDB Atlas couldn’t be reached — your current IP is probably not whitelisted. " +
  "Open your Atlas cluster → Network Access → Add IP Address and add your current IP (or 0.0.0.0/0 for dev). " +
  "The app also tried the local MongoDB fallback at mongodb://127.0.0.1:27017/frameforge, which was unreachable. " +
  "Start a local MongoDB (e.g. MongoDB Compass or `mongod`) to keep working without Atlas.";

/**
 * Return a short, user-facing message for a thrown DB error.
 * Safe to send straight to the client.
 */
export function dbErrorMessage(error: unknown): string {
  if (error instanceof DatabaseError) return error.userMessage;
  return "The database is unreachable. Please try again in a moment.";
}

export function getActiveDbUri(): string | null {
  return cached.activeUri;
}

function candidates(): string[] {
  const uris: string[] = [];
  if (PRIMARY_URI) uris.push(PRIMARY_URI);
  if (LOCAL_URI && LOCAL_URI !== PRIMARY_URI) uris.push(LOCAL_URI);
  return uris;
}

async function attemptConnection(uris: string[]) {
  let lastError: unknown;
  let triedAtlas = false;
  let triedLocal = false;

  for (const uri of uris) {
    if (uri.includes("mongodb.net") || uri.startsWith("mongodb+srv://")) {
      triedAtlas = true;
    } else {
      triedLocal = true;
    }

    try {
      const instance = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        socketTimeoutMS: 30000,
      });
      cached.activeUri = uri;
      return instance;
    } catch (error) {
      lastError = error;
      if (mongoose.connection.readyState !== 0) {
        try {
          await mongoose.disconnect();
        } catch {
          // Ignore — we're already moving to the next backend.
        }
      }
    }
  }

  let userMessage = "Couldn’t connect to any database backend.";
  if (triedAtlas) {
    userMessage = LOCAL_FALLBACK_NOTE;
  } else if (triedLocal) {
    userMessage =
      "The local MongoDB at mongodb://127.0.0.1:27017/frameforge is unreachable. " +
      "Start a local MongoDB (e.g. MongoDB Compass or `mongod`) to continue.";
  }

  throw new DatabaseError(
    String(lastError instanceof Error ? lastError.message : lastError),
    userMessage
  );
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uris = candidates();
    if (uris.length === 0) {
      throw new DatabaseError(
        "MONGODB_URI is not defined.",
        "Database is not configured. Add MONGODB_URI to your .env.local file."
      );
    }
    cached.promise = attemptConnection(uris);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.activeUri = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
