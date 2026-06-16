export function createOrderNumber() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.floor(Math.random() * 900 + 100);

  return `ATAP-${timestamp}-${random}`;
}
