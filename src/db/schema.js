// /server/db/schema.js
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const supporters = pgTable('supporters', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    village: varchar('village', { length: 50 }).notNull(),
    contact: varchar('contact', { length: 15 }), // Optional
    comment: text('comment'), // Optional
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});