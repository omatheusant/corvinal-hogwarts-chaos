import type { ReactNode } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DemoBanner } from "@/components/site/demo-banner";
import { SiteBackground } from "@/components/site/site-background";
import { MusicPlayer } from "@/components/site/music-player";
import { isSupabaseConfigured } from "@/lib/env";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const demo = !isSupabaseConfigured();

  return (
    <>
      <SiteBackground />
      <Header />
      {demo && <DemoBanner />}
      <main id="conteudo-principal" className="flex-1">
        {children}
      </main>
      <Footer />
      <MusicPlayer />
    </>
  );
}
