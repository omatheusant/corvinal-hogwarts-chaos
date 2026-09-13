import Link from "next/link";
import { listAdminPosts } from "@/lib/admin/queries";
import { POST_CATEGORY_LABELS } from "@/types/domain";

export default async function AdminPostsPage() {
  const posts = await listAdminPosts();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Mural</h1>
        <Link
          href="/admin/mural/novo"
          className="border border-bronze bg-bronze px-5 py-2 font-sans text-sm text-ink hover:bg-bronze-soft"
        >
          + Nova publicação
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="font-sans text-sm text-muted">Nenhuma publicação cadastrada ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left font-sans text-sm">
            <thead className="border-b border-border bg-navy/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ivory">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{POST_CATEGORY_LABELS[post.category]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.published
                          ? "border border-emerald-400/40 px-2 py-0.5 text-xs text-emerald-300"
                          : "border border-border-strong px-2 py-0.5 text-xs text-muted"
                      }
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/mural/${post.id}`} className="text-bronze-soft hover:underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
