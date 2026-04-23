"use client";

import { RoleProvider } from "@/context/RoleContext";
import { CreatorStudioProvider } from "@/context/CreatorStudioContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <CreatorStudioProvider>{children}</CreatorStudioProvider>
    </RoleProvider>
  );
}
