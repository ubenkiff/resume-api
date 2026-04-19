import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { profileRouter } from "./profile";
import { experienceRouter } from "./experience";
import { educationRouter } from "./education";
import { skillsRouter } from "./skills";
import { projectsRouter } from "./projects";
import { achievementsRouter } from "./achievements";
import { resumeRouter } from "./resume";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/profile/summary", profileRouter);
router.use("/profile", profileRouter);
router.use("/experience", experienceRouter);
router.use("/education", educationRouter);
router.use("/skills", skillsRouter);
router.use("/projects", projectsRouter);
router.use("/achievements/recent", achievementsRouter);
router.use("/achievements", achievementsRouter);
router.use("/resume", resumeRouter);
router.use("/storage", storageRouter);

export default router;
