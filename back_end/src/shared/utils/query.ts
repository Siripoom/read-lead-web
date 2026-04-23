import { badRequest } from "../errors";

export type SortOrder = "asc" | "desc";

export interface QueryOptions {
  page: number;
  pageSize: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
  q?: string;
  filters: Record<string, string | number | boolean | null>;
}

export function parseQueryOptions(query: Record<string, unknown>, defaultSortBy: string): QueryOptions {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 20);

  if (!Number.isInteger(page) || page <= 0) {
    throw badRequest("page must be a positive integer");
  }
  if (!Number.isInteger(pageSize) || pageSize <= 0 || pageSize > 100) {
    throw badRequest("pageSize must be an integer between 1 and 100");
  }

  const sortBy = String(query.sortBy ?? defaultSortBy);
  const sortOrder = String(query.sortOrder ?? "desc").toLowerCase();

  if (sortOrder !== "asc" && sortOrder !== "desc") {
    throw badRequest("sortOrder must be asc or desc");
  }

  const filters = parseFilters(query.filters);

  const q = typeof query.q === "string" && query.q.trim().length > 0 ? query.q.trim() : undefined;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    sortBy,
    sortOrder,
    q,
    filters,
  };
}

function parseFilters(raw: unknown): Record<string, string | number | boolean | null> {
  if (!raw) {
    return {};
  }

  let candidate: unknown = raw;
  if (typeof raw === "string") {
    try {
      candidate = JSON.parse(raw);
    } catch {
      throw badRequest("filters must be a valid JSON object");
    }
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw badRequest("filters must be a JSON object");
  }

  const normalized: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(candidate as Record<string, unknown>)) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      normalized[key] = value;
    }
  }

  return normalized;
}
