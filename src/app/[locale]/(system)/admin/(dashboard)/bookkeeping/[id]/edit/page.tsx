import { LedgerEntryForm } from "@/features/admin/bookkeeping/ledger-entry-form";

export default async function EditLedgerEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LedgerEntryForm id={id} />;
}
