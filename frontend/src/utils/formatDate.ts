export function formatDate(value: unknown): string {
  if (!value) return "";

  const date = new Date(value as string | number);
  const dateStr = !Number.isNaN(date.getTime())
    ? date.toISOString().split("T")[0]
    : "";
  return dateStr;
}
