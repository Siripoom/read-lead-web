import type { Role } from "../constants/roles";

declare global {
  namespace Express {
    interface UserContext {
      userId: string;
      role: Role;
      tokenType: "access" | "refresh";
      jti?: string;
    }

    interface Request {
      user?: UserContext;
      pagination?: {
        page: number;
        pageSize: number;
      };
    }
  }
}

export {};
