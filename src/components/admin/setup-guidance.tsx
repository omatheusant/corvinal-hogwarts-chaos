import { EagleMark } from "@/components/visual/eagle-mark";

export function SetupGuidance() {
  return (
    <div className="max-w-lg space-y-6 border border-bronze/40 bg-navy p-8 shadow-elevated">
      <div className="flex items-center gap-3">
        <EagleMark className="h-8 w-8 text-bronze" />
        <h1 className="font-display text-2xl text-ivory">Supabase ainda não configurado</h1>
      </div>
      <p className="font-serif text-muted">
        O site público está funcionando em modo de demonstração, mas a área administrativa
        precisa de um projeto Supabase real para autenticar e salvar qualquer coisa.
      </p>
      <ol className="list-decimal space-y-2 pl-5 font-sans text-sm text-ivory/90">
        <li>
          Copie <code className="text-bronze-soft">.env.example</code> para{" "}
          <code className="text-bronze-soft">.env.local</code> e preencha{" "}
          <code className="text-bronze-soft">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code className="text-bronze-soft">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </li>
        <li>
          Rode as migrations em <code className="text-bronze-soft">supabase/migrations</code>{" "}
          contra o seu projeto.
        </li>
        <li>
          Crie o bucket de Storage e o primeiro administrador conforme o{" "}
          <code className="text-bronze-soft">README.md</code>.
        </li>
        <li>Reinicie o servidor de desenvolvimento.</li>
      </ol>
    </div>
  );
}
