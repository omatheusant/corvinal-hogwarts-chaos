# Corvinal — A Torre do Conhecimento

Portal de fãs da Casa Corvinal para um RPG de mesa ambientado em Hogwarts:
história da casa, diretório de alunos, mural de acontecimentos e galeria de
memórias — com um painel administrativo para os responsáveis pela casa.

> Projeto de fãs, não oficial e sem fins lucrativos. Não associado à Warner
> Bros. ou a J.K. Rowling.

## Stack

- **Next.js 16** (App Router, Turbopack, TypeScript, Server Components)
- **Tailwind CSS v4** (tokens de design em `src/app/globals.css`)
- **Supabase** — Postgres, Auth e Storage
- **Zod** — validação de formulários e Server Actions

## Rodando localmente sem Supabase (modo de demonstração)

O site público abre e funciona **sem nenhuma credencial**: se
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` não estiverem
definidas, as páginas públicas usam um conjunto de conteúdo de demonstração
local (`src/lib/demo-data/*`), claramente sinalizado por uma faixa
"Modo de demonstração" no topo do site. Isso é intencional — para dar de
cara com o design mesmo antes de configurar qualquer coisa — e não deve
ser confundido com conteúdo real da casa.

Nesse modo, `/admin` mostra uma tela de orientação de configuração em vez
de qualquer formulário: não é possível autenticar nem salvar sem um
projeto Supabase real.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Configuração completa (Supabase real)

### 1. Criar o projeto e as variáveis de ambiente

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie `.env.example` para `.env.local` e preencha
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Project Settings → API).

### 2. Rodar as migrations

Todas as tabelas, políticas de RLS, funções auxiliares e o bucket de
Storage estão em `supabase/migrations/`, em ordem. Com a
[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
instalada e o projeto linkado:

```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

Ou aplique os arquivos manualmente, na ordem, pelo SQL Editor do Supabase
Studio — `supabase/apply-in-sql-editor.sql` já traz todas as 8 migrations
concatenadas em um único arquivo (dentro de uma transação), para colar de
uma vez só num projeto novo.

Um `supabase/seed.sql` opcional está disponível para desenvolvimento local
(`supabase db reset`) com conteúdo de exemplo claramente marcado
"(exemplo)" — **não rode esse seed em produção**.

### 3. Storage

As migrations já criam o bucket **`corvinal-media`** como **privado** (não
marcado como público) e suas políticas de RLS. Isso é proposital: buckets
públicos no Supabase Storage ignoram RLS por completo na URL pública, o
que tornaria impossível esconder rascunhos. Em vez disso, cada imagem é
resolvida por uma *signed URL* de curta duração, gerada no servidor
(`src/lib/supabase/storage.ts`) — e só é emitida quando a linha que
referencia o arquivo (aluno, publicação ou item de galeria) está
publicada.

Nada precisa ser criado manualmente no Storage além de rodar as
migrations.

### 4. Criar o primeiro administrador

Não existe cadastro público de administradores — de propósito, para que
um usuário autenticado comum nunca consiga se autopromover. Para criar o
primeiro:

1. No Supabase Studio, vá em **Authentication → Users → Add user** e
   crie um usuário com e-mail e senha (ou peça para a pessoa se
   cadastrar por conta própria, se você habilitar signup — o app não
   expõe essa tela, mas o Supabase Auth sim, caso configurado).
2. Copie o `user_id` (UUID) desse usuário.
3. No **SQL Editor**, rode:

   ```sql
   insert into public.admin_users (user_id, display_name)
   values ('cole-o-uuid-aqui', 'Nome de quem administra');
   ```

4. Faça login em `/admin/login` com esse e-mail e senha.

Novos administradores são adicionados do mesmo jeito — sempre via SQL,
nunca pela aplicação.

### 5. Rodar

```bash
npm run dev
```

## Estrutura do projeto

```
src/
  app/
    (site)/          páginas públicas (home, /a-casa, /alunos, /mural, /memorias)
    admin/
      login/          tela de login (fora da checagem de autorização)
      (dashboard)/    área autenticada: alunos, mural, galeria, conteúdo, destaques
  components/
    site/             componentes do site público (header, cards, formulários GET)
    visual/           identidade visual: arco ogival, águia, ilustrações SVG, divisórias
    admin/            formulários e casca visual do /admin
    ui/               primitivos genéricos (Button, Dialog acessível)
  lib/
    data/             leitura pública (respeita `published`, cai em demo sem Supabase)
    admin/            leitura/autorização/upload exclusivos do /admin (nunca usa demo)
    demo-data/        conteúdo de demonstração, claramente marcado, nunca em produção
    supabase/         clientes Supabase (browser, server, proxy) e resolução de mídia
    validations/      schemas Zod compartilhados por formulários e Server Actions
  types/              tipos de domínio e do schema do banco
supabase/
  migrations/         schema, RLS e Storage, versionados e numerados
  seed.sql            conteúdo de exemplo opcional para dev local
docs/                 onde documentos de contexto/lore do projeto são esperados (ver abaixo)
public/images/        onde artes e retratos reais são esperados (ver abaixo)
```

## Conteúdo e imagens do projeto

O código procura, opcionalmente, por:

- `docs/CHARACTER_INDEX.md`, `docs/WORLD_AND_LORE.md`, `docs/ART_DIRECTION.md`,
  `docs/CURRENT_TIMELINE.md`, `docs/CANON_DANTE.md` — documentos de contexto
  narrativo da campanha, se existirem, para orientar a redação de conteúdo
  institucional e biografias.
- `public/images/` — artes e retratos-base dos personagens (ex.:
  `public/images/Dante.png` para o retrato de Dante).

Nenhum desses arquivos existe neste repositório no momento — por isso todo
o conteúdo do site (alunos, publicações, memórias, textos institucionais)
está em modo de demonstração, com nomes e histórias fictícios,
identificados como exemplo. Ao adicionar esses arquivos:

- Só cadastre como aluno da Corvinal quem tiver a casa **confirmada** nos
  documentos — ter uma imagem na pasta não é suficiente.
- Não transforme sugestões/rascunhos de lore em acontecimentos
  confirmados do RPG.
- Não publique segredos, traumas privados ou informações conhecidas
  apenas pelos jogadores.
- Preserve as imagens-base dos personagens — não substitua rostos por
  fotos aleatórias; na ausência de um retrato, o site já usa uma moldura
  com monograma no lugar (`src/components/visual/portrait-frame.tsx`).

O cadastro real (alunos, mural, galeria, textos) é feito pelo `/admin`
depois que o Supabase estiver configurado — os arquivos em
`src/lib/demo-data/` nunca são carregados automaticamente em produção.

## Segurança e permissões (resumo)

- RLS habilitada em todas as tabelas: visitantes só leem linhas com
  `published = true`; escrita e leitura de rascunhos exigem
  `public.is_admin()` (checagem contra `admin_users`, `SECURITY DEFINER`).
- `admin_users` não tem política de escrita para nenhum papel do client —
  administradores só são adicionados manualmente via SQL (passo 4 acima).
- Autorização é checada no servidor em toda página e Server Action do
  `/admin` (`src/lib/admin/authorize.ts`), não só no `proxy.ts` (que faz
  apenas o redirecionamento otimista).
- Bucket de Storage privado, com políticas que só liberam leitura de um
  arquivo quando a linha que o referencia está publicada.
- Uploads são validados no servidor por tipo (`image/jpeg`, `image/png`,
  `image/webp`) e tamanho (até 5 MB) antes de qualquer envio ao Storage.
- Conteúdo editorial (biografias, publicações, textos institucionais) é
  renderizado por um parser "markdown-lite" próprio
  (`src/components/site/rich-text.tsx`) — nunca via HTML arbitrário nem
  `dangerouslySetInnerHTML`.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (roda checagem de tipos)
npm run lint     # ESLint
npm run start    # servidor de produção, após o build
```

## O que foi verificado antes da entrega

- `npm run lint`, checagem de tipos (parte de `next build`) e
  `npm run build` — sem erros.
- Navegação, busca e filtros de `/alunos` e `/mural`, estados vazios,
  perfil individual e a galeria com ampliação por teclado — testados
  manualmente em modo de demonstração.
- Confirmado que o modo de demonstração só ativa com as variáveis de
  Supabase ausentes; com as variáveis presentes mas uma falha de conexão,
  o erro sobe para a error boundary em vez de mostrar dados de exemplo.

O que **depende do seu ambiente** e não pôde ser testado aqui:

- Autenticação real, RLS e Storage contra um projeto Supabase de fato
  (só foram revisados estaticamente — migrations e políticas —, não
  executados contra um banco real).
- Conteúdo e imagens reais da campanha, que substituirão os exemplos.
