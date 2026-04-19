import { Router } from "express";
import { db, educationTable, insertEducationSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

export const educationRouter = Router();

educationRouter.get("/", async (req, res) => {
  const rows = await db.select().from(educationTable).orderBy(asc(educationTable.sortOrder));
  return res.json(rows.map(r => ({
    ...r,
    field: r.field ?? undefined,
    location: r.location ?? undefined,
    endYear: r.endYear ?? undefined,
    description: r.description ?? undefined,
    sortOrder: r.sortOrder ?? 0,
  })));
});

educationRouter.post("/", async (req, res) => {
  const parsed = insertEducationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const inserted = await db.insert(educationTable).values(parsed.data).returning();
  return res.status(201).json(inserted[0]);
});

educationRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertEducationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await db.update(educationTable).set(parsed.data).where(eq(educationTable.id, id)).returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  return res.json(updated[0]);
});

educationRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(educationTable).where(eq(educationTable.id, id));
  return res.status(204).send();
});
