import { z } from "zod";
import type { ValidatedWebEnvironment } from "@/types";

export const webEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://127.0.0.1:4000")
}) satisfies z.ZodType<ValidatedWebEnvironment>;

export const validateWebEnvironment = (input: unknown): ValidatedWebEnvironment =>
  Object.freeze(webEnvironmentSchema.parse(input));
