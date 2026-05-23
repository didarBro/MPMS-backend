"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const report_controller_1 = require("./report.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, report_controller_1.getReports);
exports.default = router;
//# sourceMappingURL=index.js.map