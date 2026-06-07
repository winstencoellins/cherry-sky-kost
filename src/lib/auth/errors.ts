export function isDeactivatedAuthError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as Record<string, unknown>;
  const code = record.code ?? record.errorCode;
  return code === "ACCOUNT_DEACTIVATED";
}
