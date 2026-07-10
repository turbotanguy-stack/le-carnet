"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display font-bold text-2xl text-ink">Le Carnet</div>
          <div className="text-sm text-muted mt-1">Créer votre compte</div>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              Votre prénom
            </label>
            <input
              name="displayName"
              type="text"
              required
              className="w-full rounded-xl border border-[#E0CDB8] bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="Marie"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              Adresse e-mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[#E0CDB8] bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="vous@exemple.fr"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#E0CDB8] bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="6 caractères minimum"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-accent-dark bg-accent-soft border border-[#F0C4A8] rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-accent hover:bg-accent-dark transition-colors text-white font-semibold text-sm py-2.5 disabled:opacity-60"
          >
            {pending ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-accent font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
