"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useRole } from "@/context/RoleContext";

interface MainLayoutProps {
  children: React.ReactNode;
  hero?: React.ReactNode;
}

export default function MainLayout({ children, hero }: MainLayoutProps) {
  const { role } = useRole();

  return (
    <div className="flex h-screen overflow-hidden bg-accent">
      {role === "admin" && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {hero && <div className="w-full">{hero}</div>}
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
