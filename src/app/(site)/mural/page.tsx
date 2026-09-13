import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { PostFilters } from "@/components/site/post-filters";
import { PostCard } from "@/components/site/post-card";
import { EmptyState } from "@/components/site/empty-state";
import { getPosts } from "@/lib/data/posts";
import type { PostCategory } from "@/types/domain";

export const metadata: Metadata = {
  title: "Mural",
  description: "Avisos, eventos, conquistas e crônicas da Casa Corvinal.",
};

const CATEGORIES: PostCategory[] = ["aviso", "evento", "conquista", "cronica"];

function isPostCategory(value: string | undefined): value is PostCategory {
  return Boolean(value && CATEGORIES.includes(value as PostCategory));
}

export default async function MuralPage(props: PageProps<"/mural">) {
  const searchParams = await props.searchParams;
  const categoryRaw = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const category = isPostCategory(categoryRaw) ? categoryRaw : undefined;

  const { data: posts } = await getPosts({ category });

  return (
    <div className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Mural da casa"
        title="Avisos, eventos, conquistas e crônicas"
        description="O que está acontecendo (ou já aconteceu) com a Corvinal."
      />

      <div className="mt-10">
        <PostFilters category={categoryRaw} />
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Nada publicado ainda nesta categoria"
          description="Volte em breve — ou tente outra categoria no filtro acima."
        />
      ) : (
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
