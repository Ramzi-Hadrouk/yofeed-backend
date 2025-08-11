import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("tableforTestDatabaseConnection", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
 
});