import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { InsertContactSubmission, contactSubmissions } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql);
  }
  return _db;
}

export async function insertContactSubmission(data: InsertContactSubmission) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL not configured");
  await db.insert(contactSubmissions).values(data);
}
