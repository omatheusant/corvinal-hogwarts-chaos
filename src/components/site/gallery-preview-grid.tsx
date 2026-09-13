import Link from "next/link";
import Image from "next/image";
import {
  CommonRoomScene,
  LibraryScene,
  MapScene,
  TelescopeScene,
  TowerWindowScene,
} from "@/components/visual/illustrations";
import type { GalleryItemWithIllustration } from "@/lib/data/gallery";

const ILLUSTRATIONS = {
  tower: TowerWindowScene,
  telescope: TelescopeScene,
  library: LibraryScene,
  "common-room": CommonRoomScene,
  map: MapScene,
};

/** Grade estática de prévia usada na home — cada peça linka para a galeria
 * completa em /memorias, onde a ampliação acessível acontece de fato. */
export function GalleryPreviewGrid({
  items,
  className,
}: {
  items: GalleryItemWithIllustration[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className ?? ""}`}>
      {items.map((item) => {
        const Illustration = item.illustrationVariant ? ILLUSTRATIONS[item.illustrationVariant] : null;
        const aspect = item.imageWidth && item.imageHeight ? item.imageWidth / item.imageHeight : 1;

        return (
          <Link
            key={item.id}
            href="/memorias"
            className="group relative block overflow-hidden rounded-sm border border-border focus-visible:outline-2 focus-visible:outline-bronze-soft"
            style={{ aspectRatio: aspect }}
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : Illustration ? (
              <Illustration className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
            ) : null}
            <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 to-transparent px-3 py-2 font-sans text-xs text-ivory/90">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
