# Imagens do projeto (opcional)

Nenhuma imagem real está presente neste repositório — o site funciona
normalmente sem elas, usando molduras com monograma (retratos) e
ilustrações atmosféricas em SVG (capas e galeria) no lugar de fotos.

Se você adicionar artes/fotos aqui futuramente, o caminho esperado é:

```
public/images/
  characters/
    Dante.png       # retrato-base de Dante, se/quando ele for cadastrado
    <outros-nomes>.png
```

## Regras

- Ter uma imagem nesta pasta **não** cadastra ninguém automaticamente
  como aluno da Corvinal — o cadastro é manual, pelo `/admin`, e só deve
  ser feito para quem tiver a casa confirmada.
- Use `Dante.png` para o retrato de Dante quando ele for cadastrado.
- Preserve as imagens-base dos personagens — não substitua rostos por
  fotos aleatórias ou genéricas.
- Imagens usadas de fato pelo site (retratos, capas de mural, galeria)
  são enviadas pelo `/admin` e armazenadas no Supabase Storage, não
  direto nesta pasta — arquivos aqui em `public/images` servem como
  material de referência/origem, não como a fonte final servida ao
  visitante.
