import Card from "@/components/ui/Card";
import { User, Edit3, Calendar } from "lucide-react";

export default function ProfileCard() {
  return (
    <Card className="p-6 mb-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary-light border-4 border-white shadow-sm mx-auto mb-3 flex items-center justify-center">
          <User size={32} className="text-primary" />
        </div>
        <h3 className="text-base font-bold text-text-primary">Guest Reader</h3>
        <p className="text-xs text-text-muted mt-0.5">@guestreader</p>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-text-muted">
          <Calendar size={12} />
          <span>Joined Jan 2026</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          {[["12", "Reading"], ["45", "Bookmarks"], ["3", "Reviews"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-base font-bold text-text-primary">{val}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-4 py-1.5 rounded-full hover:bg-primary-light transition-colors mx-auto">
          <Edit3 size={12} /> Edit Profile
        </button>
      </div>
    </Card>
  );
}
