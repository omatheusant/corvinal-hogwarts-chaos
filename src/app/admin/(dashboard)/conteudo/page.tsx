import Link from "next/link";
import { listAdminSiteContent } from "@/lib/admin/queries";
import { KNOWN_SITE_CONTENT_KEYS } from "@/lib/validations/site-content";
import { goToContentKey } from "./actions";

export default async function AdminSiteContentPage() {
  const existing = await listAdminSiteContent();
  const existingKeys = new Set(existing.map((c) => c.key));
  const extraKeys = existing.filter((c) => !KNOWN_SITE_CONTENT_KEYS.some((k) => k.key === c.key));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ivory">Conteúdo institucional</h1>
      <p className="font-sans text-sm text-muted">
        Textos editáveis usados na página inicial e em &ldquo;A Casa&rdquo;. Uma chave só aparece no site
        público depois de marcada como publicada.
      </p>

      <ul className="divide-y divide-border border border-border">
        {KNOWN_SITE_CONTENT_KEYS.map(({ key, label }) => (
          <li key={key} className="flex items-center justify-between px-4 py-3">
            <span className="font-sans text-sm text-ivory">{label}</span>
            <div className="flex items-center gap-3">
              <span
                className={
                  existingKeys.has(key)
                    ? "font-sans text-xs text-emerald-300"
                    : "font-sans text-xs text-muted-foreground"
                }
              >
                {existingKeys.has(key) ? "Cadastrado" : "Ainda não cadastrado"}
              </span>
              <Link href={`/admin/conteudo/${key}`} className="font-sans text-sm text-bronze-soft hover:underline">
                Editar
              </Link>
            </div>
          </li>
        ))}
        {extraKeys.map((content) => (
          <li key={content.key} className="flex items-center justify-between px-4 py-3">
            <span className="font-sans text-sm text-ivory">{content.key} (personalizada)</span>
            <Link href={`/admin/conteudo/${content.key}`} className="font-sans text-sm text-bronze-soft hover:underline">
              Editar
            </Link>
          </li>
        ))}
      </ul>

      <form action={goToContentKey} className="flex items-end gap-3 border border-border bg-navy/40 p-4">
        <div className="space-y-1.5">
          <label htmlFor="key" className="font-sans text-xs tracking-wide text-muted uppercase">
            Nova chave de conteúdo
          </label>
          <input
            id="key"
            name="key"
            placeholder="ex.: casa_tradicoes"
            className="border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory focus-visible:outline-2 focus-visible:outline-bronze-soft"
          />
        </div>
        <button type="submit" className="border border-bronze bg-bronze px-5 py-2 font-sans text-sm text-ink hover:bg-bronze-soft">
          Criar / editar
        </button>
      </form>
    </div>
  );
}
