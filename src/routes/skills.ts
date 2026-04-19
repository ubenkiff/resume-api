import { Router } from "express";
import { db, skillsTable, insertSkillSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

export const skillsRouter = Router();

skillsRouter.get("/", async (req, res) => {
  const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder));
  return res.json(rows.map(r => ({
    ...r,
    sortOrder: r.sortOrder ?? 0,
  })));
});

skillsRouter.post("/", async (req, res) => {
  const parsed = insertSkillSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const inserted = await db.insert(skillsTable).values(parsed.data).returning();
  return res.status(201).json(inserted[0]);
});

skillsRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertSkillSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await db.update(skillsTable).set(parsed.data).where(eq(skillsTable.id, id)).returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  return res.json(updated[0]);
});

skillsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(skillsTable).where(eq(skillsTable.id, id));
  return res.status(204).send();
});
