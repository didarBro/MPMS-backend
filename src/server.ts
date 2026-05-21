import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

async function start(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
