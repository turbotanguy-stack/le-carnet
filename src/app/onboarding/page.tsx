import { redirect } from "next/navigation";
import { getCurrentFamily } from "@/lib/family";
import CreateOrJoin from "./CreateOrJoin";

export default async function OnboardingPage() {
  const current = await getCurrentFamily();
  if (current?.member) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="font-display font-bold text-2xl text-ink">Bienvenue !</div>
          <div className="text-sm text-muted mt-1">
            Créez votre espace familial ou rejoignez-en un
          </div>
        </div>
        <CreateOrJoin />
      </div>
    </div>
  );
}
