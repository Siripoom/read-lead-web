"use client";

import MainLayout from "@/components/layout/MainLayout";
import RouteGuard from "@/components/layout/RouteGuard";

export default function CreatorStudioShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <RouteGuard allowed={["creator", "admin"]}>{children}</RouteGuard>
    </MainLayout>
  );
}
