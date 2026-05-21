"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(env_1.env.nodeEnv === "development" && { stack: err.stack }),
        });
        return;
    }
    if (err.name === "PrismaClientKnownRequestError") {
        const prismaErr = err;
        if (prismaErr.code === "P2002") {
            res.status(409).json({
                success: false,
                message: `A record with that ${prismaErr.meta?.target?.join(", ") ?? "value"} already exists`,
            });
            return;
        }
    }
    if (err.name === "JsonWebTokenError") {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
    }
    if (err.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token expired" });
        return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(env_1.env.nodeEnv === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map