import { POST_CATEGORY_LABELS } from "@/types/domain";

export function PostFilters({ category }: { category?: string }) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-4 rounded-sm border border-border bg-navy/40 p-6"
    >
      <div className="space-y-1.5">
        <label htmlFor="category" className="font-sans text-xs tracking-wide text-muted uppercase">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          defaultValue={category ?? ""}
          className="border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory focus-visible:outline-2 focus-visible:outline-bronze-soft"
        >
          <option value="">Todas</option>
          {Object.entries(POST_CATEGORY_LABELS).map(([value, label]) => (
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
