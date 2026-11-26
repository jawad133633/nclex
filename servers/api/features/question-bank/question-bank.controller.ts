import type { Request, Response } from "express";
import { ZodError } from "zod";
import type { QuestionBankService } from "./question-bank.service.js";
import { answerInputSchema, testStateInputSchema } from "./question-bank.validation.js";

type ApiResponse = Pick<Response, "json" | "status">;
const getBearerToken = (request: Request): string | undefined => {
  const authorization = request.header("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
};
const getAdminKey = (request: Request): string | undefined => request.header("x-admin-api-key");
const reportError = (response: ApiResponse, cause: unknown): void => {
  if (cause instanceof ZodError) { response.status(400).json({ message: "Invalid question data.", issues: cause.issues }); return; }
  const message = cause instanceof Error ? cause.message : "Question service unavailable.";
  const status = message.includes("session is required") || message.includes("session is invalid") ? 401
    : message.includes("not assigned") ? 403
      : message.includes("not found") ? 404
      : message.includes("verified active payment") ? 402
        : message.includes("already been answered") ? 409
          : message.includes("Only ") ? 422
            : message.includes("Selected answer is invalid") ? 400 : 503;
  response.status(status).json({ message });
};

export const createQuestionBankController = (service: QuestionBankService) => ({
  createStudentSession: async (_request: Request, response: ApiResponse): Promise<void> => {
    try { response.status(201).json(await service.createStudentSession()); } catch (cause) { reportError(response, cause); }
  },
  adminQuestions: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try { response.json(await service.getAdminQuestions()); } catch (cause) { reportError(response, cause); }
  },
  createQuestion: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try { response.status(201).json(await service.createQuestion(request.body)); } catch (cause) { reportError(response, cause); }
  },
  updateQuestion: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try {
      const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
      const result = await service.updateQuestion(id, request.body);
      if (!result) { response.status(404).json({ message: "Question not found." }); return; }
      response.json(result);
    } catch (cause) { reportError(response, cause); }
  },
  deleteQuestion: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try {
      const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
      if (!await service.deleteQuestion(id)) { response.status(404).json({ message: "Question not found." }); return; }
      response.json({ message: "Question deleted." });
    } catch (cause) { reportError(response, cause); }
  },
  assignmentReport: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try { response.json(await service.getAssignmentReport()); } catch (cause) { reportError(response, cause); }
  },
  adminStudents: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try { response.json(await service.getAdminStudents()); } catch (cause) { reportError(response, cause); }
  },
  setStudentPayment: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(getAdminKey(request))) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try {
      const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
      if (!await service.setStudentPayment(id, request.body)) { response.status(404).json({ message: "Student account not found." }); return; }
      response.json({ message: "Verified payment status saved." });
    } catch (cause) { reportError(response, cause); }
  },
  studentQuestions: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.getStudentQuestions(getBearerToken(request))); } catch (cause) { reportError(response, cause); }
  },
  answerQuestion: async (request: Request, response: ApiResponse): Promise<void> => {
    const parsed = answerInputSchema.safeParse(request.body);
    if (!parsed.success) { response.status(400).json({ message: "Invalid answer." }); return; }
    try {
      const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
      response.json(await service.answerQuestion(getBearerToken(request), id, parsed.data.selectedIndex));
    } catch (cause) { reportError(response, cause); }
  },
  testOptions: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.getTestOptions(getBearerToken(request))); } catch (cause) { reportError(response, cause); }
  },
  createTest: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.status(201).json(await service.createTest(getBearerToken(request), request.body)); } catch (cause) { reportError(response, cause); }
  },
  getTest: async (request: Request, response: ApiResponse): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
    try { response.json(await service.getTest(getBearerToken(request), id)); } catch (cause) { reportError(response, cause); }
  },
  submitTestAnswer: async (request: Request, response: ApiResponse): Promise<void> => {
    const testId = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
    const questionId = Array.isArray(request.params.questionId) ? request.params.questionId[0] ?? "" : request.params.questionId ?? "";
    try { response.json(await service.submitTestAnswer(getBearerToken(request), testId, questionId, request.body)); } catch (cause) { reportError(response, cause); }
  },
  updateQuestionStatus: async (request: Request, response: ApiResponse): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
    try { response.json(await service.updateQuestionStatus(getBearerToken(request), id, request.body)); } catch (cause) { reportError(response, cause); }
  },
  setTestState: async (request: Request, response: ApiResponse): Promise<void> => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
    const parsed = testStateInputSchema.safeParse(request.body);
    if (!parsed.success) { response.status(400).json({ message: "Invalid test state.", issues: parsed.error.issues }); return; }
    const draft = parsed.data.currentQuestionId && parsed.data.draftSelectedIndices
      ? { questionId: parsed.data.currentQuestionId, selectedIndices: parsed.data.draftSelectedIndices }
      : undefined;
    try { response.json(await service.setTestState(getBearerToken(request), id, parsed.data.status, parsed.data.elapsedSeconds, draft)); } catch (cause) { reportError(response, cause); }
  }
});
