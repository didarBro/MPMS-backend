"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
async function start() {
    try {
        await db_1.prisma.$connect();
        console.log("Database connected");
        app_1.default.listen(env_1.env.port, () => {
            console.log(`Server running on http://localhost:${env_1.env.port} [${env_1.env.nodeEnv}]`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        await db_1.prisma.$disconnect();
        process.exit(1);
    }
}
process.on("SIGTERM", async () => {
    await db_1.prisma.$disconnect();
    process.exit(0);
});
process.on("SIGINT", async () => {
    await db_1.prisma.$disconnect();
    process.exit(0);
});
start();
//# sourceMappingURL=server.js.map