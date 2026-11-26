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
  router.get("/student/test-options", controller.testOptions);
  router.post("/student/tests", controller.createTest);
  router.get("/student/tests/:id", controller.getTest);
  router.post("/student/tests/:id/questions/:questionId/answer", controller.submitTestAnswer);
  router.patch("/student/tests/:id/state", controller.setTestState);
  router.patch("/student/questions/:id/status", controller.updateQuestionStatus);
  return router;
};
