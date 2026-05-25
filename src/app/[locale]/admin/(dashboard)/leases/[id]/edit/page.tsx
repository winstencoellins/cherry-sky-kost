import { LeaseForm } from "@/features/admin/leases/lease-form";

export default async function EditLeasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeaseForm id={id} />;
}
