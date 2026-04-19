import { Router } from "express";
import { db, projectsTable, insertProjectSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

export const projectsRouter = Router();

projectsRouter.get("/", async (req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
  return res.json(rows.map(r => ({
    ...r,
    techStack: r.techStack ?? [],
    liveUrl: r.liveUrl ?? undefined,
    githubUrl: r.githubUrl ?? undefined,
    imageUrl: r.imageUrl ?? undefined,
    featured: r.featured ?? false,
    sortOrder: r.sortOrder ?? 0,
  })));
});

projectsRouter.post("/", async (req, res) => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const inserted = await db.insert(projectsTable).values(parsed.data).returning();
  return res.status(201).json(inserted[0]);
});

projectsRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await db.update(projectsTable).set(parsed.data).where(eq(projectsTable.id, id)).returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  return res.json(updated[0]);
});

projectsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  return res.status(204).send();
});
