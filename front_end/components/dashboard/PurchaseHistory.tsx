import Badge from "@/components/ui/Badge";

const PURCHASES = [
  { title: "Beyond the Pale · Ch. 3", date: "Mar 20, 2026", amount: "10 coins", status: "completed" as const },
  { title: "Neon Ghost · Ch. 1", date: "Mar 18, 2026", amount: "5 coins", status: "completed" as const },
  { title: "Root & Bone · Full", date: "Mar 15, 2026", amount: "15 coins", status: "completed" as const },
];

export default function PurchaseHistory() {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-text-primary mb-3">Purchase History</h3>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {PURCHASES.map((p, i) => (
          <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i < PURCHASES.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{p.title}</p>
              <p className="text-xs text-text-muted">{p.date}</p>
            </div>
            <span className="text-sm font-semibold text-text-primary">{p.amount}</span>
            <Badge variant={p.status}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
