import morgan from "morgan";
import { env } from "./env";

export const logger = morgan(env.nodeEnv === "production" ? "combined" : "dev");
