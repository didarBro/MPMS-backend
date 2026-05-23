"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.addComment = exports.listComments = exports.deleteAttachment = exports.uploadAttachment = exports.deleteTask = exports.patchTaskStatus = exports.updateTask = exports.createTask = exports.getTask = exports.listTasks = void 0;
const task_service_1 = require("./task.service");
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const ApiError_1 = require("../../utils/ApiError");
exports.listTasks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { projectId, sprintId, assigneeId, status, priority, search } = req.query;
    const tasks = await task_service_1.taskService.list({ projectId, sprintId, assigneeId, status, priority, search });
    (0, response_1.sendSuccess)(res, tasks);
});
exports.getTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const task = await task_service_1.taskService.findById(String(req.params["id"]), user.id, user.role);
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
    const user = req.user;
    const task = await task_service_1.taskService.updateStatus(String(req.params["id"]), req.body, user.id, user.role);
    (0, response_1.sendSuccess)(res, task, "Status updated");
});
exports.deleteTask = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await task_service_1.taskService.remove(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, null, "Task deleted");
});
exports.uploadAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file)
        throw new ApiError_1.ApiError(400, "No file provided");
    const user = req.user;
    const attachment = await task_service_1.taskService.addAttachment(String(req.params["id"]), file, user.id);
    (0, response_1.sendSuccess)(res, attachment, "Attachment uploaded", 201);
});
exports.deleteAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    await task_service_1.taskService.removeAttachment(String(req.params["id"]), String(req.params["attachmentId"]), user.id);
    (0, response_1.sendSuccess)(res, null, "Attachment deleted");
});
exports.listComments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const comments = await task_service_1.taskService.listComments(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, comments);
});
exports.addComment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const { content, parentId } = req.body;
    if (!content?.trim())
        throw new ApiError_1.ApiError(400, "Comment content is required");
    const comment = await task_service_1.taskService.addComment(String(req.params["id"]), user.id, {
        content: content.trim(),
        parentId,
    });
    (0, response_1.sendSuccess)(res, comment, "Comment added", 201);
});
exports.deleteComment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    await task_service_1.taskService.removeComment(String(req.params["commentId"]), user.id, user.role);
    (0, response_1.sendSuccess)(res, null, "Comment deleted");
});
//# sourceMappingURL=task.controller.js.map