import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

export function createDB(databaseUrl: string) {
  const client = postgres(databaseUrl, {
    // Configuration pour l'environnement serverless
    max: 1, // Une seule connexion par instance Worker
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}