import { Router } from "express";
import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";
import { createStudyScheduleController } from "./study-schedule.controller.js";
import { createStudyScheduleService } from "./study-schedule.service.js";

export const createStudyScheduleRoutes = (database: MongoDbIntegration, adminApiKey?: string): Router => {
  const router = Router();
  const controller = createStudyScheduleController(createStudyScheduleService(database), adminApiKey);
  router.get("/student/study-schedule", controller.getSchedule);
  router.put("/student/study-schedule/settings", controller.updateSettings);
  router.put("/student/study-schedule", controller.replaceSchedule);
  router.patch("/student/study-schedule/assignments/:id", controller.updateAssignment);
  router.delete("/student/study-schedule/assignments/:id", controller.deleteAssignment);
  router.post("/student/study-schedule/rebalance", controller.rebalance);
  router.get("/admin/study-schedule/assignments", controller.adminAssignments);
  return router;
};
