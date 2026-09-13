import type { SiteContent } from "@/types/domain";
import { DEFAULT_HOME_INTRO_BODY, DEFAULT_HOME_INTRO_TITLE } from "@/lib/content/home-intro";
import { DEFAULT_CASA_CONTENT } from "@/lib/content/casa";

/**
 * Conteúdo institucional de DEMONSTRAÇÃO. Os textos sobre a Corvinal,
 * Rowena Ravenclaw e o diadema (`src/lib/content/casa.ts`) são redigidos
 * de forma autoral, com base em fatos amplamente conhecidos sobre o
 * universo de Hogwarts — não citam nem reproduzem texto protegido por
 * direitos autorais, além da frase curta já tradicionalmente associada ao
 * diadema. A seção "nosso-rpg" fica deliberadamente vazia de eventos:
 * nenhum acontecimento de campanha foi fornecido, e este projeto não deve
 * inventá-los.
 */
function casaEntry(key: keyof typeof DEFAULT_CASA_CONTENT): SiteContent {
  return { key, ...DEFAULT_CASA_CONTENT[key] };
}

export const DEMO_SITE_CONTENT: Record<string, SiteContent> = {
  home_intro: {
    key: "home_intro",
    title: DEFAULT_HOME_INTRO_TITLE,
    body: DEFAULT_HOME_INTRO_BODY,
  },
  value_sabedoria: {
    key: "value_sabedoria",
    title: "Sabedoria",
    body: "Valorizamos quem busca entender antes de concluir — a pergunta bem formulada tem tanto valor quanto a resposta certa.",
  },
  value_criatividade: {
    key: "value_criatividade",
    title: "Criatividade",
    body: "Soluções pouco óbvias, ideias fora do previsto e um certo gosto por reinventar o caminho já conhecido.",
  },
  value_individualidade: {
    key: "value_individualidade",
    title: "Individualidade",
    body: "Cada aluno chega à Corvinal com interesses próprios. A casa não pede uniformidade — pede curiosidade.",
  },
  casa_historia: casaEntry("casa_historia"),
  casa_rowena: casaEntry("casa_rowena"),
  casa_diadema: casaEntry("casa_diadema"),
  casa_valores: casaEntry("casa_valores"),
  casa_sala_comunal: casaEntry("casa_sala_comunal"),
  casa_nosso_rpg: casaEntry("casa_nosso_rpg"),
};
