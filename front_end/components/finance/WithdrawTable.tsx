import Badge from "@/components/ui/Badge";
import { MOCK_WITHDRAWALS } from "@/lib/mock-data";

export default function WithdrawTable() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary">Withdrawal Requests</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-accent/50">
          <tr>
            {["ID", "Amount", "Method", "Date", "Status"].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-text-muted px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_WITHDRAWALS.map((w, i) => (
            <tr key={w.id} className={`hover:bg-accent/30 transition-colors ${i < MOCK_WITHDRAWALS.length - 1 ? "border-b border-border" : ""}`}>
              <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{w.id}</td>
              <td className="px-5 py-3.5 font-semibold text-text-primary">฿{w.amount.toLocaleString()}</td>
              <td className="px-5 py-3.5 text-text-muted">{w.method}</td>
              <td className="px-5 py-3.5 text-text-muted">{w.date}</td>
              <td className="px-5 py-3.5"><Badge variant={w.status}>{w.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
