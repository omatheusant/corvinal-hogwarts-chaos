import type { Student } from "@/types/domain";

/**
 * Conteúdo de DEMONSTRAÇÃO — usado apenas quando o Supabase não está
 * configurado (ver `src/lib/env.ts`). Nomes e histórias fictícios,
 * separados de qualquer registro real da campanha. Nunca é carregado
 * automaticamente em produção com Supabase configurado.
 */
export const DEMO_STUDENTS: Student[] = [
  {
    id: "demo-student-1",
    slug: "iris-halloway",
    name: "Íris Halloway",
    schoolYear: 6,
    roleTitle: "Monitora-chefe (exemplo)",
    status: "aluno",
    shortBio: "Estuda runas antigas e coleciona mapas celestes desenhados à mão.",
    biography:
      "Íris chegou à Corvinal no primeiro ano já carregando um caderno cheio de perguntas. Passa boa parte das tardes na biblioteca, entre atlas estelares e runas que ninguém mais se dá ao trabalho de traduzir.\n\n> \"Uma pergunta bem feita vale mais que dez respostas decoradas.\"",
    interests: ["Runas antigas", "Astronomia", "Cartografia"],
    narrativeSkills: ["Tradução de textos arcaicos", "Orientação por estrelas"],
    portraitUrl: null,
    highlightOrder: 1,
  },
  {
    id: "demo-student-2",
    slug: "cassian-thorn",
    name: "Cassian Thorn",
    schoolYear: 4,
    roleTitle: null,
    status: "aluno",
    shortBio: "Curioso por criaturas mágicas raras e sempre com um esboço inacabado.",
    biography:
      "Cassian mantém um diário de campo com anotações sobre criaturas que avistou (ou que jura ter avistado) nos arredores do castelo. É de poucas palavras, mas seus desenhos falam por ele.",
    interests: ["Criaturas mágicas", "Desenho naturalista"],
    narrativeSkills: [],
    portraitUrl: null,
    highlightOrder: 2,
  },
  {
    id: "demo-student-3",
    slug: "marguerite-voss",
    name: "Marguerite Voss",
    schoolYear: 7,
    roleTitle: "Capitã do time de quadribol (exemplo)",
    status: "ex-aluno",
    shortBio: "Formou-se depois de sete anos defendendo as cores azul e bronze no ar.",
    biography:
      "Marguerite dividia o tempo entre os treinos de quadribol e os estudos de aritmancia — e, segundo os colegas, nunca decidiu qual dos dois levava mais a sério. Deixou a Corvinal com o recorde de captura mais rápida do pomo em uma década.",
    interests: ["Quadribol", "Aritmancia"],
    narrativeSkills: ["Liderança de equipe", "Voo em condições adversas"],
    portraitUrl: null,
    highlightOrder: 3,
  },
  {
    id: "demo-student-4",
    slug: "peregrine-oakes",
    name: "Peregrine Oakes",
    schoolYear: 2,
    roleTitle: null,
    status: "aluno",
    shortBio: null,
    biography: null,
    interests: ["Herbologia"],
    narrativeSkills: [],
    portraitUrl: null,
    highlightOrder: null,
  },
];
