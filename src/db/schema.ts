import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar ("email", {length: 100}).notNull().unique(),
  password: varchar("password", {length:255}).notNull(),
  profilePicUrl: varchar("profile_pic_url", {length:255}),
  bio: varchar("bio", {length:255}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// type inference

export type User = typeof users.$inferSelect;
