import { integer, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  google_id: text('google_id').unique(),
  name: text('name'),
  email: text('email').notNull().unique(),
  picture: text('picture'),
  first_connection: boolean().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});


// New table: profileQuestions
export const profileQuestions = pgTable('profile_questions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question: text('question').notNull(),
  type: text('type').notNull(),        // e.g. 'text', 'number', 'choice'
  fieldKey: text('field_key').notNull().unique(), // e.g. 'max_hr', 'age'
  required: boolean('required').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// New table: profileAnswers
export const profileAnswers = pgTable('profile_answers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: integer('question_id')
    .notNull()
    .references(() => profileQuestions.id, { onDelete: 'cascade' }),
  value: text('value').notNull(), // could also use `json` if answers vary
  createdAt: timestamp('created_at').defaultNow(),
});
