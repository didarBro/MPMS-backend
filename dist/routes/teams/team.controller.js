"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.updateTeamMemberRole = exports.addTeamMember = exports.deleteTeam = exports.updateTeam = exports.createTeam = exports.getTeam = exports.listTeams = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const team_service_1 = require("./team.service");
exports.listTeams = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { projectId, search } = req.query;
    const teams = await team_service_1.teamService.list({ projectId, search });
    (0, response_1.sendSuccess)(res, teams);
});
exports.getTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const team = await team_service_1.teamService.findById(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, team);
});
exports.createTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const team = await team_service_1.teamService.create(req.body);
    (0, response_1.sendSuccess)(res, team, "Team created", 201);
});
exports.updateTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const team = await team_service_1.teamService.update(String(req.params["id"]), req.body);
    (0, response_1.sendSuccess)(res, team, "Team updated");
});
exports.deleteTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await team_service_1.teamService.remove(String(req.params["id"]));
    (0, response_1.sendSuccess)(res, null, "Team deleted");
});
exports.addTeamMember = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const member = await team_service_1.teamService.addMember(String(req.params["id"]), req.body);
    (0, response_1.sendSuccess)(res, member, "Member added", 201);
});
exports.updateTeamMemberRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const member = await team_service_1.teamService.updateMemberRole(String(req.params["id"]), String(req.params["memberId"]), req.body);
    (0, response_1.sendSuccess)(res, member, "Role updated");
});
exports.removeTeamMember = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await team_service_1.teamService.removeMember(String(req.params["id"]), String(req.params["memberId"]));
    (0, response_1.sendSuccess)(res, null, "Member removed");
});
//# sourceMappingURL=team.controller.js.map