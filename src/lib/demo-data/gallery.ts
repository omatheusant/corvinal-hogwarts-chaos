import type { GalleryItem } from "@/types/domain";
import { DEMO_STUDENTS } from "./students";

/**
 * Conteúdo de DEMONSTRAÇÃO. `imageUrl` fica vazio de propósito: sem fotos
 * reais disponíveis, a página de memórias usa as ilustrações atmosféricas
 * (`illustrationVariant`) em vez de simular fotografias que não existem.
 */
export const DEMO_GALLERY: (GalleryItem & {
  illustrationVariant: "tower" | "telescope" | "library" | "common-room" | "map";
})[] = [
  {
    id: "demo-gallery-1",
    title: "Observação de outono (exemplo)",
    caption: "Registro de uma das primeiras vigílias astronômicas do trimestre.",
    imageUrl: "",
    imageWidth: 4,
    imageHeight: 3,
    takenAt: "2026-09-01",
    highlightOrder: 1,
    students: [{ id: DEMO_STUDENTS[0]!.id, slug: DEMO_STUDENTS[0]!.slug, name: DEMO_STUDENTS[0]!.name }],
    illustrationVariant: "telescope",
  },
  {
    id: "demo-gallery-2",
    title: "Estante recém-catalogada (exemplo)",
    caption: "Parte do acervo reorganizado da sala comunal.",
    imageUrl: "",
    imageWidth: 3,
    imageHeight: 4,
    takenAt: "2026-08-19",
    highlightOrder: 2,
    students: [],
    illustrationVariant: "library",
  },
  {
    id: "demo-gallery-3",
    title: "Fim de tarde na sala comunal (exemplo)",
    caption: "Luz de velas, um tabuleiro de xadrez de bruxo abandonado a meio jogo.",
    imageUrl: "",
    imageWidth: 4,
    imageHeight: 3,
    takenAt: "2026-07-05",
    highlightOrder: 3,
    students: [],
    illustrationVariant: "common-room",
  },
  {
    id: "demo-gallery-4",
    title: "A Torre ao entardecer (exemplo)",
    caption: null,
    imageUrl: "",
    imageWidth: 3,
    imageHeight: 4,
    takenAt: null,
    highlightOrder: null,
    students: [],
    illustrationVariant: "tower",
  },
  {
    id: "demo-gallery-5",
    title: "Carta celeste de um aluno (exemplo)",
    caption: "Um mapa desenhado à mão durante a vigília de outono.",
    imageUrl: "",
    imageWidth: 4,
    imageHeight: 4,
    takenAt: "2026-09-01",
    highlightOrder: null,
    students: [{ id: DEMO_STUDENTS[0]!.id, slug: DEMO_STUDENTS[0]!.slug, name: DEMO_STUDENTS[0]!.name }],
    illustrationVariant: "map",
  },
];
