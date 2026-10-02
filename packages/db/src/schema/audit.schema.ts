import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
