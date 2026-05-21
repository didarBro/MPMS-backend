"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const globalForPrisma = global;
function createPrismaClient() {
    const adapter = new adapter_pg_1.PrismaPg({ connectionString: env_1.env.databaseUrl });
    return new client_1.PrismaClient({
        adapter,
        log: env_1.env.nodeEnv === "development" ? ["error", "warn"] : ["error"],
    });
}
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (env_1.env.nodeEnv !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=db.js.map