"use client";

import Link from "next/link";

export default function AdminError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h1 className="font-display text-2xl text-ivory">Não foi possível carregar esta área</h1>
      <p className="font-sans text-sm text-muted">{error.message}</p>
      <Link href="/admin/login" className="font-sans text-sm text-bronze-soft hover:underline">
        Voltar para o login
      </Link>
    </div>
  );
}
