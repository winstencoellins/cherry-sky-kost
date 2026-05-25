export function AdminAlert({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "info";
}) {
  return (
    <div
      role="alert"
      className={
        variant === "error"
          ? "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
      }
    >
      {message}
    </div>
  );
}
