import { Router } from "express";
import type { MongoDbIntegration } from "../../integrations/mongodb/types.js";
import { createQuestionBankController } from "./question-bank.controller.js";
import { createQuestionBankService } from "./question-bank.service.js";

export const createQuestionBankRoutes = (database: MongoDbIntegration, adminApiKey?: string): Router => {
  const router = Router();
  const controller = createQuestionBankController(createQuestionBankService(database, adminApiKey));
  router.post("/student-sessions", controller.createStudentSession);
  router.get("/admin/questions", controller.adminQuestions);
  router.post("/admin/questions", controller.createQuestion);
  router.patch("/admin/questions/:id", controller.updateQuestion);
  router.delete("/admin/questions/:id", controller.deleteQuestion);
  router.get("/admin/assignments", controller.assignmentReport);
  router.get("/admin/students", controller.adminStudents);
  router.patch("/admin/students/:id/payment", controller.setStudentPayment);
  router.get("/student/questions", controller.studentQuestions);
  router.post("/student/questions/:id/answer", controller.answerQuestion);
  return router;
};
