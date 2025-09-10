import { text, boolean, pgTable, serial, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull()
});

export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    eventName: text("event_name").notNull()
});

export const attendances = pgTable("attendances", {
    id: serial("id").primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    eventId: integer('event_id').references(() => events.id).notNull(),
    attended: boolean('attended').notNull().default(false)
});