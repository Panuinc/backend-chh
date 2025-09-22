export function getLocalNow() {
  const now = new Date();

  const thString = now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

  const localNow = new Date(thString);
  localNow.setMilliseconds(0);

  return localNow;
}
