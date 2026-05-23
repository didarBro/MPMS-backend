"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changeUserPassword = exports.updateUser = exports.createUser = exports.getUser = exports.listUsers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const user_service_1 = require("./user.service");
exports.listUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { search, role, department, isActive } = req.query;
    const users = await user_service_1.userService.list({ search, role, department, isActive });
    (0, response_1.sendSuccess)(res, users);
});
exports.getUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.userService.findById(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, user);
});
exports.createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.userService.create(req.body);
    (0, response_1.sendSuccess)(res, user, "User created", 201);
});
exports.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.userService.update(String(req.params["id"]), req.body);
    (0, response_1.sendSuccess)(res, user, "User updated");
});
exports.changeUserPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { password } = req.body;
    await user_service_1.userService.changePassword(String(req.params["id"]), password);
    (0, response_1.sendSuccess)(res, null, "Password updated");
});
exports.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await user_service_1.userService.remove(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, null, "User deleted");
});
//# sourceMappingURL=user.controller.js.map