/**
 * Aviso discreto exibido quando o site está operando com o conteúdo de
 * demonstração local (Supabase não configurado). Nunca aparece se houver
 * configuração válida — mesmo que uma consulta específica falhe, porque
 * nesse caso o erro sobe para a error boundary em vez de cair aqui.
 */
export function DemoBanner() {
  return (
    <div className="border-b border-bronze/30 bg-navy">
      <p className="container-page py-2 text-center font-sans text-xs tracking-wide text-parchment/80">
        Modo de demonstração — o conteúdo abaixo é ilustrativo, exibido porque o Supabase ainda
        não foi configurado.
      </p>
    </div>
  );
}
