import { Router } from "express";
import { db, achievementsTable, insertAchievementSchema } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";

export const achievementsRouter = Router();

achievementsRouter.get("/recent", async (req, res) => {
  const rows = await db.select().from(achievementsTable).orderBy(desc(achievementsTable.date)).limit(5);
  return res.json(rows.map(r => ({
    ...r,
    issuer: r.issuer ?? undefined,
    description: r.description ?? undefined,
    url: r.url ?? undefined,
    sortOrder: r.sortOrder ?? 0,
  })));
});

achievementsRouter.get("/", async (req, res) => {
  const rows = await db.select().from(achievementsTable).orderBy(asc(achievementsTable.sortOrder));
  return res.json(rows.map(r => ({
    ...r,
    issuer: r.issuer ?? undefined,
    description: r.description ?? undefined,
    url: r.url ?? undefined,
    sortOrder: r.sortOrder ?? 0,
  })));
});

achievementsRouter.post("/", async (req, res) => {
  const parsed = insertAchievementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const inserted = await db.insert(achievementsTable).values(parsed.data).returning();
  return res.status(201).json(inserted[0]);
});

achievementsRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertAchievementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await db.update(achievementsTable).set(parsed.data).where(eq(achievementsTable.id, id)).returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  return res.json(updated[0]);
});

achievementsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(achievementsTable).where(eq(achievementsTable.id, id));
  return res.status(204).send();
});
