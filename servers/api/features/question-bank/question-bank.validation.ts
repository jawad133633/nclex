import { z } from "zod";

export const questionInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  subjectId: z.string().trim().min(1).max(80),
  subjectName: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(240),
  stem: z.string().trim().min(1).max(12_000),
  type: z.enum(["Multiple Choice", "Select All That Apply", "Priority Action"]),
  options: z.array(z.string().trim().min(1).max(1_000)).min(2).max(12),
  correctIndex: z.number().int().min(0),
  correctIndices: z.array(z.number().int().min(0)).optional(),
  rationale: z.string().trim().max(8_000).default(""),
  status: z.enum(["Published", "Draft", "Needs review"]).default("Published"),
  isPaid: z.boolean().default(false),
  author: z.string().trim().min(1).max(120).default("Content Admin Team")
}).superRefine((question, context) => {
  if (question.correctIndex !== undefined && question.options && question.correctIndex >= question.options.length) context.addIssue({ code: "custom", path: ["correctIndex"], message: "Correct option must exist." });
  if (question.correctIndices && question.options && question.correctIndices.some((index) => index >= question.options.length)) context.addIssue({ code: "custom", path: ["correctIndices"], message: "Every correct option must exist." });
});

export const answerInputSchema = z.object({ selectedIndex: z.number().int().min(0) });
export const paymentVerificationSchema = z.discriminatedUnion("paymentStatus", [
  z.object({
    paymentStatus: z.literal("paid"),
    paidUntil: z.coerce.date().refine((value) => value > new Date(), "A paid entitlement needs a future expiry date."),
    paymentReference: z.string().trim().min(4).max(200)
  }),
  z.object({ paymentStatus: z.literal("unpaid") })
]);
export type QuestionInput = z.output<typeof questionInputSchema>;
