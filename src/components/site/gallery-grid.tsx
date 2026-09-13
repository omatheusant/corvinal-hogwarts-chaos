"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import {
  CommonRoomScene,
  LibraryScene,
  MapScene,
  TelescopeScene,
  TowerWindowScene,
} from "@/components/visual/illustrations";
import type { GalleryItemWithIllustration } from "@/lib/data/gallery";
import { formatLongDate } from "@/lib/format-date";

const ILLUSTRATIONS = {
  tower: TowerWindowScene,
  telescope: TelescopeScene,
  library: LibraryScene,
  "common-room": CommonRoomScene,
  map: MapScene,
};

export function GalleryGrid({ items }: { items: GalleryItemWithIllustration[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleId = useId();
  const active = openIndex !== null ? items[openIndex] : null;

  const goTo = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = (current + direction + items.length) % items.length;
        return next;
      });
    },
    [items.length],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") goTo(1);
    if (event.key === "ArrowLeft") goTo(-1);
  };

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((item, index) => {
          const Illustration = item.illustrationVariant ? ILLUSTRATIONS[item.illustrationVariant] : null;
          const aspect = item.imageWidth && item.imageHeight ? item.imageWidth / item.imageHeight : 1;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-sm border border-border text-left focus-visible:outline-2 focus-visible:outline-bronze-soft"
              style={{ aspectRatio: aspect }}
              aria-haspopup="dialog"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : Illustration ? (
                <Illustration className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
              ) : null}
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 to-transparent px-3 py-2 font-sans text-xs text-ivory/90">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <Dialog
        open={active !== null}
        onClose={() => setOpenIndex(null)}
        labelledBy={titleId}
        className="max-h-[92vh] w-full max-w-4xl"
      >
        {active && (
          <div
            className="flex max-h-[92vh] flex-col overflow-hidden bg-navy shadow-elevated sm:flex-row"
            onKeyDown={handleKeyDown}
          >
            <div className="relative aspect-4/3 w-full shrink-0 bg-ink sm:aspect-auto sm:w-2/3">
              {active.imageUrl ? (
                <Image src={active.imageUrl} alt={active.title} fill className="object-contain" />
              ) : (
                (() => {
                  const Illustration = active.illustrationVariant
                    ? ILLUSTRATIONS[active.illustrationVariant]
                    : null;
                  return Illustration ? <Illustration className="h-full w-full" /> : null;
                })()
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <h2 id={titleId} className="font-display text-2xl text-ivory">
                {active.title}
              </h2>
              {active.caption && <p className="font-serif text-muted">{active.caption}</p>}
              {active.takenAt && (
                <p className="font-sans text-xs tracking-wide text-bronze-soft uppercase">
                  {formatLongDate(active.takenAt)}
                </p>
              )}
              {active.students.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {active.students.map((student) => (
                    <Link
                      key={student.id}
                      href={`/alunos/${student.slug}`}
                      className="border border-border-strong px-3 py-1 font-sans text-sm text-ivory/90 hover:border-bronze"
                    >
                      {student.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  className="font-sans text-sm text-ivory/85 hover:text-bronze-soft"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  className="font-sans text-sm text-ivory/85 hover:text-bronze-soft"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="font-sans text-sm text-ivory/85 hover:text-bronze-soft"
                >
                  Próxima →
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
