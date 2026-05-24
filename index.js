const { spawnSync } = require("node:child_process");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.NODE_ENV === "production") {
  run("npx", ["prisma", "migrate", "deploy"]);
  run("node", ["scripts/seed-once.js"]);
}

require("./dist/server.js");
