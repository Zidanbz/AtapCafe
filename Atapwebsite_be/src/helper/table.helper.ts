export function getTableArea(code: string) {
  return code.toUpperCase().startsWith("OUT") ? "Outdoor" : "Indoor";
}
