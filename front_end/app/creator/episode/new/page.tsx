import { redirect } from "next/navigation";

export default function LegacyNewEpisodePage() {
  redirect("/creator/works/new");
}
