import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminNavPageKey } from "@/features/admin/constants/nav-items";

interface AdminPagePlaceholderProps {
  pageKey: AdminNavPageKey;
}

export async function AdminPagePlaceholder({
  pageKey,
}: AdminPagePlaceholderProps) {
  const t = await getTranslations("admin");

  return (
    <Card className="shadow-card border-outline-variant/30">
      <CardHeader>
        <CardTitle>{t(`pages.${pageKey}.title`)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-md text-muted-foreground">
          {t("placeholder.comingSoon")}
        </p>
        <p className="text-caption mt-2 text-muted-foreground/80">
          {t("placeholder.hint")}
        </p>
      </CardContent>
    </Card>
  );
}
