import { EagleMark } from "@/components/visual/eagle-mark";

export default function SiteLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-bronze/70">
      <EagleMark className="h-10 w-10 animate-pulse" title="Carregando" />
      <p className="font-sans text-xs tracking-widest uppercase">Carregando…</p>
    </div>
  );
}
