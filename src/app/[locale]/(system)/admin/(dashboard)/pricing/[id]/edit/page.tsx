import { PricingForm } from "@/features/admin/pricing/pricing-form";

export default async function EditPricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PricingForm id={id} />;
}
