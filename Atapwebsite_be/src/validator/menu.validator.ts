import type { MenuQuery } from "../dto/menu.dto";

export function validateMenuQuery(query: MenuQuery) {
  return {
    category: query.category?.trim() || undefined,
  };
}
