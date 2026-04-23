import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-primary font-medium hover:underline">
          ดูทั้งหมด →
        </Link>
      )}
    </div>
  );
}
