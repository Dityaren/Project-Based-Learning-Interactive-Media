import { db } from "./index";
import { auditLog } from "./schema";

export async function logAudit(e: typeof auditLog.$inferInsert) {
  await db.insert(auditLog).values(e);
}
