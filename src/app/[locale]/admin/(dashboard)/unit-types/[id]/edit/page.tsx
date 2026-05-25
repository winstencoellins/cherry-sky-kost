import { UnitTypeForm } from "@/features/admin/unit-types/unit-type-form";

export default async function EditUnitTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UnitTypeForm id={id} />;
}
