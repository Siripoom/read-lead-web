import MainLayout from "@/components/layout/MainLayout";
import RouteGuard from "@/components/layout/RouteGuard";
import IncomeCards from "@/components/finance/IncomeCards";
import IncomeChart from "@/components/finance/IncomeChart";
import WithdrawTable from "@/components/finance/WithdrawTable";

export default function FinancePage() {
  return (
    <MainLayout>
      <RouteGuard allowed={["admin"]}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-text-primary mb-6">Finance Panel</h1>
          <IncomeCards />
          <IncomeChart />
          <WithdrawTable />
        </div>
      </RouteGuard>
    </MainLayout>
  );
}
