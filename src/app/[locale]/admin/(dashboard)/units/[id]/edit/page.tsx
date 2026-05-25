import { UnitForm } from "@/features/admin/units/unit-form";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UnitForm id={id} />;
}
