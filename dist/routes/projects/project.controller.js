"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.listProjects = void 0;
const project_service_js_1 = require("./project.service.js");
const catchAsync_js_1 = require("../../utils/catchAsync.js");
const response_js_1 = require("../../utils/response.js");
exports.listProjects = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const { status, client, search, myProjects } = req.query;
    const user = req.user;
    const userId = myProjects === "true" ? user.id : undefined;
    const projects = await project_service_js_1.projectService.list({ status, client, search, userId });
    (0, response_js_1.sendSuccess)(res, projects);
});
exports.getProject = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const project = await project_service_js_1.projectService.findById(String(req.params["id"]));
    (0, response_js_1.sendSuccess)(res, project);
});
exports.createProject = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const project = await project_service_js_1.projectService.create(req.body);
    (0, response_js_1.sendSuccess)(res, project, "Project created", 201);
});
exports.updateProject = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    const project = await project_service_js_1.projectService.update(String(req.params["id"]), req.body);
    (0, response_js_1.sendSuccess)(res, project, "Project updated");
});
exports.deleteProject = (0, catchAsync_js_1.catchAsync)(async (req, res) => {
    await project_service_js_1.projectService.remove(String(req.params["id"]));
    (0, response_js_1.sendSuccess)(res, null, "Project deleted");
});
//# sourceMappingURL=project.controller.js.map