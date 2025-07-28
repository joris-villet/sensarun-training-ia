import { integer, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  google_id: text('google_id').unique(),
  name: text('name'),
  email: text('email').notNull().unique(),
  picture: text('picture'),
  first_connection: boolean().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
