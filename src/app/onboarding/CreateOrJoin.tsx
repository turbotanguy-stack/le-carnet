"use client";

import { useActionState, useState } from "react";
import { createFamily, joinFamily } from "@/app/auth/actions";

export default function CreateOrJoin() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [createState, createAction, creating] = useActionState(createFamily, null);
  const [joinState, joinAction, joining] = useActionState(joinFamily, null);

  return (
    <div className="w-full max-w-sm">
      <div className="flex rounded-full border border-[#E0CDB8] p-1 mb-6 bg-white">
        <button
          onClick={() => setMode("create")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "create" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          Créer une famille
        </button>
        <button
          onClick={() => setMode("join")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "join" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          Rejoindre
        </button>
      </div>

      {mode === "create" ? (
        <form action={createAction} className="flex flex-col gap-4">
          <Field name="familyName" label="Nom de la famille" placeholder="Famille Magnette" />
          <Field name="displayName" label="Votre prénom" placeholder="Marie" />
          <Field name="relation" label="Votre rôle" placeholder="Maman, Papa, Grand-père…" />
          {createState?.error && <ErrorMsg text={createState.error} />}
          <SubmitButton pending={creating} label="Créer la famille" />
        </form>
      ) : (
        <form action={joinAction} className="flex flex-col gap-4">
          <Field name="joinCode" label="Code d'invitation" placeholder="ABC123" />
          <Field name="displayName" label="Votre prénom" placeholder="Lucas" />
          <Field name="relation" label="Votre rôle" placeholder="Fils, Fille…" />
          {joinState?.error && <ErrorMsg text={joinState.error} />}
          <SubmitButton pending={joining} label="Rejoindre la famille" />
        </form>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1.5">{label}</label>
      <input
        name={name}
        type="text"
        required
        className="w-full rounded-xl border border-[#E0CDB8] bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
        placeholder={placeholder}
      />
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="text-sm text-accent-dark bg-accent-soft border border-[#F0C4A8] rounded-lg px-3 py-2">
      {text}
    </p>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-accent hover:bg-accent-dark transition-colors text-white font-semibold text-sm py-2.5 disabled:opacity-60"
    >
      {pending ? "…" : label}
    </button>
  );
}
