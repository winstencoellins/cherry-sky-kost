import { env } from "@/env";
import { apiFetch } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import type {
  ApiDataResponse,
  PropertyAttachment,
  UnitTypeAttachment,
} from "@/lib/types/admin";

async function uploadAttachment(
  path: string,
  idField: string,
  id: string,
  file: File,
): Promise<void> {
  const form = new FormData();
  form.set(idField, id);
  form.set("file", file);

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw parseApiError(response.status, payload);
  }
}

export function uploadPropertyImage(
  propertyId: string,
  file: File,
): Promise<void> {
  return uploadAttachment(
    "/admin/attachments/property",
    "propertyId",
    propertyId,
    file,
  );
}

export function uploadUnitTypeImage(
  unitTypeId: string,
  file: File,
): Promise<void> {
  return uploadAttachment(
    "/admin/attachments/unit-type",
    "unitTypeId",
    unitTypeId,
    file,
  );
}

export async function deletePropertyAttachment(
  id: string,
): Promise<PropertyAttachment> {
  const res = await apiFetch<ApiDataResponse<PropertyAttachment>>(
    `/admin/attachments/property/${id}`,
    { method: "DELETE" },
  );
  return res.data;
}

export async function deleteUnitTypeAttachment(
  id: string,
): Promise<UnitTypeAttachment> {
  const res = await apiFetch<ApiDataResponse<UnitTypeAttachment>>(
    `/admin/attachments/unit-type/${id}`,
    { method: "DELETE" },
  );
  return res.data;
}
