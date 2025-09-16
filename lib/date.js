export function dateToThai(date) {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleString("th-TH", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
