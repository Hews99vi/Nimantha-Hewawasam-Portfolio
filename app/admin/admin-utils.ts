"use client";

export const TEMP_ID_PREFIX = "temp-";

export type ApiResult<T> = {
  success: boolean;
  message?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};

export function createTempId() {
  return `${TEMP_ID_PREFIX}${crypto.randomUUID()}`;
}

export function isTempId(id: string) {
  return id.startsWith(TEMP_ID_PREFIX);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function requestJson<T>(
  endpoint: string,
  options: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(endpoint, options);
  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.success) {
    const fieldMessage = result.fieldErrors
      ? Object.values(result.fieldErrors).flat().filter(Boolean).join(" ")
      : "";
    throw new Error(fieldMessage || result.message || "Request failed.");
  }

  return result;
}
