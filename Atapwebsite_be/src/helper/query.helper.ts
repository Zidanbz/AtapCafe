export function parseTake(value: string | undefined) {
  const take = Number(value ?? 50);

  if (!Number.isFinite(take)) {
    return 50;
  }

  return Math.min(Math.max(Math.trunc(take), 1), 100);
}

export function parsePage(value: string | undefined) {
  const page = Number(value ?? 1);

  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.max(Math.trunc(page), 1);
}
