"use client";

import { useState } from "react";

export default function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-[20px] px-4 py-3.5 flex items-center gap-3 mb-2.5"
      style={{ background: "#F5F0E8", border: "1.5px solid #E0D4C0" }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-muted">Code d&apos;invitation</div>
        <div className="text-lg font-display font-bold text-ink tracking-[0.15em]">
          {code}
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 text-xs font-semibold px-3 py-2 rounded-xl bg-white text-accent-dark border border-line"
      >
        {copied ? "Copié !" : "Copier"}
      </button>
    </div>
  );
}
