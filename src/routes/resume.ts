import { Router } from "express";
import { db, profileTable, experienceTable, educationTable, skillsTable, projectsTable, achievementsTable } from "@workspace/db";
import { asc } from "drizzle-orm";

export const resumeRouter = Router();

resumeRouter.get("/data", async (req, res) => {
  const [profile, experience, education, skills, projects, achievements] = await Promise.all([
    db.select().from(profileTable).limit(1),
    db.select().from(experienceTable).orderBy(asc(experienceTable.sortOrder)),
    db.select().from(educationTable).orderBy(asc(educationTable.sortOrder)),
    db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder)),
    db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder)),
    db.select().from(achievementsTable).orderBy(asc(achievementsTable.sortOrder)),
  ]);

  return res.json({
    profile: profile[0] ?? null,
    experience: experience.map(r => ({ ...r, highlights: r.highlights ?? [], current: r.current ?? false })),
    education,
    skills,
    projects: projects.map(r => ({ ...r, techStack: r.techStack ?? [], featured: r.featured ?? false })),
    achievements,
  });
});
