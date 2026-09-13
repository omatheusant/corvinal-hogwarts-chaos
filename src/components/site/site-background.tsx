import Image from "next/image";

/**
 * Pano de fundo atmosférico fixo do site público: a fotografia do broche
 * da águia (símbolo da casa) cobrindo a janela inteira, com um véu em
 * degradê de azul-marinho por cima para manter a leitura do texto em
 * qualquer seção da página. Fixo (não rola com o conteúdo) — o mesmo
 * enquadramento fica visível na janela inteira em qualquer posição de
 * rolagem, então o véu precisa ser uniformemente escuro o bastante para
 * nunca comprometer o contraste do texto, não só nas bordas.
 *
 * O Hero (`hero.tsx`) soma seu próprio degradê por cima deste, criando um
 * momento mais dramático — revelando mais a foto — só naquele primeiro
 * enquadramento; o restante do site usa este véu mais conservador.
 */
export function SiteBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <Image
        src="/images/background-image.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55 [object-position:38%_30%]"
      />
      <div className="absolute inset-0 bg-navy mix-blend-multiply" style={{ opacity: 0.6 }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,15,28,0.82) 0%, rgba(20,39,66,0.74) 45%, rgba(8,15,28,0.86) 100%)",
        }}
      />
    </div>
  );
}
