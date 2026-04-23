"use client";

import { createContext, useContext, useState } from "react";
import { type Role, DEFAULT_ROLE, getStoredRole, setStoredRole } from "@/lib/roles";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
}

const RoleContext = createContext<RoleContextValue>({
  role: DEFAULT_ROLE,
  setRole: () => {},
  isLoggedIn: false,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => getStoredRole());

  const setRole = (r: Role) => {
    setStoredRole(r);
    setRoleState(r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoggedIn: role !== "guest" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
