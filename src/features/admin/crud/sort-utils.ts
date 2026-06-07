export type SortDirection = "asc" | "desc";

export type SortValue = string | number | boolean | null | undefined;

export function compareSortValues(
  a: SortValue,
  b: SortValue,
  direction: SortDirection,
): number {
  const aEmpty = a == null || a === "";
  const bEmpty = b == null || b === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  let result = 0;
  if (typeof a === "number" && typeof b === "number") {
    result = a - b;
  } else if (typeof a === "boolean" && typeof b === "boolean") {
    result = Number(a) - Number(b);
  } else {
    result = String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  return direction === "asc" ? result : -result;
}

export function isColumnSortable(key: string, sortable?: boolean): boolean {
  if (sortable != null) return sortable;
  return key !== "actions";
}
