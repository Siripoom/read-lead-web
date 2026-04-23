"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MOCK_REVENUE_DATA } from "@/lib/mock-data";

export default function RevenueChart() {
  const data = MOCK_REVENUE_DATA.slice(0, 14).map(d => ({ ...d, amount: d.amount }));

  return (
    <div className="bg-white rounded-xl border border-border p-5 mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-4">Revenue (Last 14 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E11D2E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#E11D2E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} interval={2} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }}
            formatter={(val) => [`฿${Number(val).toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="amount" stroke="#E11D2E" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
