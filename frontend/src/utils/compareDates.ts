import { formatDate } from "./formatDate";

export function compareDates(parent_date: string, child_date: string): string {
  if (!parent_date) {
    return "";
  }
  const p_date = new Date(parent_date);
  const c_date = new Date(child_date);
  p_date.setHours(0, 0, 0, 0);
  c_date.setHours(0, 0, 0, 0);
  return p_date > c_date ? "" : formatDate(child_date);
}
