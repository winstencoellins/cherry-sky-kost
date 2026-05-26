import { PropertyForm } from "@/features/admin/properties/property-form";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyForm id={id} />;
}
