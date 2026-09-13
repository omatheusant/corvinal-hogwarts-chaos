/**
 * Conteúdo padrão da página /a-casa — usado como fallback sempre que o
 * administrador ainda não publicou sua própria versão em
 * `/admin/conteudo`, e como conteúdo de demonstração
 * (`src/lib/demo-data/site-content.ts`). Mantido num único lugar para os
 * dois nunca divergirem, e para a página nunca ficar vazia mesmo com o
 * Supabase configurado e a tabela `site_content` ainda sem nenhuma linha.
 *
 * A história de Rowena Ravenclaw, sua filha Helena e o diadema é
 * reescrita aqui com palavras próprias, a partir de fatos amplamente
 * conhecidos e documentados sobre o universo de Hogwarts (fundação do
 * castelo, o diadema, a Dama Cinzenta, o Barão Sangrento) — não reproduz
 * texto protegido por direitos autorais dos livros ou filmes, além da
 * frase curta já tradicionalmente associada ao diadema, citada como
 * referência.
 */

type CasaContent = { title: string; body: string };

/** Combina o que vier do banco (campos podem ser `null` até o admin
 * preencher) com o conteúdo padrão, campo a campo — nunca deixando a
 * página com um título ou corpo vazio. */
export function resolveCasaContent(
  entry: { title: string | null; body: string | null } | undefined,
  fallback: CasaContent,
): CasaContent {
  return {
    title: entry?.title ?? fallback.title,
    body: entry?.body ?? fallback.body,
  };
}

export const DEFAULT_CASA_CONTENT: Record<string, CasaContent> = {
  casa_historia: {
    title: "Origem",
    body: "Há mais de mil anos, quatro dos bruxos e bruxas mais talentosos de sua época — Godric Gryffindor, Helga Hufflepuff, Rowena Ravenclaw e Salazar Slytherin — uniram-se para erguer um castelo onde jovens magos pudessem aprender a usar sua magia com segurança. Assim nasceu Hogwarts, e com ela as quatro casas que até hoje dividem seus alunos.\n\nCada fundador valorizava uma qualidade acima das outras. Godric buscava a coragem; Helga, a lealdade e o trabalho duro; Salazar, a ambição e a astúcia. Rowena Ravenclaw escolheu a inteligência — não como conhecimento acumulado, mas como a disposição genuína para aprender, questionar e criar. É essa a qualidade que, até hoje, chama alguém para esta casa.\n\nAo contrário das demais, a Corvinal não escolhe por linhagem, coragem ou ambição — escolhe por afinidade com o pensamento. Não é uma casa de respostas fáceis, mas de perguntas bem cuidadas.",
  },
  casa_rowena: {
    title: "Rowena Ravenclaw",
    body: 'Rowena Ravenclaw é lembrada como uma das bruxas mais brilhantes de sua geração — talvez a mais engenhosa entre os quatro fundadores de Hogwarts. A tradição conta que vinha das Terras Altas da Escócia, e que sua sede por conhecimento não tinha limites: diz-se que boa parte dos encantamentos que ainda protegem o castelo carrega sua marca.\n\nSeu bem mais precioso era um diadema de prata, cravejado e lavrado com esmero, dito capaz de aumentar a sabedoria de quem o usasse. Nele, gravou a frase que se tornaria para sempre associada à sua casa:\n\n> "A inteligência sem limites é o maior tesouro do homem."\n\nA águia de seu brasão representa exatamente isso: visão de longo alcance, e a liberdade de pensamento para enxergar o que outros ainda não veem.',
  },
  casa_diadema: {
    title: "A Dama Cinzenta e o diadema perdido",
    body: "Nem toda herança é fácil de carregar. Rowena teve uma filha, Helena Ravenclaw, e é dela que vem uma das histórias mais tristes ligadas à nossa casa.\n\nConta-se que Helena, querendo superar a própria mãe em sabedoria, roubou o diadema e fugiu para a Albânia, onde o escondeu no tronco oco de uma árvore antiga. Rowena, já adoecida, nunca chegou a se despedir da filha — no leito de morte, pediu a um pretendente de Helena, conhecido depois como o Barão Sangrento, que a encontrasse e a trouxesse de volta.\n\nO Barão a encontrou, mas Helena recusou-se a retornar. Tomado por um ciúme que não conseguiu conter, feriu-a fatalmente — e, arrependido, tirou a própria vida logo em seguida. Diz-se que os dois assombram Hogwarts desde então: ele como o fantasma da Sonserina, ela como a Dama Cinzenta, presença silenciosa ainda hoje avistada pelos corredores e pela própria Torre da Corvinal.\n\nO diadema ficou perdido por séculos, exatamente onde Helena o escondera — até ser encontrado, muito tempo depois, e trazido de volta para dentro do próprio castelo, onde permaneceu escondido mais uma vez. Sua história termina como começou: cercada de segredo, e como lembrete de que nem toda sabedoria é usada com sabedoria.",
  },
  casa_valores: {
    title: "Valores, símbolos e tradições",
    body: "As cores da Corvinal são azul e bronze — o azul da noite e do intelecto, o bronze do metal antigo dos instrumentos de estudo. O símbolo da casa é a águia, escolhida por sua visão aguçada e voo alto, a mesma ave que Rowena gravou em seu diadema ao lado do lema da casa.\n\nA Corvinal valoriza sabedoria, criatividade, curiosidade e individualidade — e não pontos, hierarquias ou disputas. Cada aluno é livre para seguir seus próprios interesses, desde que o faça com rigor.",
  },
  casa_sala_comunal: {
    title: "A sala comunal",
    body: "No alto de uma torre, sob um teto pintado com estrelas e nuvens em movimento, fica a sala comunal da Corvinal. Janelas arqueadas emolduram o céu noturno, estantes guardam livros emprestados por gerações de alunos, e a entrada não pede senha — pede que se resolva um enigma. Quem não souber responder, espera até que alguém o faça.",
  },
  casa_nosso_rpg: {
    title: "Nossa trajetória no RPG",
    body: "Este espaço vai reunir, com o tempo, os capítulos que a nossa casa viver na campanha — eventos, decisões e marcos que pertencem à nossa mesa, não ao cânone original. Por enquanto, nenhum acontecimento de campanha foi registrado aqui. Assim que a história avançar, a administração da casa poderá publicá-la nesta seção.",
  },
};
