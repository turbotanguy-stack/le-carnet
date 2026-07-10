import { redirect } from "next/navigation";
import { getCurrentFamily } from "@/lib/family";
import AppShell from "./AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentFamily();
  if (!current) redirect("/login");
  if (!current.member || !current.family) redirect("/onboarding");

  return (
    <AppShell familyName={current.family.name} member={current.member}>
      {children}
    </AppShell>
  );
}
