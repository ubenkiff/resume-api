import app from "./app";
import { logger } from "./lib/logger";

// For Vercel serverless deployment - export the app
export default app;

// For local development - listen on port
if (process.env.NODE_ENV !== 'production') {
  const rawPort = process.env["PORT"] || "3000";
  const port = Number(rawPort);
  
  if (Number.isNaN(port) || port <= 0) {
    logger.error({ rawPort }, "Invalid PORT value");
    process.exit(1);
  }
  
  app.listen(port, () => {
    logger.info({ port }, "Server listening locally");
  });
}