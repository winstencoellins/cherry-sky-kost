import { getErrorMessage } from "@/features/admin/lib/errors";
import { toast } from "@/lib/toast";

export function showApiError(error: unknown, fallback: string) {
  toast.error(getErrorMessage(error, fallback));
}

export function showApiSuccess(message: string) {
  toast.success(message);
}
