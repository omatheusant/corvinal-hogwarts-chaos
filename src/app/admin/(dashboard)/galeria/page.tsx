import Link from "next/link";
import Image from "next/image";
import { listAdminGalleryItems } from "@/lib/admin/queries";

export default async function AdminGalleryPage() {
  const items = await listAdminGalleryItems();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Galeria de memórias</h1>
        <Link
          href="/admin/galeria/novo"
          className="border border-bronze bg-bronze px-5 py-2 font-sans text-sm text-ink hover:bg-bronze-soft"
        >
          + Nova memória
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="font-sans text-sm text-muted">Nenhuma memória cadastrada ainda.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/galeria/${item.id}`}
              className="block border border-border bg-navy/40 p-3 hover:border-bronze/60"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-ink">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="320px" />
                )}
              </div>
              <p className="mt-3 font-sans text-sm text-ivory">{item.title}</p>
              <span
                className={
                  item.published
                    ? "mt-1 inline-block border border-emerald-400/40 px-2 py-0.5 text-xs text-emerald-300"
                    : "mt-1 inline-block border border-border-strong px-2 py-0.5 text-xs text-muted"
                }
              >
                {item.published ? "Publicado" : "Rascunho"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
