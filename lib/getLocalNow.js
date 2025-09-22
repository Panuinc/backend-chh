export function getLocalNow(offsetHours = 7) {
  const now = new Date();
  now.setMilliseconds(0);

  const local = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours() + offsetHours,
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  return local;
}
