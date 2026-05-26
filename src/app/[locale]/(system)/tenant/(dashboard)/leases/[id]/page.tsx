import { TenantLeaseDetail } from "@/features/tenant/leases/tenant-lease-detail";

export default async function TenantLeaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TenantLeaseDetail id={id} />;
}
