const { spawnSync } = require("node:child_process");
require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log("Skipping seed: DATABASE_URL is not set.");
    return;
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      console.log(`Skipping seed: database already has ${userCount} user(s).`);
      return;
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log("Database is empty. Running seed once...");
  const result = spawnSync("npm", ["run", "prisma:seed"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main().catch((error) => {
  console.error("Failed to run seed-once check:", error);
  process.exit(1);
});
