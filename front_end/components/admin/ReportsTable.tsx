import Badge from "@/components/ui/Badge";

const REPORTS = [
  { id: "r1", reason: "Inappropriate Content", target: "Neon Ghost Ch. 2", reporter: "User123", date: "Mar 21, 2026", status: "pending" as const },
  { id: "r2", reason: "Spam", target: "Dark Meridian Ch. 5", reporter: "SafeReader", date: "Mar 20, 2026", status: "approved" as const },
  { id: "r3", reason: "Copyright Violation", target: "Shadow Walker", reporter: "Publisher_A", date: "Mar 18, 2026", status: "rejected" as const },
];

export default function ReportsTable() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-accent/50">
          <tr>
            {["Reason", "Target Content", "Reporter", "Date", "Status"].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-text-muted px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REPORTS.map((r, i) => (
            <tr key={r.id} className={`hover:bg-accent/30 transition-colors ${i < REPORTS.length - 1 ? "border-b border-border" : ""}`}>
              <td className="px-5 py-3.5 font-medium text-text-primary">{r.reason}</td>
              <td className="px-5 py-3.5 text-text-muted">{r.target}</td>
              <td className="px-5 py-3.5 text-text-muted">{r.reporter}</td>
              <td className="px-5 py-3.5 text-text-muted">{r.date}</td>
              <td className="px-5 py-3.5"><Badge variant={r.status}>{r.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
