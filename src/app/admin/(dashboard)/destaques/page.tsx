import { HighlightList } from "@/components/admin/highlight-list";
import { listAdminStudents, listAdminPosts, listAdminGalleryItems } from "@/lib/admin/queries";
import { POST_CATEGORY_LABELS } from "@/types/domain";
import { updateStudentHighlights, updatePostHighlights, updateGalleryHighlights } from "./actions";

export default async function AdminHighlightsPage() {
  const [students, posts, gallery] = await Promise.all([
    listAdminStudents(),
    listAdminPosts(),
    listAdminGalleryItems(),
  ]);

  const publishedStudents = students.filter((s) => s.published);
  const publishedPosts = posts.filter((p) => p.published);
  const publishedGallery = gallery.filter((g) => g.published);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ivory">Destaques da home</h1>
        <p className="mt-1 font-sans text-sm text-muted">
          Só itens publicados podem ser destacados — rascunhos não aparecem aqui.
        </p>
      </div>

      <HighlightList
        title="Alunos"
        action={updateStudentHighlights}
        items={publishedStudents.map((s) => ({
          id: s.id,
          label: s.name,
          highlightOrder: s.highlightOrder,
        }))}
      />

      <HighlightList
        title="Mural"
        action={updatePostHighlights}
        items={publishedPosts.map((p) => ({
          id: p.id,
          label: `${POST_CATEGORY_LABELS[p.category]} · ${p.title}`,
          highlightOrder: p.highlightOrder,
        }))}
      />

      <HighlightList
        title="Galeria"
        action={updateGalleryHighlights}
        items={publishedGallery.map((g) => ({
          id: g.id,
          label: g.title,
          highlightOrder: g.highlightOrder,
        }))}
      />
    </div>
  );
}
