-- Seed OPCIONAL para desenvolvimento local (`supabase db reset` ou
-- `supabase start` + este arquivo). NÃO execute em produção: os títulos
-- trazem "(exemplo)" de propósito e não devem ser confundidos com
-- registros reais da casa. Publicar conteúdo real deve ser feito pelo
-- /admin depois que o Supabase estiver configurado.

insert into public.students
  (slug, name, school_year, role_title, status, short_bio, biography, interests, narrative_skills, published, highlight_order)
values
  ('iris-halloway', 'Íris Halloway', 6, 'Monitora-chefe (exemplo)', 'aluno',
   'Estuda runas antigas e coleciona mapas celestes desenhados à mão.',
   'Íris chegou à Corvinal no primeiro ano já carregando um caderno cheio de perguntas.',
   array['Runas antigas', 'Astronomia', 'Cartografia'], array['Tradução de textos arcaicos'], true, 1),
  ('cassian-thorn', 'Cassian Thorn', 4, null, 'aluno',
   'Curioso por criaturas mágicas raras e sempre com um esboço inacabado.',
   'Cassian mantém um diário de campo com anotações sobre criaturas avistadas nos arredores do castelo.',
   array['Criaturas mágicas', 'Desenho naturalista'], array[]::text[], true, 2),
  ('marguerite-voss', 'Marguerite Voss', 7, 'Capitã do time de quadribol (exemplo)', 'ex-aluno',
   'Formou-se depois de sete anos defendendo as cores azul e bronze no ar.',
   'Marguerite dividia o tempo entre os treinos de quadribol e os estudos de aritmancia.',
   array['Quadribol', 'Aritmancia'], array['Liderança de equipe'], true, 3)
on conflict (slug) do nothing;

insert into public.posts
  (slug, category, title, excerpt, body, author_label, event_date, published, highlight_order)
values
  ('vigilia-de-outono-na-torre', 'evento', 'Vigília de Outono na Torre (exemplo)',
   'Uma noite de observação do céu no topo da Torre da Corvinal, aberta a toda a casa.',
   'Na próxima lua cheia, a Torre estará aberta para uma vigília de observação astronômica.',
   'Conselho da Corvinal', '2026-10-24', true, 1),
  ('novo-catalogo-da-biblioteca', 'aviso', 'Novo catálogo da biblioteca da casa (exemplo)',
   'A sala comunal recebeu uma nova estante com registros de expedições anteriores.',
   'A estante ao lado da lareira foi reorganizada e agora inclui um catálogo com anotações de expedições anteriores.',
   'Monitoria da Corvinal', null, true, 2)
on conflict (slug) do nothing;

insert into public.site_content (key, title, body, published)
values
  ('home_intro', 'Uma casa para quem faz perguntas', $home_intro$Há mais de mil anos a Torre da Corvinal observa o vale de Hogwarts — a mais alta entre as quatro moradas, erguida onde o vento chega primeiro e as nuvens raramente se demoram. Diz-se que Rowena Ravenclaw escolheu justamente esse lugar: para aprender a enxergar longe, primeiro era preciso subir.

Os séculos passaram e a torre mudou pouco. As mesmas escadas em espiral gastas por gerações de passos, as mesmas janelas em arco recortando o céu contra a pedra escura, a mesma sensação — para quem chega pela primeira vez — de que cada degrau custa um pouco de fôlego e devolve um pouco mais de clareza.

Não é a casa mais fácil de se alcançar. Talvez seja exatamente por isso que só permanece nela quem, de fato, quer estar ali: entre livros emprestados, mapas incompletos e instrumentos de latão, cada aluno constrói à sua maneira um caminho até o próprio conhecimento — e a torre existe para dar espaço a essa busca, não para apressá-la.$home_intro$, true),
  ('casa_historia', 'Origem',
   'A Corvinal é uma das quatro casas de Hogwarts, fundada por Rowena Ravenclaw.', true)
on conflict (key) do nothing;
