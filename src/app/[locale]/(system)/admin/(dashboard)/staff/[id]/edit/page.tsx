import { StaffUserForm } from "@/features/admin/staff/staff-user-form";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StaffUserForm id={id} />;
}
