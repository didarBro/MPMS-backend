"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = __importDefault(require("./auth/index.js"));
const index_js_2 = __importDefault(require("./projects/index.js"));
const index_js_3 = __importDefault(require("./sprints/index.js"));
const router = (0, express_1.Router)();
router.use("/auth", index_js_1.default);
router.use("/projects", index_js_2.default);
router.use("/sprints", index_js_3.default);
exports.default = router;
//# sourceMappingURL=index.js.map