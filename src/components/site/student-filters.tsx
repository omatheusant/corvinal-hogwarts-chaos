import { AVAILABLE_SCHOOL_YEARS } from "@/lib/constants";
import { STUDENT_STATUS_LABELS } from "@/types/domain";

type StudentFiltersProps = {
  query?: string;
  year?: string;
  status?: string;
};

/**
 * Formulário de busca e filtros construído como GET nativo — funciona sem
 * nenhum JavaScript no cliente (progressive enhancement), é totalmente
 * navegável por teclado e reflete o estado inteiramente na URL.
 */
export function StudentFilters({ query, year, status }: StudentFiltersProps) {
  return (
    <form
      method="get"
      className="grid gap-4 rounded-sm border border-border bg-navy/40 p-6 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
    >
      <div className="space-y-1.5">
        <label htmlFor="q" className="font-sans text-xs tracking-wide text-muted uppercase">
          Buscar por nome
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Ex.: Íris"
          className="w-full border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-bronze-soft"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="year" className="font-sans text-xs tracking-wide text-muted uppercase">
          Ano
        </label>
        <select
          id="year"
          name="year"
          defaultValue={year ?? ""}
          className="w-full border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory focus-visible:outline-2 focus-visible:outline-bronze-soft sm:w-auto"
        >
          <option value="">Todos</option>
          {AVAILABLE_SCHOOL_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}º ano
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="status" className="font-sans text-xs tracking-wide text-muted uppercase">
          Situação
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ""}
          className="w-full border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory focus-visible:outline-2 focus-visible:outline-bronze-soft sm:w-auto"
        >
          <option value="">Todas</option>
          {Object.entries(STUDENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="border border-bronze bg-bronze px-6 py-2 font-sans text-sm text-ink transition-colors hover:bg-bronze-soft"
      >
        Filtrar
      </button>
    </form>
  );
}
