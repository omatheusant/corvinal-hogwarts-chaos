import { Fragment } from "react";

type RichTextProps = {
  content: string;
  className?: string;
};

/**
 * Renderizador de texto editorial "markdown-lite", propositalmente
 * limitado: sem `dangerouslySetInnerHTML` e sem qualquer HTML arbitrário
 * vindo do banco. Suporta apenas parágrafos, citações (`> `), listas
 * (`- `), títulos (`## `) e ênfase (`**negrito**`, `*itálico*`) — o
 * suficiente para textos institucionais e publicações do mural, com
 * segurança contra XSS por construção.
 */
export function RichText({ content, className }: RichTextProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-5 ${className ?? ""}`}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h3 key={i} className="font-display text-2xl text-ivory">
              {renderInline(block.text)}
            </h3>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-bronze/60 pl-5 font-serif text-lg italic text-parchment"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 font-serif text-ivory/90">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="font-serif text-base leading-relaxed text-ivory/90 sm:text-lg">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

function parseBlocks(content: string): Block[] {
  const rawParagraphs = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const blocks: Block[] = [];

  for (const raw of rawParagraphs) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading", text: trimmed.slice(3).trim() });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      blocks.push({
        type: "quote",
        text: trimmed
          .split("\n")
          .map((line) => line.replace(/^>\s?/, ""))
          .join(" "),
      });
      continue;
    }

    const lines = trimmed.split("\n");
    if (lines.every((line) => line.trim().startsWith("- "))) {
      blocks.push({ type: "list", items: lines.map((line) => line.trim().slice(2)) });
      continue;
    }

    blocks.push({ type: "paragraph", text: lines.join(" ") });
  }

  return blocks;
}

/** Ênfase inline segura: apenas `**negrito**` e `*itálico*`, sem HTML. */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-ivory">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
