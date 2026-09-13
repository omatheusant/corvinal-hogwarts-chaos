import { notFound } from "next/navigation";
import { GalleryItemForm } from "@/components/admin/gallery-item-form";
import { getAdminGalleryItemById, listAdminStudents } from "@/lib/admin/queries";
import { updateGalleryItem, deleteGalleryItem } from "../actions";

export default async function EditGalleryItemPage(props: PageProps<"/admin/galeria/[id]">) {
  const { id } = await props.params;
  const [item, students] = await Promise.all([getAdminGalleryItemById(id), listAdminStudents()]);
  if (!item) notFound();

  const boundUpdate = updateGalleryItem.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Editar memória</h1>
        <form action={deleteGalleryItem}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="font-sans text-sm text-red-300 hover:underline">
            Excluir memória
          </button>
        </form>
      </div>
      <GalleryItemForm
        key={item.id}
        item={item}
        action={boundUpdate}
        students={students.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
