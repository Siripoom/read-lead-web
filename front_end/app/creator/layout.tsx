import CreatorStudioShell from "@/components/creator/CreatorStudioShell";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreatorStudioShell>{children}</CreatorStudioShell>;
}
