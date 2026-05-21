"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = require("../../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../middleware/validate.middleware.js");
const sprint_schema_js_1 = require("./sprint.schema.js");
const sprint_controller_js_1 = require("./sprint.controller.js");
// Standalone sprint routes (mounted at /sprints)
const router = (0, express_1.Router)();
router.get("/", auth_middleware_js_1.authenticate, sprint_controller_js_1.listSprints);
router.patch("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), (0, validate_middleware_js_1.validate)(sprint_schema_js_1.updateSprintSchema), sprint_controller_js_1.updateSprint);
router.delete("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)("ADMIN"), sprint_controller_js_1.deleteSprint);
exports.default = router;
//# sourceMappingURL=index.js.map