import StatCard from "@/components/ui/StatCard";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function IncomeCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard icon={<DollarSign size={20} className="text-primary" />} label="Total Income" value="฿284,600" trend="15.2% vs last year" trendUp />
      <StatCard icon={<TrendingUp size={20} className="text-primary" />} label="This Month" value="฿45,200" trend="8.7% vs last month" trendUp />
      <StatCard icon={<Clock size={20} className="text-amber-500" />} label="Pending Withdrawal" value="฿5,000" iconBg="bg-amber-50" />
      <StatCard icon={<CheckCircle size={20} className="text-green-500" />} label="Completed" value="฿234,400" iconBg="bg-green-50" />
    </div>
  );
}
