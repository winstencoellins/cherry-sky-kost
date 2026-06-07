import { TenantDetailView } from "@/features/admin/users/tenant-detail-view";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TenantDetailView id={id} />;
}
