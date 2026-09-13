import { GalleryItemForm } from "@/components/admin/gallery-item-form";
import { listAdminStudents } from "@/lib/admin/queries";
import { createGalleryItem } from "../actions";

export default async function NewGalleryItemPage() {
  const students = await listAdminStudents();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ivory">Nova memória</h1>
      <GalleryItemForm
        action={createGalleryItem}
        students={students.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
