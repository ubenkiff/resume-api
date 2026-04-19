import { Router } from "express";
import { db, experienceTable, insertExperienceSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

export const experienceRouter = Router();

experienceRouter.get("/", async (req, res) => {
  const rows = await db.select().from(experienceTable).orderBy(asc(experienceTable.sortOrder));
  return res.json(rows.map(r => ({
    ...r,
    highlights: r.highlights ?? [],
    location: r.location ?? undefined,
    endDate: r.endDate ?? undefined,
    description: r.description ?? undefined,
    current: r.current ?? false,
    sortOrder: r.sortOrder ?? 0,
  })));
});

experienceRouter.post("/", async (req, res) => {
  const parsed = insertExperienceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const inserted = await db.insert(experienceTable).values(parsed.data).returning();
  return res.status(201).json(inserted[0]);
});

experienceRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertExperienceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await db.update(experienceTable).set(parsed.data).where(eq(experienceTable.id, id)).returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  return res.json(updated[0]);
});

experienceRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(experienceTable).where(eq(experienceTable.id, id));
  return res.status(204).send();
});
