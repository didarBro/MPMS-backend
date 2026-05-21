"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const project_schema_js_1 = require("./project.schema.js");
const project_controller_js_1 = require("./project.controller.js");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_js_1.authenticate, project_controller_js_1.listProjects);
router.get("/:id", auth_middleware_js_1.authenticate, project_controller_js_1.getProject);
router.post("/", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(project_schema_js_1.createProjectSchema), project_controller_js_1.createProject);
router.patch("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(project_schema_js_1.updateProjectSchema), project_controller_js_1.updateProject);
router.delete("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), project_controller_js_1.deleteProject);
exports.default = router;
//# sourceMappingURL=index.js.map