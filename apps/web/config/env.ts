import {
  validateWebEnvironment
} from "@/validation/env.validation";
import type { ValidatedWebEnvironment, WebEnvironmentSource } from "@/types";

export const readWebEnvironment = (
  source?: WebEnvironmentSource
): ValidatedWebEnvironment => {
  const runtimeEnvironment = source ?? process.env;
  const defaultApiUrl = "http://127.0.0.1:4000";

  return validateWebEnvironment({
    NEXT_PUBLIC_API_BASE_URL: runtimeEnvironment.NEXT_PUBLIC_API_BASE_URL ?? defaultApiUrl
  });
};
