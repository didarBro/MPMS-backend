"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSprints = exports.deleteSprint = exports.updateSprint = exports.createSprint = exports.listProjectSprints = exports.listSprints = void 0;
const sprint_service_js_1 = require("./sprint.service.js");
const catchAsync_js_1 = require("../../utils/catchAsync.js");
const response_js_1 = require("../../utils/response.js");
// GET /sprints?projectId=&status=
exports.listSprints = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const { projectId, status } = req.query;
    const sprints = await sprint_service_js_1.sprintService.list({ projectId, status });
    (0, response_js_1.sendSuccess)(res, sprints);
});
// GET /projects/:projectId/sprints
exports.listProjectSprints = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const sprints = await sprint_service_js_1.sprintService.listByProject(String(req.params["projectId"]));
    (0, response_js_1.sendSuccess)(res, sprints);
});
// POST /projects/:projectId/sprints
exports.createSprint = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const sprint = await sprint_service_js_1.sprintService.create(String(req.params["projectId"]), req.body);
    (0, response_js_1.sendSuccess)(res, sprint, "Sprint created", 201);
});
// PATCH /sprints/:id
exports.updateSprint = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const sprint = await sprint_service_js_1.sprintService.update(String(req.params["id"]), req.body);
    (0, response_js_1.sendSuccess)(res, sprint, "Sprint updated");
});
// DELETE /sprints/:id
exports.deleteSprint = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    await sprint_service_js_1.sprintService.remove(String(req.params["id"]));
    (0, response_js_1.sendSuccess)(res, null, "Sprint deleted");
});
// PATCH /projects/:projectId/sprints/reorder
exports.reorderSprints = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    await sprint_service_js_1.sprintService.reorder(String(req.params["projectId"]), req.body);
    (0, response_js_1.sendSuccess)(res, null, "Sprints reordered");
});
//# sourceMappingURL=sprint.controller.js.map