import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function countRows(table: "students" | "posts" | "gallery_items") {
  const supabase = await createClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHomePage() {
  const [students, posts, gallery] = await Promise.all([
    countRows("students"),
    countRows("posts"),
    countRows("gallery_items"),
  ]);

  const cards = [
    { label: "Alunos cadastrados", value: students, href: "/admin/alunos" },
    { label: "Publicações no mural", value: posts, href: "/admin/mural" },
    { label: "Itens na galeria", value: gallery, href: "/admin/galeria" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-ivory">Painel da Corvinal</h1>
        <p className="mt-1 font-sans text-sm text-muted">
          Inclui rascunhos e publicações. Visitantes só veem o que estiver marcado como publicado.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block border border-border bg-navy/40 p-6 hover:border-bronze/60"
          >
            <p className="font-display text-4xl text-ivory">{card.value}</p>
            <p className="mt-2 font-sans text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="border border-border bg-navy/40 p-6">
        <h2 className="font-display text-xl text-ivory">Atalhos</h2>
        <ul className="mt-4 grid gap-2 font-sans text-sm sm:grid-cols-2">
          <li><Link href="/admin/alunos/novo" className="text-bronze-soft hover:underline">+ Novo aluno</Link></li>
          <li><Link href="/admin/mural/novo" className="text-bronze-soft hover:underline">+ Nova publicação no mural</Link></li>
          <li><Link href="/admin/galeria/novo" className="text-bronze-soft hover:underline">+ Nova memória na galeria</Link></li>
          <li><Link href="/admin/conteudo" className="text-bronze-soft hover:underline">Editar textos institucionais</Link></li>
          <li><Link href="/admin/destaques" className="text-bronze-soft hover:underline">Ordenar destaques da home</Link></li>
        </ul>
      </div>
    </div>
  );
}
