import type { Response } from "express";

function toJsonSafe<T>(value: T): T {
  if (value === undefined) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value, (_, nested) => (typeof nested === "bigint" ? nested.toString() : nested)),
  ) as T;
}

export function ok<T>(res: Response, data: T, message?: string, meta?: unknown): void {
  res.status(200).json({
    data: toJsonSafe(data),
    message,
    meta: toJsonSafe(meta),
  });
}

export function created<T>(res: Response, data: T, message?: string): void {
  res.status(201).json({ data: toJsonSafe(data), message });
}
