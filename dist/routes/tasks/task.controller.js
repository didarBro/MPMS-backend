"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttachment = exports.uploadAttachment = exports.deleteTask = exports.patchTaskStatus = exports.updateTask = exports.createTask = exports.getTask = exports.listTasks = void 0;
const task_service_1 = require("./task.service");
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
exports.listTasks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { projectId, sprintId, assigneeId, status, priority, search } = req.query;
    const tasks = await task_service_1.taskService.list({ projectId, sprintId, assigneeId, status, priority, search });
    (0, response_1.sendSuccess)(res, tasks);
});
exports.getTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const task = await task_service_1.taskService.findById(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, task);
});
exports.createTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const task = await task_service_1.taskService.create(req.body, user.id);
    (0, response_1.sendSuccess)(res, task, "Task created", 201);
});
exports.updateTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const task = await task_service_1.taskService.update(String(req.params["id"]), req.body);
    (0, response_1.sendSuccess)(res, task, "Task updated");
});
exports.patchTaskStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const task = await task_service_1.taskService.updateStatus(String(req.params["id"]), req.body);
    (0, response_1.sendSuccess)(res, task, "Status updated");
});
exports.deleteTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await task_service_1.taskService.remove(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, null, "Task deleted");
});
exports.uploadAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
    }
    const attachment = await task_service_1.taskService.addAttachment(String(req.params["id"]), file);
    (0, response_1.sendSuccess)(res, attachment, "Attachment uploaded", 201);
});
exports.deleteAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await task_service_1.taskService.removeAttachment(String(req.params["id"]), String(req.params["attachmentId"]));
    (0, response_1.sendSuccess)(res, null, "Attachment deleted");
});
//# sourceMappingURL=task.controller.js.map