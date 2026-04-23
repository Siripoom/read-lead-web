import { prisma } from "../../libs/prisma";
import type { CrudResourceConfig } from "../../modules/resource-config";
import { badRequest, notFound } from "../errors";
import { parseQueryOptions } from "../utils/query";

interface CrudListResult {
  data: unknown[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface CrudDeleteResult {
  data: unknown;
  message: string;
}

export class CrudService {
  constructor(private readonly config: CrudResourceConfig) {}

  private get delegate() {
    return (prisma as Record<string, any>)[this.config.model];
  }

  private parseId(raw: string): string | bigint {
    if (this.config.idType === "uuid") {
      return raw;
    }
    if (!/^\d+$/.test(raw)) {
      throw badRequest("Invalid id");
    }
    return BigInt(raw);
  }

  async list(rawQuery: Record<string, unknown>): Promise<CrudListResult> {
    const options = parseQueryOptions(rawQuery, this.config.defaultSortBy ?? this.config.idField);

    const where: Record<string, unknown> = {
      ...(this.config.softDeleteField ? { [this.config.softDeleteField]: null } : {}),
      ...Object.fromEntries(Object.entries(options.filters).map(([key, value]) => [key, value])),
    };

    if (options.q && this.config.searchFields && this.config.searchFields.length > 0) {
      where.OR = this.config.searchFields.map((field) => ({
        [field]: {
          contains: options.q,
          mode: "insensitive",
        },
      }));
    }

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip: options.skip,
        take: options.pageSize,
        orderBy: {
          [options.sortBy]: options.sortOrder,
        },
      }),
      this.delegate.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: options.page,
        pageSize: options.pageSize,
        total,
        totalPages: Math.ceil(total / options.pageSize),
      },
    };
  }

  async getById(rawId: string): Promise<unknown> {
    const id = this.parseId(rawId);
    const where = {
      [this.config.idField]: id,
      ...(this.config.softDeleteField ? { [this.config.softDeleteField]: null } : {}),
    };

    const data = await this.delegate.findFirst({ where });
    if (!data) {
      throw notFound();
    }

    return data;
  }

  async create(payload: Record<string, unknown>): Promise<unknown> {
    return this.delegate.create({ data: payload });
  }

  async update(rawId: string, payload: Record<string, unknown>): Promise<unknown> {
    const id = this.parseId(rawId);
    const existing = await this.delegate.findUnique({ where: { [this.config.idField]: id } });

    if (!existing) {
      throw notFound();
    }

    return this.delegate.update({
      where: { [this.config.idField]: id },
      data: payload,
    });
  }

  async remove(rawId: string): Promise<CrudDeleteResult> {
    const id = this.parseId(rawId);
    const existing = await this.delegate.findUnique({ where: { [this.config.idField]: id } });

    if (!existing) {
      throw notFound();
    }

    if (this.config.softDeleteField) {
      const data = await this.delegate.update({
        where: { [this.config.idField]: id },
        data: { [this.config.softDeleteField]: new Date() },
      });

      return {
        data,
        message: "Soft deleted",
      };
    }

    await this.delegate.delete({ where: { [this.config.idField]: id } });
    return {
      data: { id },
      message: "Deleted",
    };
  }
}
