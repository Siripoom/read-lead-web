"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import ContentApprovalTable from "@/components/admin/ContentApprovalTable";
import UserManagementTable from "@/components/admin/UserManagementTable";
import ReportsTable from "@/components/admin/ReportsTable";
import MonetizationPanel from "@/components/admin/MonetizationPanel";
import AdvertisingPanel from "@/components/admin/AdvertisingPanel";

const TABS = ["Pending Content", "Users", "Reports", "Monetization", "Ads"];

export default function AdminPage() {
  const [tab, setTab] = useState(0);

  return (
    <MainLayout>
      <RouteGuard allowed={["admin"]}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-text-primary mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 w-fit border border-border mb-6">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === i ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && <ContentApprovalTable />}
        {tab === 1 && <UserManagementTable />}
        {tab === 2 && <ReportsTable />}
        {tab === 3 && <MonetizationPanel />}
        {tab === 4 && <AdvertisingPanel />}
      </div>
      </RouteGuard>
    </MainLayout>
  );
}
