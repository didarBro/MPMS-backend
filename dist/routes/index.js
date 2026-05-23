"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = __importDefault(require("./auth/index.js"));
const index_js_2 = __importDefault(require("./projects/index.js"));
const index_js_3 = __importDefault(require("./sprints/index.js"));
const index_js_4 = __importDefault(require("./tasks/index.js"));
const index_js_5 = __importDefault(require("./users/index.js"));
const index_js_6 = __importDefault(require("./teams/index.js"));
const index_js_7 = __importDefault(require("./reports/index.js"));
const router = (0, express_1.Router)();
router.use("/auth", index_js_1.default);
router.use("/projects", index_js_2.default);
router.use("/sprints", index_js_3.default);
router.use("/tasks", index_js_4.default);
router.use("/users", index_js_5.default);
router.use("/teams", index_js_6.default);
router.use("/reports", index_js_7.default);
exports.default = router;
//# sourceMappingURL=index.js.map