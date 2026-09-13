import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { EmptyState } from "@/components/site/empty-state";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { getGalleryItems } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Memórias",
  description: "Galeria de memórias da Casa Corvinal.",
};

export default async function MemoriasPage() {
  const { data: items } = await getGalleryItems();

  return (
    <div className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Galeria"
        title="Memórias da Corvinal"
        description="Registros da nossa convivência — clique em qualquer peça para ampliar. Use as setas do teclado para navegar."
      />

      <div className="mt-14">
        {items.length === 0 ? (
          <EmptyState
            title="Nenhuma memória publicada ainda"
            description="Assim que houver registros publicados, eles aparecerão aqui."
          />
        ) : (
          <GalleryGrid items={items} />
        )}
      </div>
    </div>
  );
}
