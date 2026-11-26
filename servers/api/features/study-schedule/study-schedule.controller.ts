import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createStudyScheduleService } from "./study-schedule.service.js";

type ApiResponse = Pick<Response, "json" | "status">;
const bearer = (request: Request): string | undefined => {
  const value = request.header("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : undefined;
};
const idParam = (request: Request): string => Array.isArray(request.params.id) ? request.params.id[0] ?? "" : request.params.id ?? "";
const sendError = (response: ApiResponse, cause: unknown): void => {
  const message = cause instanceof Error ? cause.message : "Study schedule service unavailable.";
  const status = cause instanceof ZodError ? 400
    : message.includes("session is required") || message.includes("session is invalid") ? 401
      : message.includes("was not found") ? 404
        : message.includes("Exam date must") ? 400 : 503;
  response.status(status).json({ message, ...(cause instanceof ZodError ? { issues: cause.issues } : {}) });
};

export const createStudyScheduleController = (service: ReturnType<typeof createStudyScheduleService>, adminApiKey?: string) => ({
  getSchedule: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.getSchedule(bearer(request))); } catch (cause) { sendError(response, cause); }
  },
  updateSettings: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.updateSettings(bearer(request), request.body)); } catch (cause) { sendError(response, cause); }
  },
  replaceSchedule: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.replaceSchedule(bearer(request), request.body)); } catch (cause) { sendError(response, cause); }
  },
  updateAssignment: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.updateAssignment(bearer(request), idParam(request), request.body)); } catch (cause) { sendError(response, cause); }
  },
  deleteAssignment: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.deleteAssignment(bearer(request), idParam(request))); } catch (cause) { sendError(response, cause); }
  },
  rebalance: async (request: Request, response: ApiResponse): Promise<void> => {
    try { response.json(await service.rebalanceSchedule(bearer(request), request.body)); } catch (cause) { sendError(response, cause); }
  },
  adminAssignments: async (request: Request, response: ApiResponse): Promise<void> => {
    if (!service.isAdminKeyValid(request.header("x-admin-api-key"), adminApiKey)) { response.status(401).json({ message: "Valid admin API key required." }); return; }
    try { response.json(await service.getAdminAssignments()); } catch (cause) { sendError(response, cause); }
  }
});
