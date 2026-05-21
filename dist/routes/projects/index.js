"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const project_schema_js_1 = require("./project.schema.js");
const project_controller_js_1 = require("./project.controller.js");
const sprint_schema_js_1 = require("../sprints/sprint.schema.js");
const sprint_controller_js_1 = require("../sprints/sprint.controller.js");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_js_1.authenticate, project_controller_js_1.listProjects);
router.get("/:id", auth_middleware_js_1.authenticate, project_controller_js_1.getProject);
router.post("/", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(project_schema_js_1.createProjectSchema), project_controller_js_1.createProject);
router.patch("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(project_schema_js_1.updateProjectSchema), project_controller_js_1.updateProject);
router.delete("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), project_controller_js_1.deleteProject);
// Nested sprint routes
router.get("/:projectId/sprints", auth_middleware_js_1.authenticate, sprint_controller_js_1.listProjectSprints);
router.post("/:projectId/sprints", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(sprint_schema_js_1.createSprintSchema), sprint_controller_js_1.createSprint);
router.patch("/:projectId/sprints/reorder", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(sprint_schema_js_1.reorderSchema), sprint_controller_js_1.reorderSprints);
exports.default = router;
//# sourceMappingURL=index.js.map