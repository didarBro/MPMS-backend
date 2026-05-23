"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = void 0;
const report_service_1 = require("./report.service");
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
exports.getReports = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const [summary, projects, users] = await Promise.all([
        report_service_1.reportService.getSummary(),
        report_service_1.reportService.getProjectReports(),
        report_service_1.reportService.getUserReports(),
    ]);
    (0, response_1.sendSuccess)(res, { summary, projects, users });
});
//# sourceMappingURL=report.controller.js.map