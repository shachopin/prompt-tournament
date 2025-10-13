import { InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'


//this file needs to be ts, otherwise npm run db:push will fail, it's looking for scheme.ts

export const prompts = pgTable('prompts', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  response: text('response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
