import { Router } from "express";
import { db, profileTable, experienceTable, educationTable, skillsTable, projectsTable, achievementsTable, insertProfileSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

export const profileRouter = Router();

profileRouter.get("/", async (req, res) => {
  const rows = await db.select().from(profileTable).limit(1);
  if (rows.length === 0) {
    return res.status(404).json({ error: "No profile found" });
  }
  const p = rows[0];
  return res.json({
    ...p,
    avatarUrl: p.avatarUrl ?? undefined,
    location: p.location ?? undefined,
    email: p.email ?? undefined,
    phone: p.phone ?? undefined,
    website: p.website ?? undefined,
    linkedin: p.linkedin ?? undefined,
    github: p.github ?? undefined,
    twitter: p.twitter ?? undefined,
  });
});

profileRouter.put("/", async (req, res) => {
  const parsed = insertProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const existing = await db.select().from(profileTable).limit(1);
  let row;
  if (existing.length === 0) {
    const inserted = await db.insert(profileTable).values(parsed.data).returning();
    row = inserted[0];
  } else {
    const updated = await db.update(profileTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(profileTable.id, existing[0].id)).returning();
    row = updated[0];
  }
  return res.json(row);
});

profileRouter.get("/summary", async (req, res) => {
  const [exp, edu, skills, projects, achievements] = await Promise.all([
    db.select().from(experienceTable),
    db.select().from(educationTable),
    db.select().from(skillsTable),
    db.select().from(projectsTable),
    db.select().from(achievementsTable),
  ]);
  return res.json({
    experienceCount: exp.length,
    educationCount: edu.length,
    skillsCount: skills.length,
    projectsCount: projects.length,
    achievementsCount: achievements.length,
  });
});
