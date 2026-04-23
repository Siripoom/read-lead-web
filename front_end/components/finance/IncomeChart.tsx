"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY = [
  { month: "Oct", amount: 28400 },
  { month: "Nov", amount: 35200 },
  { month: "Dec", amount: 42100 },
  { month: "Jan", amount: 38700 },
  { month: "Feb", amount: 41500 },
  { month: "Mar", amount: 45200 },
];

export default function IncomeChart() {
  return (
    <div className="bg-white rounded-xl border border-border p-5 mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-4">Monthly Income</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MONTHLY} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }}
            formatter={(val) => [`฿${Number(val).toLocaleString()}`, "Income"]}
            cursor={{ fill: "#F5F5F5" }}
          />
          <Bar dataKey="amount" fill="#E11D2E" radius={[6, 6, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
