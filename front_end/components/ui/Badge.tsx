import { cn } from "@/lib/utils";

type BadgeVariant = "manga" | "novel" | "audiobook" | "free" | "paid" | "pending" | "approved" | "rejected" | "completed" | "published" | "draft" | "unpublished" | "scheduled";

const variantStyles: Record<BadgeVariant, string> = {
  manga: "bg-blue-100 text-blue-700",
  novel: "bg-purple-100 text-purple-700",
  audiobook: "bg-green-100 text-green-700",
  free: "bg-emerald-100 text-emerald-700",
  paid: "bg-amber-100 text-amber-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  unpublished: "bg-orange-100 text-orange-700",
  scheduled: "bg-sky-100 text-sky-700",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
