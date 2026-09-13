import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArchFrame } from "@/components/visual/arch-frame";
import { LibraryScene } from "@/components/visual/illustrations";
import { RichText } from "@/components/site/rich-text";
import { getPostBySlug } from "@/lib/data/posts";
import { POST_CATEGORY_LABELS } from "@/types/domain";
import { formatLongDate } from "@/lib/format-date";

export async function generateMetadata(props: PageProps<"/mural/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: post } = await getPostBySlug(slug);
  if (!post) return { title: "Publicação não encontrada" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function PostPage(props: PageProps<"/mural/[slug]">) {
  const { slug } = await props.params;
  const { data: post } = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pb-28">
      <div className="container-page pt-12 sm:pt-16">
        <Link href="/mural" className="font-sans text-sm text-muted hover:text-bronze-soft">
          ← Voltar para o mural
        </Link>
      </div>

      <header className="container-page max-w-3xl space-y-5 py-12">
        <p className="eyebrow">
          {POST_CATEGORY_LABELS[post.category]}
          {post.publishedAt && ` · Publicado em ${formatLongDate(post.publishedAt)}`}
        </p>
        <h1 className="text-balance font-display text-4xl text-ivory sm:text-5xl">{post.title}</h1>
        {post.category === "evento" && post.eventDate && (
          <p className="font-sans text-sm text-bronze-soft">
            Data do acontecimento: {formatLongDate(post.eventDate)}
          </p>
        )}
        {post.authorLabel && (
          <p className="font-sans text-sm text-muted-foreground">{post.authorLabel}</p>
        )}
      </header>

      <div className="container-page mb-12 max-w-3xl">
        <ArchFrame className="aspect-16/9 w-full">
          {post.coverUrl ? (
            <Image src={post.coverUrl} alt="" fill className="object-cover" sizes="768px" />
          ) : (
            <LibraryScene className="h-full w-full" />
          )}
        </ArchFrame>
      </div>

      <div className="container-page max-w-3xl">
        <RichText content={post.body} />
      </div>
    </article>
  );
}
