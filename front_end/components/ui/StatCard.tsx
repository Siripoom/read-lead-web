"use client";

import Card from "./Card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
}

export default function StatCard({ icon, label, value, trend, trendUp, iconBg = "bg-primary-light" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
          {trend && (
            <p className={`text-xs mt-0.5 font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
